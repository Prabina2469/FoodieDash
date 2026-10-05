package com.foodiedash.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressDto {
    private Long id;
    
    @NotBlank(message = "Label is required (e.g. Home, Work)")
    private String label;

    @NotBlank(message = "Street address is required")
    private String streetAddress;

    private String aptSuite;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    @NotBlank(message = "Zip code is required")
    private String zipCode;

    private boolean isDefault;
}
