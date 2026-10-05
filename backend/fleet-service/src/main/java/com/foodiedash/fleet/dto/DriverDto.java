package com.foodiedash.fleet.dto;

import com.foodiedash.fleet.entity.DriverStatus;
import com.foodiedash.fleet.entity.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriverDto {
    private Long id;
    private String driverId;
    private String name;
    private String avatar;
    private String phone;
    private String vehicle;
    private VehicleType vehicleType;
    private DriverStatus status;
    private Double rating;
    private Integer totalDeliveries;
    private Integer batteryLevel;
    private Double currentLatitude;
    private Double currentLongitude;
    private Long activeOrderId;
    private String destinationAddress;
    private Integer estimatedTimeMinutes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
