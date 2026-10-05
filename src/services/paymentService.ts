import { apiClient } from './apiClient';
import { PaymentTransaction } from '../types';

export interface ProcessPaymentPayload {
  orderId: number;
  amount: number;
  paymentMethod: string;
  currency?: string;
}

export const paymentService = {
  processPayment: async (payload: ProcessPaymentPayload): Promise<PaymentTransaction> => {
    const response = await apiClient.post<PaymentTransaction>('/payments/process', payload);
    return response.data;
  },

  getMyPayments: async (): Promise<PaymentTransaction[]> => {
    const response = await apiClient.get<PaymentTransaction[]>('/payments');
    return response.data;
  }
};
