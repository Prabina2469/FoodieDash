package com.foodiedash.restaurant.controller;

import com.foodiedash.restaurant.dto.MenuItemDto;
import com.foodiedash.restaurant.dto.RestaurantDto;
import com.foodiedash.restaurant.security.AuthenticatedUser;
import com.foodiedash.restaurant.service.RestaurantService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class RestaurantController {

    private final RestaurantService restaurantService;

    public RestaurantController(RestaurantService restaurantService) {
        this.restaurantService = restaurantService;
    }

    // Public browsing APIs
    @GetMapping("/restaurants")
    public ResponseEntity<List<RestaurantDto>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantService.getAllOpenRestaurants());
    }

    @GetMapping("/restaurants/{id}")
    public ResponseEntity<RestaurantDto> getRestaurantById(@PathVariable Long id) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }

    @GetMapping("/restaurants/{id}/menu")
    public ResponseEntity<List<MenuItemDto>> getRestaurantMenu(@PathVariable Long id) {
        return ResponseEntity.ok(restaurantService.getRestaurantMenu(id));
    }

    // Owner / Protected management APIs
    @PostMapping("/restaurants")
    public ResponseEntity<RestaurantDto> createRestaurant(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @Valid @RequestBody RestaurantDto dto) {
        RestaurantDto created = restaurantService.createRestaurant(principal.getFirebaseUid(), dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/restaurants/{id}")
    public ResponseEntity<RestaurantDto> updateRestaurant(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @PathVariable Long id,
            @Valid @RequestBody RestaurantDto dto) {
        RestaurantDto updated = restaurantService.updateRestaurant(principal.getFirebaseUid(), id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/restaurants/{id}")
    public ResponseEntity<Void> deleteRestaurant(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @PathVariable Long id) {
        restaurantService.deleteRestaurant(principal.getFirebaseUid(), id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/restaurants/{id}/menu")
    public ResponseEntity<MenuItemDto> addMenuItem(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @PathVariable Long id,
            @Valid @RequestBody MenuItemDto dto) {
        MenuItemDto created = restaurantService.addMenuItem(principal.getFirebaseUid(), id, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/menu/{menuId}")
    public ResponseEntity<MenuItemDto> updateMenuItem(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @PathVariable Long menuId,
            @Valid @RequestBody MenuItemDto dto) {
        MenuItemDto updated = restaurantService.updateMenuItem(principal.getFirebaseUid(), menuId, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/menu/{menuId}")
    public ResponseEntity<Void> deleteMenuItem(
            @AuthenticationPrincipal AuthenticatedUser principal,
            @PathVariable Long menuId) {
        restaurantService.deleteMenuItem(principal.getFirebaseUid(), menuId);
        return ResponseEntity.noContent().build();
    }
}
