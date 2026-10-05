package com.foodiedash.fleet.security;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticatedUser {
    private String uid;
    private String email;
    private String name;
    private List<String> roles;

    public boolean isAdmin() {
        return roles != null && roles.contains("ROLE_ADMIN");
    }
}
