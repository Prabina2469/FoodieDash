package com.foodiedash.user;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class UserControllerSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Unauthenticated request to protected endpoint should be denied")
    public void unauthenticatedRequest_shouldBeDenied() throws Exception {
        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("CUSTOMER role can access /api/v1/users/me with backend-authoritative role")
    public void customerToken_canAccessMyProfile_returnsCustomerRole() throws Exception {
        mockMvc.perform(get("/api/v1/users/me")
                .header("Authorization", "Bearer demo-customer-sarah"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role", is("CUSTOMER")))
                .andExpect(jsonPath("$.email", is("sarah.jenkins@foodiedash.io")));
    }

    @Test
    @DisplayName("CUSTOMER role cannot access admin endpoint /api/v1/users (HTTP 403 FORBIDDEN)")
    public void customerToken_cannotAccessAdminUsersEndpoint_isForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/users")
                .header("Authorization", "Bearer demo-customer-sarah"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("RESTAURANT_OWNER role cannot access admin endpoint /api/v1/users (HTTP 403 FORBIDDEN)")
    public void restaurantOwnerToken_cannotAccessAdminUsersEndpoint_isForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/users")
                .header("Authorization", "Bearer dev-owner-1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("DELIVERY_PARTNER role cannot access admin endpoint /api/v1/users (HTTP 403 FORBIDDEN)")
    public void deliveryPartnerToken_cannotAccessAdminUsersEndpoint_isForbidden() throws Exception {
        mockMvc.perform(get("/api/v1/users")
                .header("Authorization", "Bearer dev-driver-1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("ADMIN role can access admin endpoint /api/v1/users (HTTP 200 OK)")
    public void adminToken_canAccessAdminUsersEndpoint_isOk() throws Exception {
        mockMvc.perform(get("/api/v1/users")
                .header("Authorization", "Bearer dev-admin-alex"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Invalid or expired token is denied with HTTP 401 UNAUTHORIZED")
    public void invalidToken_isDeniedUnauthorized() throws Exception {
        mockMvc.perform(get("/api/v1/users/me")
                .header("Authorization", "Bearer invalid-token"))
                .andExpect(status().isUnauthorized());
    }
}
