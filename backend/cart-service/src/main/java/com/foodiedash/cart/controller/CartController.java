package com.foodiedash.cart.controller;

import com.foodiedash.cart.dto.AddToCartDto;
import com.foodiedash.cart.dto.CartDto;
import com.foodiedash.cart.dto.UpdateCartItemDto;
import com.foodiedash.cart.security.AuthenticatedUser;
import com.foodiedash.cart.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartDto> getMyCart(@AuthenticationPrincipal AuthenticatedUser principal) {
        CartDto cart = cartService.getCart(principal.getFirebaseUid());
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/items")
    public ResponseEntity<CartDto> addItemToCart(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @Valid @RequestBody AddToCartDto dto) {
        CartDto updatedCart = cartService.addItem(principal.getFirebaseUid(), dto);
        return ResponseEntity.ok(updatedCart);
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartDto> updateItemQuantity(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemDto dto) {
        CartDto updatedCart = cartService.updateItemQuantity(principal.getFirebaseUid(), itemId, dto);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartDto> removeItemFromCart(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @PathVariable Long itemId) {
        CartDto updatedCart = cartService.removeItem(principal.getFirebaseUid(), itemId);
        return ResponseEntity.ok(updatedCart);
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal AuthenticatedUser principal) {
        cartService.clearCart(principal.getFirebaseUid());
        return ResponseEntity.noContent().build();
    }
}
