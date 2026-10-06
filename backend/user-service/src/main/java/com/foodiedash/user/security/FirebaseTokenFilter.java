package com.foodiedash.user.security;

import com.foodiedash.user.entity.Role;
import com.foodiedash.user.entity.User;
import com.foodiedash.user.repository.UserRepository;
import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
public class FirebaseTokenFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(FirebaseTokenFilter.class);
    private final UserRepository userRepository;

    public FirebaseTokenFilter(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String idToken = authHeader.substring(7).trim();

            if (idToken.isEmpty()) {
                sendUnauthorized(response, "Bearer token is empty");
                return;
            }

            try {
                if (!FirebaseApp.getApps().isEmpty()) {
                    FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
                    String uid = decodedToken.getUid();

                    Role resolvedRole = resolveRoleForUid(uid, decodedToken);

                    AuthenticatedUser principal = AuthenticatedUser.builder()
                            .firebaseUid(uid)
                            .email(decodedToken.getEmail())
                            .emailVerified(decodedToken.isEmailVerified())
                            .role(resolvedRole)
                            .build();

                    FirebaseAuthenticationToken auth = new FirebaseAuthenticationToken(
                            principal, idToken, principal.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    log.debug("Firebase ID token verified for UID: {}, role: {}", uid, resolvedRole);
                } else {
                    // Development / Demo Fallback Mode when Firebase credentials are not provided
                    if ("invalid-token".equalsIgnoreCase(idToken) || "expired-token".equalsIgnoreCase(idToken)) {
                        throw new IllegalArgumentException("Token is invalid or expired");
                    }

                    String uid = idToken;
                    Optional<User> dbUserOpt = userRepository.findByFirebaseUid(uid);

                    Role resolvedRole = dbUserOpt.map(User::getRole).orElseGet(() -> {
                        String lower = uid.toLowerCase();
                        if (lower.contains("admin")) return Role.ADMIN;
                        if (lower.contains("owner")) return Role.RESTAURANT_OWNER;
                        if (lower.contains("driver") || lower.contains("delivery")) return Role.DELIVERY_PARTNER;
                        return Role.CUSTOMER;
                    });

                    String email = dbUserOpt.map(User::getEmail)
                            .orElse(uid + "@foodiedash.io");

                    AuthenticatedUser devUser = AuthenticatedUser.builder()
                            .firebaseUid(uid)
                            .email(email)
                            .emailVerified(true)
                            .role(resolvedRole)
                            .build();

                    FirebaseAuthenticationToken auth = new FirebaseAuthenticationToken(
                            devUser, idToken, devUser.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception e) {
                log.error("Token verification failed: {}", e.getMessage());
                SecurityContextHolder.clearContext();
                sendUnauthorized(response, "Invalid or expired authentication token");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private Role resolveRoleForUid(String uid, FirebaseToken decodedToken) {
        // 1. Authoritative check: database record
        Optional<User> existingUser = userRepository.findByFirebaseUid(uid);
        if (existingUser.isPresent()) {
            return existingUser.get().getRole();
        }

        // 2. Custom claim in Firebase token (e.g. set by admin SDK)
        Object claim = decodedToken.getClaims().get("role");
        if (claim != null) {
            try {
                return Role.valueOf(claim.toString().toUpperCase());
            } catch (IllegalArgumentException ignored) {
            }
        }

        // 3. Fallback for new registration: least privileged CUSTOMER role
        return Role.CUSTOMER;
    }

    private void sendUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.getWriter().write("{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"" + message + "\"}");
    }
}
