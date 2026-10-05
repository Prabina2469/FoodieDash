package com.foodiedash.restaurant.service;

import com.foodiedash.restaurant.dto.MenuItemDto;
import com.foodiedash.restaurant.dto.RestaurantDto;
import com.foodiedash.restaurant.dto.WishlistDto;
import java.util.List;

public interface RestaurantService {
    List<RestaurantDto> getAllOpenRestaurants();
    RestaurantDto getRestaurantById(Long id);
    RestaurantDto createRestaurant(String ownerId, RestaurantDto dto);
    RestaurantDto updateRestaurant(String ownerId, Long id, RestaurantDto dto);
    void deleteRestaurant(String ownerId, Long id);

    List<MenuItemDto> getRestaurantMenu(Long restaurantId);
    MenuItemDto addMenuItem(String ownerId, Long restaurantId, MenuItemDto dto);
    MenuItemDto updateMenuItem(String ownerId, Long menuId, MenuItemDto dto);
    void deleteMenuItem(String ownerId, Long menuId);

    List<WishlistDto> getUserWishlist(String userId);
    WishlistDto addRestaurantToWishlist(String userId, Long restaurantId);
    WishlistDto addMenuItemToWishlist(String userId, Long menuItemId);
    void removeFromWishlist(String userId, Long wishlistId);
}
