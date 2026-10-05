package com.foodiedash.fleet.dto;

import com.foodiedash.fleet.entity.DriverStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateDriverStatusDto {
    @NotNull(message = "Status is required")
    private DriverStatus status;

    private Long activeOrderId;

    private String destinationAddress;

    private Integer estimatedTimeMinutes;
}
