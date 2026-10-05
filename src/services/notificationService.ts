import { apiClient } from './apiClient';
import { NotificationItem } from '../types';

export const notificationService = {
  getMyNotifications: async (): Promise<NotificationItem[]> => {
    const response = await apiClient.get<NotificationItem[]>('/notifications');
    return response.data;
  },

  markAsRead: async (id: number): Promise<NotificationItem> => {
    const response = await apiClient.put<NotificationItem>(`/notifications/${id}/read`);
    return response.data;
  }
};
