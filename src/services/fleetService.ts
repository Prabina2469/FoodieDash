import { apiClient } from './apiClient';
import { DeliveryPartner, LiveDelivery } from '../types';

export const fleetService = {
  getAllDrivers: async (): Promise<DeliveryPartner[]> => {
    const response = await apiClient.get<DeliveryPartner[]>('/fleet');
    return response.data;
  },

  getDriverById: async (id: number): Promise<DeliveryPartner> => {
    const response = await apiClient.get<DeliveryPartner>(`/fleet/${id}`);
    return response.data;
  },

  getLiveDeliveries: async (): Promise<LiveDelivery[]> => {
    const response = await apiClient.get<LiveDelivery[]>('/deliveries/live');
    return response.data;
  },

  getDeliveryByOrderId: async (orderId: number): Promise<LiveDelivery> => {
    const response = await apiClient.get<LiveDelivery>(`/deliveries/order/${orderId}`);
    return response.data;
  }
};
