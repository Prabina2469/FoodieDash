import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:8080/api/v1';

let currentAuthToken: string | null = localStorage.getItem('foodiedash_auth_token');

export const setApiAuthToken = (token: string | null) => {
  currentAuthToken = token;
  if (token) {
    localStorage.setItem('foodiedash_auth_token', token);
  } else {
    localStorage.removeItem('foodiedash_auth_token');
  }
};

export const getApiAuthToken = (): string | null => {
  return currentAuthToken || localStorage.getItem('foodiedash_auth_token');
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: inject Firebase ID Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getApiAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor: handle unauthorized / network errors gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn('API returned 401 Unauthorized. Token may be expired or invalid.');
    }
    return Promise.reject(error);
  }
);
