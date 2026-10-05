import { apiClient } from './apiClient';
import { Order } from '../types';

export interface CreateOrderItemPayload {
  menuItemId: number;
  itemName?: string;
  quantity: number;
  price: number;
}

export interface CreateOrderPayload {
  restaurantId: number;
  deliveryAddressId: number;
  items: CreateOrderItemPayload[];
}

export const orderService = {
  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', payload);
    return response.data;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<Order[]>('/orders/my-orders');
    return response.data;
  },

  getOrderById: async (orderId: number): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${orderId}`);
    return response.data;
  },

  cancelOrder: async (orderId: number): Promise<Order> => {
    const response = await apiClient.put<Order>(`/orders/${orderId}/cancel`);
    return response.data;
  },

  reorder: async (orderId: number): Promise<{ message: string; restaurantId: number; items: any[]; autoPlaced: boolean }> => {
    const response = await apiClient.post(`/orders/${orderId}/reorder`);
    return response.data;
  }
};
