package com.foodiedash.restaurant.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantDto {
    private Long id;
    private String ownerId;
    private String name;
    private String cuisine;
    private String address;
    private String phone;
    private Double rating;
    private Boolean isOpen;
    private List<MenuItemDto> menuItems;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
