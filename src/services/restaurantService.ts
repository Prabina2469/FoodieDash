import { apiClient } from './apiClient';
import { Restaurant, MenuItem } from '../types';

export const restaurantService = {
  getAllRestaurants: async (): Promise<Restaurant[]> => {
    const response = await apiClient.get<Restaurant[]>('/restaurants');
    return response.data;
  },

  getRestaurantById: async (id: number): Promise<Restaurant> => {
    const response = await apiClient.get<Restaurant>(`/restaurants/${id}`);
    return response.data;
  },

  getRestaurantMenu: async (id: number): Promise<MenuItem[]> => {
    const response = await apiClient.get<MenuItem[]>(`/restaurants/${id}/menu`);
    return response.data;
  },

  getUserWishlist: async () => {
    const response = await apiClient.get('/wishlist');
    return response.data;
  },

  addRestaurantToWishlist: async (restaurantId: number) => {
    const response = await apiClient.post(`/wishlist/restaurants/${restaurantId}`);
    return response.data;
  },

  addMenuItemToWishlist: async (menuItemId: number) => {
    const response = await apiClient.post(`/wishlist/menu-items/${menuItemId}`);
    return response.data;
  },

  removeFromWishlist: async (wishlistId: number) => {
    const response = await apiClient.delete(`/wishlist/${wishlistId}`);
    return response.data;
  }
};
