import { apiClient } from './apiClient';
import { UserProfile, Address } from '../types';

export interface UpdateProfilePayload {
  name: string;
  phoneNumber?: string;
}

export interface AddressPayload {
  label: string;
  streetAddress: string;
  aptSuite?: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

export const userService = {
  getMyProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>('/users/me');
    return response.data;
  },

  updateMyProfile: async (payload: UpdateProfilePayload): Promise<UserProfile> => {
    const response = await apiClient.put<UserProfile>('/users/me', payload);
    return response.data;
  },

  getMyAddresses: async (): Promise<Address[]> => {
    const response = await apiClient.get<Address[]>('/users/me/addresses');
    return response.data;
  },

  addAddress: async (payload: AddressPayload): Promise<Address> => {
    const response = await apiClient.post<Address>('/users/me/addresses', payload);
    return response.data;
  },

  updateAddress: async (addressId: number, payload: AddressPayload): Promise<Address> => {
    const response = await apiClient.put<Address>(`/users/me/addresses/${addressId}`, payload);
    return response.data;
  },

  deleteAddress: async (addressId: number): Promise<void> => {
    await apiClient.delete(`/users/me/addresses/${addressId}`);
  }
};
