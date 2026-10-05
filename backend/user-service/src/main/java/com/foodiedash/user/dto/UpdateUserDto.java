package com.foodiedash.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateUserDto {
    @NotBlank(message = "Name cannot be blank")
    private String name;
    private String phoneNumber;
}
