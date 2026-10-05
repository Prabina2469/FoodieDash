package com.foodiedash.order.controller;

import com.foodiedash.order.dto.CreateOrderDto;
import com.foodiedash.order.dto.OrderDto;
import com.foodiedash.order.security.AuthenticatedUser;
import com.foodiedash.order.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderDto> placeOrder(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @Valid @RequestBody CreateOrderDto createOrderDto) {
        OrderDto created = orderService.createOrder(principal.getFirebaseUid(), createOrderDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderDto>> getMyOrders(@AuthenticationPrincipal AuthenticatedUser principal) {
        List<OrderDto> orders = orderService.getCustomerOrders(principal.getFirebaseUid());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDto> getOrderById(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @PathVariable Long orderId) {
        OrderDto order = orderService.getOrderById(principal.getFirebaseUid(), orderId);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<OrderDto> cancelOrder(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @PathVariable Long orderId) {
        OrderDto cancelled = orderService.cancelOrder(principal.getFirebaseUid(), orderId);
        return ResponseEntity.ok(cancelled);
    }

    @PostMapping("/{orderId}/reorder")
    public ResponseEntity<Map<String, Object>> reorder(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @PathVariable Long orderId) {
        Map<String, Object> cartResult = orderService.reorder(principal.getFirebaseUid(), orderId);
        return ResponseEntity.ok(cartResult);
    }
}
