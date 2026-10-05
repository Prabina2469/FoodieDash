package com.foodiedash.fleet.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "drivers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String driverId;

    @Column(nullable = false)
    private String name;

    private String avatar;

    private String phone;

    private String vehicle;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VehicleType vehicleType = VehicleType.E_BIKE;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private DriverStatus status = DriverStatus.IDLE;

    @Builder.Default
    private Double rating = 4.9;

    @Builder.Default
    private Integer totalDeliveries = 0;

    @Builder.Default
    private Integer batteryLevel = 100;

    @Builder.Default
    private Double currentLatitude = 40.7128;

    @Builder.Default
    private Double currentLongitude = -74.0060;

    private Long activeOrderId;

    private String destinationAddress;

    @Builder.Default
    private Integer estimatedTimeMinutes = 15;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
