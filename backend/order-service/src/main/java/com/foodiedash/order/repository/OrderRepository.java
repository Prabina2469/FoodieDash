package com.foodiedash.order.repository;

import com.foodiedash.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerIdOrderByCreatedAtDesc(String customerId);
    Optional<Order> findByIdAndCustomerId(Long id, String customerId);
}
