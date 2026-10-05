package com.foodiedash.restaurant.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishlistDto {
    private Long id;
    private String userId;
    private Long restaurantId;
    private Long menuItemId;
    private RestaurantDto restaurant;
    private MenuItemDto menuItem;
    private LocalDateTime createdAt;
}
