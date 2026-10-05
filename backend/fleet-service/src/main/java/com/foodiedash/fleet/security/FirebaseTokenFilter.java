package com.foodiedash.fleet.security;

import com.google.firebase.FirebaseApp;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
@Slf4j
public class FirebaseTokenFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                if (!FirebaseApp.getApps().isEmpty()) {
                    FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(token);
                    AuthenticatedUser user = AuthenticatedUser.builder()
                            .uid(decodedToken.getUid())
                            .email(decodedToken.getEmail())
                            .name(decodedToken.getName())
                            .roles(List.of("ROLE_USER"))
                            .build();

                    FirebaseAuthenticationToken authentication = new FirebaseAuthenticationToken(
                            user,
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                    );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    AuthenticatedUser mockUser = AuthenticatedUser.builder()
                            .uid("dev-driver-uid")
                            .email("driver@foodiedash.com")
                            .name("Dev Driver")
                            .roles(List.of("ROLE_USER", "ROLE_ADMIN"))
                            .build();

                    FirebaseAuthenticationToken authentication = new FirebaseAuthenticationToken(
                            mockUser,
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                    );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                log.error("Failed to authenticate Firebase Token: {}", e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
