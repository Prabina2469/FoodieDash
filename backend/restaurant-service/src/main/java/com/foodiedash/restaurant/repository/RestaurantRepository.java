package com.foodiedash.restaurant.repository;

import com.foodiedash.restaurant.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByOwnerId(String ownerId);
    List<Restaurant> findByIsOpenTrue();
}
