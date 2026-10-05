package com.foodiedash.fleet.controller;

import com.foodiedash.fleet.dto.*;
import com.foodiedash.fleet.service.FleetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FleetController {

    private final FleetService fleetService;

    @GetMapping("/fleet")
    public ResponseEntity<List<DriverDto>> getAllDrivers() {
        return ResponseEntity.ok(fleetService.getAllDrivers());
    }

    @GetMapping("/fleet/{id}")
    public ResponseEntity<DriverDto> getDriverById(@PathVariable Long id) {
        return ResponseEntity.ok(fleetService.getDriverById(id));
    }

    @PostMapping("/fleet")
    public ResponseEntity<DriverDto> createDriver(@Valid @RequestBody CreateDriverDto dto) {
        return new ResponseEntity<>(fleetService.createDriver(dto), HttpStatus.CREATED);
    }

    @PutMapping("/fleet/{id}/location")
    public ResponseEntity<DriverDto> updateLocation(@PathVariable Long id, @Valid @RequestBody UpdateLocationDto dto) {
        return ResponseEntity.ok(fleetService.updateLocation(id, dto));
    }

    @PutMapping("/fleet/{id}/status")
    public ResponseEntity<DriverDto> updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateDriverStatusDto dto) {
        return ResponseEntity.ok(fleetService.updateStatus(id, dto));
    }

    @GetMapping("/deliveries/live")
    public ResponseEntity<List<LiveDeliveryDto>> getLiveDeliveries() {
        return ResponseEntity.ok(fleetService.getLiveDeliveries());
    }

    @GetMapping("/deliveries/order/{orderId}")
    public ResponseEntity<LiveDeliveryDto> getDeliveryByOrderId(@PathVariable Long orderId) {
        return ResponseEntity.ok(fleetService.getDeliveryByOrderId(orderId));
    }
}
