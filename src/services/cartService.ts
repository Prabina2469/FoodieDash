import { apiClient } from './apiClient';
import { Cart } from '../types';

export interface AddToCartPayload {
  menuItemId: number;
  restaurantId: number;
  quantity: number;
  itemName?: string;
  price?: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<Cart>('/cart');
    return response.data;
  },

  addItem: async (payload: AddToCartPayload): Promise<Cart> => {
    const response = await apiClient.post<Cart>('/cart/items', payload);
    return response.data;
  },

  updateItemQuantity: async (itemId: number, payload: UpdateCartItemPayload): Promise<Cart> => {
    const response = await apiClient.put<Cart>(`/cart/items/${itemId}`, payload);
    return response.data;
  },

  removeItem: async (itemId: number): Promise<Cart> => {
    const response = await apiClient.delete<Cart>(`/cart/items/${itemId}`);
    return response.data;
  },

  clearCart: async (): Promise<void> => {
    await apiClient.delete('/cart');
  }
};
