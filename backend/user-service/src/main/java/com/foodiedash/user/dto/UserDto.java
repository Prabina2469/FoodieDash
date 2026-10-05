package com.foodiedash.user.dto;

import com.foodiedash.user.entity.Role;
import com.foodiedash.user.entity.UserStatus;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String firebaseUid;
    private String name;
    private String email;
    private String phoneNumber;
    private Role role;
    private boolean emailVerified;
    private UserStatus status;
    private List<AddressDto> addresses;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
