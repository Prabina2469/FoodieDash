package com.foodiedash.restaurant.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuItemDto {
    private Long id;
    private Long restaurantId;
    private String categoryName;
    private String name;
    private String description;
    private BigDecimal price;
    private Boolean isVeg;
    private Boolean isAvailable;
}
