package com.foodiedash.restaurant.service;

import com.foodiedash.restaurant.dto.MenuItemDto;
import com.foodiedash.restaurant.dto.RestaurantDto;
import com.foodiedash.restaurant.dto.WishlistDto;
import com.foodiedash.restaurant.entity.MenuItem;
import com.foodiedash.restaurant.entity.Restaurant;
import com.foodiedash.restaurant.entity.Wishlist;
import com.foodiedash.restaurant.repository.MenuItemRepository;
import com.foodiedash.restaurant.repository.RestaurantRepository;
import com.foodiedash.restaurant.repository.WishlistRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RestaurantServiceImpl implements RestaurantService {

    private static final Logger log = LoggerFactory.getLogger(RestaurantServiceImpl.class);

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final WishlistRepository wishlistRepository;

    public RestaurantServiceImpl(
            RestaurantRepository restaurantRepository,
            MenuItemRepository menuItemRepository,
            WishlistRepository wishlistRepository) {
        this.restaurantRepository = restaurantRepository;
        this.menuItemRepository = menuItemRepository;
        this.wishlistRepository = wishlistRepository;
    }

    @PostConstruct
    public void seedInitialRestaurants() {
        if (restaurantRepository.count() == 0) {
            log.info("Seeding initial FoodieDash restaurant catalog and menus...");
            Restaurant r1 = Restaurant.builder()
                    .ownerId("dev-owner-1")
                    .name("Trattoria Bella")
                    .cuisine("Italian")
                    .address("142 Mercer St, New York, NY")
                    .phone("+1 (555) 345-9876")
                    .rating(4.8)
                    .isOpen(true)
                    .menuItems(new ArrayList<>())
                    .build();

            MenuItem m1 = MenuItem.builder()
                    .restaurant(r1)
                    .categoryName("Pasta")
                    .name("Truffle Tagliatelle")
                    .description("Fresh handmade tagliatelle with Umbrian black truffle cream sauce and aged parmesan.")
                    .price(new BigDecimal("24.50"))
                    .isVeg(true)
                    .isAvailable(true)
                    .build();

            MenuItem m2 = MenuItem.builder()
                    .restaurant(r1)
                    .categoryName("Pizza")
                    .name("Margherita D.O.P.")
                    .description("San Marzano tomatoes, buffalo mozzarella, fresh basil, and extra virgin olive oil.")
                    .price(new BigDecimal("18.00"))
                    .isVeg(true)
                    .isAvailable(true)
                    .build();

            r1.getMenuItems().add(m1);
            r1.getMenuItems().add(m2);
            restaurantRepository.save(r1);

            Restaurant r2 = Restaurant.builder()
                    .ownerId("dev-owner-2")
                    .name("Tokyo Ramen Bar")
                    .cuisine("Japanese")
                    .address("88 E 10th St, New York, NY")
                    .phone("+1 (555) 789-1234")
                    .rating(4.9)
                    .isOpen(true)
                    .menuItems(new ArrayList<>())
                    .build();

            MenuItem m3 = MenuItem.builder()
                    .restaurant(r2)
                    .categoryName("Ramen")
                    .name("Tonkotsu Black Garlic Ramen")
                    .description("24-hour pork bone broth, charred garlic oil, chashu pork, nitamago egg, and wood ear mushrooms.")
                    .price(new BigDecimal("19.50"))
                    .isVeg(false)
                    .isAvailable(true)
                    .build();

            r2.getMenuItems().add(m3);
            restaurantRepository.save(r2);
            log.info("Successfully seeded restaurant catalog with 2 premier culinary establishments.");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<RestaurantDto> getAllOpenRestaurants() {
        return restaurantRepository.findByIsOpenTrue()
                .stream()
                .map(this::mapToRestaurantDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public RestaurantDto getRestaurantById(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found with id: " + id));
        return mapToRestaurantDto(restaurant);
    }

    @Override
    public RestaurantDto createRestaurant(String ownerId, RestaurantDto dto) {
        Restaurant restaurant = Restaurant.builder()
                .ownerId(ownerId)
                .name(dto.getName())
                .cuisine(dto.getCuisine())
                .address(dto.getAddress())
                .phone(dto.getPhone())
                .rating(4.5)
                .isOpen(true)
                .menuItems(new ArrayList<>())
                .build();

        Restaurant saved = restaurantRepository.save(restaurant);
        return mapToRestaurantDto(saved);
    }

    @Override
    public RestaurantDto updateRestaurant(String ownerId, Long id, RestaurantDto dto) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (!restaurant.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized: Only the restaurant owner can modify this restaurant");
        }

        restaurant.setName(dto.getName());
        restaurant.setCuisine(dto.getCuisine());
        restaurant.setAddress(dto.getAddress());
        restaurant.setPhone(dto.getPhone());
        if (dto.getIsOpen() != null) restaurant.setIsOpen(dto.getIsOpen());

        Restaurant saved = restaurantRepository.save(restaurant);
        return mapToRestaurantDto(saved);
    }

    @Override
    public void deleteRestaurant(String ownerId, Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (!restaurant.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized: Only the restaurant owner can delete this restaurant");
        }

        restaurantRepository.delete(restaurant);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MenuItemDto> getRestaurantMenu(Long restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId)
                .stream()
                .map(this::mapToMenuItemDto)
                .collect(Collectors.toList());
    }

    @Override
    public MenuItemDto addMenuItem(String ownerId, Long restaurantId, MenuItemDto dto) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        if (!restaurant.getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized: Only the restaurant owner can add menu items");
        }

        MenuItem menuItem = MenuItem.builder()
                .restaurant(restaurant)
                .categoryName(dto.getCategoryName())
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .isVeg(dto.getIsVeg())
                .isAvailable(true)
                .build();

        MenuItem saved = menuItemRepository.save(menuItem);
        return mapToMenuItemDto(saved);
    }

    @Override
    public MenuItemDto updateMenuItem(String ownerId, Long menuId, MenuItemDto dto) {
        MenuItem menuItem = menuItemRepository.findById(menuId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        if (!menuItem.getRestaurant().getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized: Only the restaurant owner can edit this menu item");
        }

        menuItem.setName(dto.getName());
        menuItem.setCategoryName(dto.getCategoryName());
        menuItem.setDescription(dto.getDescription());
        menuItem.setPrice(dto.getPrice());
        if (dto.getIsVeg() != null) menuItem.setIsVeg(dto.getIsVeg());
        if (dto.getIsAvailable() != null) menuItem.setIsAvailable(dto.getIsAvailable());

        MenuItem saved = menuItemRepository.save(menuItem);
        return mapToMenuItemDto(saved);
    }

    @Override
    public void deleteMenuItem(String ownerId, Long menuId) {
        MenuItem menuItem = menuItemRepository.findById(menuId)
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        if (!menuItem.getRestaurant().getOwnerId().equals(ownerId)) {
            throw new RuntimeException("Unauthorized: Only the restaurant owner can delete this menu item");
        }

        menuItemRepository.delete(menuItem);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WishlistDto> getUserWishlist(String userId) {
        return wishlistRepository.findByUserId(userId)
                .stream()
                .map(this::mapToWishlistDto)
                .collect(Collectors.toList());
    }

    @Override
    public WishlistDto addRestaurantToWishlist(String userId, Long restaurantId) {
        Wishlist wishlist = wishlistRepository.findByUserIdAndRestaurantId(userId, restaurantId)
                .orElseGet(() -> wishlistRepository.save(Wishlist.builder()
                        .userId(userId)
                        .restaurantId(restaurantId)
                        .build()));
        return mapToWishlistDto(wishlist);
    }

    @Override
    public WishlistDto addMenuItemToWishlist(String userId, Long menuItemId) {
        Wishlist wishlist = wishlistRepository.findByUserIdAndMenuItemId(userId, menuItemId)
                .orElseGet(() -> wishlistRepository.save(Wishlist.builder()
                        .userId(userId)
                        .menuItemId(menuItemId)
                        .build()));
        return mapToWishlistDto(wishlist);
    }

    @Override
    public void removeFromWishlist(String userId, Long wishlistId) {
        Wishlist wishlist = wishlistRepository.findById(wishlistId)
                .orElseThrow(() -> new RuntimeException("Wishlist item not found"));

        if (!wishlist.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to modify this wishlist");
        }

        wishlistRepository.delete(wishlist);
    }

    private RestaurantDto mapToRestaurantDto(Restaurant r) {
        List<MenuItemDto> items = r.getMenuItems() != null
                ? r.getMenuItems().stream().map(this::mapToMenuItemDto).collect(Collectors.toList())
                : List.of();

        return RestaurantDto.builder()
                .id(r.getId())
                .ownerId(r.getOwnerId())
                .name(r.getName())
                .cuisine(r.getCuisine())
                .address(r.getAddress())
                .phone(r.getPhone())
                .rating(r.getRating())
                .isOpen(r.getIsOpen())
                .menuItems(items)
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .build();
    }

    private MenuItemDto mapToMenuItemDto(MenuItem item) {
        return MenuItemDto.builder()
                .id(item.getId())
                .restaurantId(item.getRestaurant() != null ? item.getRestaurant().getId() : null)
                .categoryName(item.getCategoryName())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .isVeg(item.getIsVeg())
                .isAvailable(item.getIsAvailable())
                .build();
    }

    private WishlistDto mapToWishlistDto(Wishlist w) {
        RestaurantDto rDto = w.getRestaurantId() != null
                ? restaurantRepository.findById(w.getRestaurantId()).map(this::mapToRestaurantDto).orElse(null)
                : null;

        MenuItemDto mDto = w.getMenuItemId() != null
                ? menuItemRepository.findById(w.getMenuItemId()).map(this::mapToMenuItemDto).orElse(null)
                : null;

        return WishlistDto.builder()
                .id(w.getId())
                .userId(w.getUserId())
                .restaurantId(w.getRestaurantId())
                .menuItemId(w.getMenuItemId())
                .restaurant(rDto)
                .menuItem(mDto)
                .createdAt(w.getCreatedAt())
                .build();
    }
}
