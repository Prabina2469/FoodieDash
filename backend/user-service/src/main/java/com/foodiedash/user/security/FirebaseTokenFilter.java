package com.foodiedash.user.security;

import com.foodiedash.user.entity.Role;
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

@Component
public class FirebaseTokenFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(FirebaseTokenFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String idToken = authHeader.substring(7);

            try {
                if (!FirebaseApp.getApps().isEmpty()) {
                    FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
                    
                    AuthenticatedUser principal = AuthenticatedUser.builder()
                            .firebaseUid(decodedToken.getUid())
                            .email(decodedToken.getEmail())
                            .emailVerified(decodedToken.isEmailVerified())
                            .role(Role.CUSTOMER)
                            .build();

                    FirebaseAuthenticationToken auth = new FirebaseAuthenticationToken(
                            principal, idToken, principal.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                    log.debug("Firebase ID token verified for UID: {}", decodedToken.getUid());
                } else {
                    // Development / Demo Fallback Mode when Firebase credentials are not provided
                    AuthenticatedUser devUser = AuthenticatedUser.builder()
                            .firebaseUid(idToken)
                            .email("user@" + idToken.toLowerCase() + ".io")
                            .emailVerified(true)
                            .role(Role.CUSTOMER)
                            .build();

                    FirebaseAuthenticationToken auth = new FirebaseAuthenticationToken(
                            devUser, idToken, devUser.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception e) {
                log.error("Firebase token validation failed: {}", e.getMessage());
                SecurityContextHolder.clearContext();
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"Invalid or expired Firebase ID token\"}");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
