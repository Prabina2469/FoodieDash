package com.foodiedash.fleet.service;

import com.foodiedash.fleet.dto.*;

import java.util.List;

public interface FleetService {
    List<DriverDto> getAllDrivers();
    DriverDto getDriverById(Long id);
    DriverDto getDriverByDriverId(String driverId);
    DriverDto createDriver(CreateDriverDto dto);
    DriverDto updateLocation(Long id, UpdateLocationDto dto);
    DriverDto updateStatus(Long id, UpdateDriverStatusDto dto);
    List<LiveDeliveryDto> getLiveDeliveries();
    LiveDeliveryDto getDeliveryByOrderId(Long orderId);
}
