package com.foodiedash.fleet.service;

import com.foodiedash.fleet.dto.*;
import com.foodiedash.fleet.entity.Driver;
import com.foodiedash.fleet.entity.DriverStatus;
import com.foodiedash.fleet.entity.VehicleType;
import com.foodiedash.fleet.exception.ResourceNotFoundException;
import com.foodiedash.fleet.repository.DriverRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FleetServiceImpl implements FleetService {

    private final DriverRepository driverRepository;

    @PostConstruct
    public void seedInitialFleetData() {
        if (driverRepository.count() == 0) {
            log.info("Seeding initial fleet courier data for FoodieDash demo...");
            Driver d1 = Driver.builder()
                    .driverId("DRV-101")
                    .name("Marcus Vance")
                    .avatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150")
                    .phone("+1 (555) 234-5678")
                    .vehicle("Super73 E-Bike")
                    .vehicleType(VehicleType.E_BIKE)
                    .status(DriverStatus.EN_ROUTE_DELIVERY)
                    .rating(4.9)
                    .totalDeliveries(1420)
                    .batteryLevel(88)
                    .currentLatitude(40.7128)
                    .currentLongitude(-74.0060)
                    .activeOrderId(1001L)
                    .destinationAddress("742 Evergreen Terrace, New York, NY")
                    .estimatedTimeMinutes(8)
                    .build();

            Driver d2 = Driver.builder()
                    .driverId("DRV-102")
                    .name("Elena Rostova")
                    .avatar("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150")
                    .phone("+1 (555) 876-5432")
                    .vehicle("Niu NQi GT Electric Scooter")
                    .vehicleType(VehicleType.SCOOTER)
                    .status(DriverStatus.EN_ROUTE_PICKUP)
                    .rating(4.95)
                    .totalDeliveries(2150)
                    .batteryLevel(94)
                    .currentLatitude(40.7282)
                    .currentLongitude(-73.9942)
                    .activeOrderId(1002L)
                    .destinationAddress("450 Lexington Ave, New York, NY")
                    .estimatedTimeMinutes(12)
                    .build();

            Driver d3 = Driver.builder()
                    .driverId("DRV-103")
                    .name("Jamal Crawford")
                    .avatar("https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150")
                    .phone("+1 (555) 345-6789")
                    .vehicle("Ford E-Transit Electric Van")
                    .vehicleType(VehicleType.EV_VAN)
                    .status(DriverStatus.IDLE)
                    .rating(4.88)
                    .totalDeliveries(3410)
                    .batteryLevel(72)
                    .currentLatitude(40.7589)
                    .currentLongitude(-73.9851)
                    .build();

            Driver d4 = Driver.builder()
                    .driverId("DRV-104")
                    .name("Aisha Patel")
                    .avatar("https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150")
                    .phone("+1 (555) 901-2345")
                    .vehicle("RadPower Cargo E-Bike")
                    .vehicleType(VehicleType.E_BIKE)
                    .status(DriverStatus.EN_ROUTE_DELIVERY)
                    .rating(4.92)
                    .totalDeliveries(980)
                    .batteryLevel(65)
                    .currentLatitude(40.741895)
                    .currentLongitude(-73.989308)
                    .activeOrderId(1003L)
                    .destinationAddress("120 W 23rd St, New York, NY")
                    .estimatedTimeMinutes(14)
                    .build();

            driverRepository.saveAll(List.of(d1, d2, d3, d4));
            log.info("Successfully seeded 4 FoodieDash fleet couriers.");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<DriverDto> getAllDrivers() {
        return driverRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DriverDto getDriverById(Long id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));
        return mapToDto(driver);
    }

    @Override
    @Transactional(readOnly = true)
    public DriverDto getDriverByDriverId(String driverId) {
        Driver driver = driverRepository.findByDriverId(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with driverId: " + driverId));
        return mapToDto(driver);
    }

    @Override
    @Transactional
    public DriverDto createDriver(CreateDriverDto dto) {
        String generatedDriverId = "DRV-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        Driver driver = Driver.builder()
                .driverId(generatedDriverId)
                .name(dto.getName())
                .avatar(dto.getAvatar() != null ? dto.getAvatar() : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150")
                .phone(dto.getPhone() != null ? dto.getPhone() : "+1 (555) 000-0000")
                .vehicle(dto.getVehicle() != null ? dto.getVehicle() : "Standard E-Bike")
                .vehicleType(dto.getVehicleType() != null ? dto.getVehicleType() : VehicleType.E_BIKE)
                .status(DriverStatus.IDLE)
                .rating(5.0)
                .totalDeliveries(0)
                .batteryLevel(100)
                .currentLatitude(40.7128)
                .currentLongitude(-74.0060)
                .build();

        Driver saved = driverRepository.save(driver);
        return mapToDto(saved);
    }

    @Override
    @Transactional
    public DriverDto updateLocation(Long id, UpdateLocationDto dto) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));

        driver.setCurrentLatitude(dto.getLatitude());
        driver.setCurrentLongitude(dto.getLongitude());
        if (dto.getBatteryLevel() != null) {
            driver.setBatteryLevel(dto.getBatteryLevel());
        }

        Driver updated = driverRepository.save(driver);
        return mapToDto(updated);
    }

    @Override
    @Transactional
    public DriverDto updateStatus(Long id, UpdateDriverStatusDto dto) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));

        driver.setStatus(dto.getStatus());
        if (dto.getActiveOrderId() != null) {
            driver.setActiveOrderId(dto.getActiveOrderId());
        }
        if (dto.getDestinationAddress() != null) {
            driver.setDestinationAddress(dto.getDestinationAddress());
        }
        if (dto.getEstimatedTimeMinutes() != null) {
            driver.setEstimatedTimeMinutes(dto.getEstimatedTimeMinutes());
        }

        if (dto.getStatus() == DriverStatus.DELIVERED || dto.getStatus() == DriverStatus.IDLE) {
            if (dto.getStatus() == DriverStatus.DELIVERED) {
                driver.setTotalDeliveries(driver.getTotalDeliveries() + 1);
            }
            driver.setActiveOrderId(null);
            driver.setDestinationAddress(null);
        }

        Driver updated = driverRepository.save(driver);
        return mapToDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LiveDeliveryDto> getLiveDeliveries() {
        return driverRepository.findAll().stream()
                .filter(d -> d.getStatus() == DriverStatus.EN_ROUTE_PICKUP || d.getStatus() == DriverStatus.EN_ROUTE_DELIVERY)
                .map(this::mapToLiveDeliveryDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public LiveDeliveryDto getDeliveryByOrderId(Long orderId) {
        Driver driver = driverRepository.findByActiveOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("No active delivery found for orderId: " + orderId));
        return mapToLiveDeliveryDto(driver);
    }

    private DriverDto mapToDto(Driver driver) {
        return DriverDto.builder()
                .id(driver.getId())
                .driverId(driver.getDriverId())
                .name(driver.getName())
                .avatar(driver.getAvatar())
                .phone(driver.getPhone())
                .vehicle(driver.getVehicle())
                .vehicleType(driver.getVehicleType())
                .status(driver.getStatus())
                .rating(driver.getRating())
                .totalDeliveries(driver.getTotalDeliveries())
                .batteryLevel(driver.getBatteryLevel())
                .currentLatitude(driver.getCurrentLatitude())
                .currentLongitude(driver.getCurrentLongitude())
                .activeOrderId(driver.getActiveOrderId())
                .destinationAddress(driver.getDestinationAddress())
                .estimatedTimeMinutes(driver.getEstimatedTimeMinutes())
                .createdAt(driver.getCreatedAt())
                .updatedAt(driver.getUpdatedAt())
                .build();
    }

    private LiveDeliveryDto mapToLiveDeliveryDto(Driver driver) {
        return LiveDeliveryDto.builder()
                .id("DEL-" + driver.getId())
                .orderId(driver.getActiveOrderId())
                .driverName(driver.getName())
                .driverAvatar(driver.getAvatar())
                .driverPhone(driver.getPhone())
                .vehicle(driver.getVehicle())
                .status(driver.getStatus())
                .batteryLevel(driver.getBatteryLevel())
                .currentLatitude(driver.getCurrentLatitude())
                .currentLongitude(driver.getCurrentLongitude())
                .destinationAddress(driver.getDestinationAddress())
                .etaMinutes(driver.getEstimatedTimeMinutes())
                .build();
    }
}
