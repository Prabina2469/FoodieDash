package com.foodiedash.fleet.dto;

import com.foodiedash.fleet.entity.VehicleType;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateDriverDto {
    @NotBlank(message = "Driver name is required")
    private String name;

    private String avatar;

    private String phone;

    private String vehicle;

    private VehicleType vehicleType;
}
