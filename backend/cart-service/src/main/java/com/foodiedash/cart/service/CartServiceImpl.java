package com.foodiedash.cart.service;

import com.foodiedash.cart.dto.*;
import com.foodiedash.cart.entity.Cart;
import com.foodiedash.cart.entity.CartItem;
import com.foodiedash.cart.exception.ResourceNotFoundException;
import com.foodiedash.cart.repository.CartItemRepository;
import com.foodiedash.cart.repository.CartRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    public CartServiceImpl(CartRepository cartRepository, CartItemRepository cartItemRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    @Override
    public CartDto getCart(String userId) {
        Cart cart = getOrCreateCartEntity(userId);
        return mapToCartDto(cart);
    }

    @Override
    public CartDto addItem(String userId, AddToCartDto dto) {
        Cart cart = getOrCreateCartEntity(userId);

        // If cart belongs to a different restaurant, clear previous items
        if (cart.getRestaurantId() != null && !cart.getRestaurantId().equals(dto.getRestaurantId())) {
            cart.getItems().clear();
        }
        cart.setRestaurantId(dto.getRestaurantId());

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getMenuItemId().equals(dto.getMenuItemId()))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + dto.getQuantity());
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .menuItemId(dto.getMenuItemId())
                    .itemName(dto.getItemName() != null ? dto.getItemName() : "Menu Item #" + dto.getMenuItemId())
                    .price(dto.getPrice())
                    .quantity(dto.getQuantity())
                    .build();
            cart.getItems().add(newItem);
        }

        Cart saved = cartRepository.save(cart);
        return mapToCartDto(saved);
    }

    @Override
    public CartDto updateItemQuantity(String userId, Long itemId, UpdateCartItemDto dto) {
        Cart cart = getOrCreateCartEntity(userId);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        item.setQuantity(dto.getQuantity());
        Cart saved = cartRepository.save(cart);
        return mapToCartDto(saved);
    }

    @Override
    public CartDto removeItem(String userId, Long itemId) {
        Cart cart = getOrCreateCartEntity(userId);

        boolean removed = cart.getItems().removeIf(item -> item.getId().equals(itemId));
        if (!removed) {
            throw new ResourceNotFoundException("Cart item not found");
        }

        if (cart.getItems().isEmpty()) {
            cart.setRestaurantId(null);
        }

        Cart saved = cartRepository.save(cart);
        return mapToCartDto(saved);
    }

    @Override
    public void clearCart(String userId) {
        Cart cart = getOrCreateCartEntity(userId);
        cart.getItems().clear();
        cart.setRestaurantId(null);
        cartRepository.save(cart);
    }

    private Cart getOrCreateCartEntity(String userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> cartRepository.save(Cart.builder()
                        .userId(userId)
                        .items(new ArrayList<>())
                        .build()));
    }

    private CartDto mapToCartDto(Cart cart) {
        List<CartItemDto> itemDtos = cart.getItems() != null
                ? cart.getItems().stream().map(this::mapToItemDto).collect(Collectors.toList())
                : List.of();

        return CartDto.builder()
                .id(cart.getId())
                .userId(cart.getUserId())
                .restaurantId(cart.getRestaurantId())
                .items(itemDtos)
                .totalAmount(cart.getTotalAmount())
                .createdAt(cart.getCreatedAt())
                .updatedAt(cart.getUpdatedAt())
                .build();
    }

    private CartItemDto mapToItemDto(CartItem item) {
        BigDecimal subTotal = item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
        return CartItemDto.builder()
                .id(item.getId())
                .menuItemId(item.getMenuItemId())
                .itemName(item.getItemName())
                .quantity(item.getQuantity())
                .price(item.getPrice())
                .subTotal(subTotal)
                .build();
    }
}
