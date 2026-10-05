package com.foodiedash.fleet.repository;

import com.foodiedash.fleet.entity.Driver;
import com.foodiedash.fleet.entity.DriverStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByDriverId(String driverId);
    List<Driver> findByStatus(DriverStatus status);
    Optional<Driver> findByActiveOrderId(Long activeOrderId);
}
