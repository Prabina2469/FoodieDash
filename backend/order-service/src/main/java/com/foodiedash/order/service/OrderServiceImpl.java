package com.foodiedash.order.service;

import com.foodiedash.order.dto.CreateOrderDto;
import com.foodiedash.order.dto.OrderDto;
import com.foodiedash.order.dto.OrderItemDto;
import com.foodiedash.order.entity.Order;
import com.foodiedash.order.entity.OrderItem;
import com.foodiedash.order.entity.OrderStatus;
import com.foodiedash.order.exception.ForbiddenException;
import com.foodiedash.order.exception.ResourceNotFoundException;
import com.foodiedash.order.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;

    public OrderServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public OrderDto createOrder(String customerId, CreateOrderDto dto) {
        BigDecimal totalAmount = dto.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .customerId(customerId)
                .restaurantId(dto.getRestaurantId())
                .deliveryAddressId(dto.getDeliveryAddressId())
                .status(OrderStatus.PENDING)
                .totalAmount(totalAmount)
                .items(new ArrayList<>())
                .build();

        for (OrderItemDto itemDto : dto.getItems()) {
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .menuItemId(itemDto.getMenuItemId())
                    .itemName(itemDto.getItemName() != null ? itemDto.getItemName() : "Item #" + itemDto.getMenuItemId())
                    .quantity(itemDto.getQuantity())
                    .price(itemDto.getPrice())
                    .build();
            order.getItems().add(orderItem);
        }

        Order saved = orderRepository.save(order);
        return mapToOrderDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderDto> getCustomerOrders(String customerId) {
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId)
                .stream()
                .map(this::mapToOrderDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDto getOrderById(String customerId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getCustomerId().equals(customerId)) {
            throw new ForbiddenException("You are not authorized to access this order");
        }

        return mapToOrderDto(order);
    }

    @Override
    public OrderDto cancelOrder(String customerId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        // 1. Ownership check
        if (!order.getCustomerId().equals(customerId)) {
            throw new ForbiddenException("You are not authorized to cancel this order");
        }

        // 2. Cancellation status eligibility check
        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new IllegalStateException("Order cannot be cancelled in status: " + order.getStatus());
        }

        // 3. Update status
        order.setStatus(OrderStatus.CANCELLED);
        Order updated = orderRepository.save(order);
        return mapToOrderDto(updated);
    }

    @Override
    public Map<String, Object> reorder(String customerId, Long orderId) {
        Order previousOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        // 1. Verify ownership of previous order
        if (!previousOrder.getCustomerId().equals(customerId)) {
            throw new ForbiddenException("You are not authorized to reorder this order");
        }

        // 2. Extract items for cart reorder flow (Simulating re-populating cart)
        List<Map<String, Object>> reorderCartItems = previousOrder.getItems().stream().map(item -> {
            Map<String, Object> cartItem = new HashMap<>();
            cartItem.put("menuItemId", item.getMenuItemId());
            cartItem.put("itemName", item.getItemName());
            cartItem.put("quantity", item.getQuantity());
            cartItem.put("price", item.getPrice());
            cartItem.put("available", true);
            return cartItem;
        }).collect(Collectors.toList());

        Map<String, Object> cartPayload = new HashMap<>();
        cartPayload.put("message", "Items successfully loaded into cart for review");
        cartPayload.put("restaurantId", previousOrder.getRestaurantId());
        cartPayload.put("items", reorderCartItems);
        cartPayload.put("autoPlaced", false); // Explicit requirement: do not auto-place order

        return cartPayload;
    }

    private OrderDto mapToOrderDto(Order order) {
        List<OrderItemDto> itemDtos = order.getItems() != null
                ? order.getItems().stream().map(this::mapToItemDto).collect(Collectors.toList())
                : List.of();

        return OrderDto.builder()
                .id(order.getId())
                .customerId(order.getCustomerId())
                .restaurantId(order.getRestaurantId())
                .deliveryAddressId(order.getDeliveryAddressId())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .items(itemDtos)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private OrderItemDto mapToItemDto(OrderItem item) {
        BigDecimal subTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        return OrderItemDto.builder()
                .id(item.getId())
                .menuItemId(item.getMenuItemId())
                .itemName(item.getItemName())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .subTotal(subTotal)
                .build();
    }
}
