package com.foodiedash.fleet.dto;

import com.foodiedash.fleet.entity.DriverStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LiveDeliveryDto {
    private String id;
    private Long orderId;
    private String driverName;
    private String driverAvatar;
    private String driverPhone;
    private String vehicle;
    private DriverStatus status;
    private Integer batteryLevel;
    private Double currentLatitude;
    private Double currentLongitude;
    private String destinationAddress;
    private Integer etaMinutes;
}
