package com.foodiedash.cart.service;

import com.foodiedash.cart.dto.AddToCartDto;
import com.foodiedash.cart.dto.CartDto;
import com.foodiedash.cart.dto.UpdateCartItemDto;

public interface CartService {
    CartDto getCart(String userId);
    CartDto addItem(String userId, AddToCartDto dto);
    CartDto updateItemQuantity(String userId, Long itemId, UpdateCartItemDto dto);
    CartDto removeItem(String userId, Long itemId);
    void clearCart(String userId);
}
