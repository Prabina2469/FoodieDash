package com.foodiedash.order.service;

import com.foodiedash.order.dto.CreateOrderDto;
import com.foodiedash.order.dto.OrderDto;
import java.util.List;
import java.util.Map;

public interface OrderService {
    OrderDto createOrder(String customerId, CreateOrderDto dto);
    List<OrderDto> getCustomerOrders(String customerId);
    OrderDto getOrderById(String customerId, Long orderId);
    OrderDto cancelOrder(String customerId, Long orderId);
    Map<String, Object> reorder(String customerId, Long orderId);
}
