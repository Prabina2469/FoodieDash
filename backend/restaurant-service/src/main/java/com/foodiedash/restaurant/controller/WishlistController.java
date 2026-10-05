package com.foodiedash.restaurant.controller;

import com.foodiedash.restaurant.dto.WishlistDto;
import com.foodiedash.restaurant.security.AuthenticatedUser;
import com.foodiedash.restaurant.service.RestaurantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlist")
@CrossOrigin(origins = "*")
public class WishlistController {

    private final RestaurantService restaurantService;

    public WishlistController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    @GetMapping
    public ResponseEntity<List<WishlistDto>> getMyWishlist(@AuthenticationPrincipal AuthenticatedUser principal) {
        List<WishlistDto> wishlist = restaurantService.getUserWishlist(principal.getFirebaseUid());
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping("/restaurants/{restaurantId}")
    public ResponseEntity<WishlistDto> addRestaurantToWishlist(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @PathVariable Long restaurantId) {
        WishlistDto created = restaurantService.addRestaurantToWishlist(principal.getFirebaseUid(), restaurantId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/menu-items/{menuItemId}")
    public ResponseEntity<WishlistDto> addMenuItemToWishlist(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @PathVariable Long menuItemId) {
        WishlistDto created = restaurantService.addMenuItemToWishlist(principal.getFirebaseUid(), menuItemId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/{wishlistId}")
    public ResponseEntity<Void> removeFromWishlist(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @PathVariable Long wishlistId) {
        restaurantService.removeFromWishlist(principal.getFirebaseUid(), wishlistId);
        return ResponseEntity.noContent().build();
    }
}
