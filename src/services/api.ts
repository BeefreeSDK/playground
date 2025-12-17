import axios from 'axios';
import type { AxiosError } from 'axios';

// API base configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication
export const authAPI = {
  getToken: async (uid: string = 'demo-user') => {
    const response = await api.post('/proxy/bee-auth', { uid });
    return response.data;
  },
};

// Error handling utility
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string }>;
    if (axiosError.response) {
      // Server responded with error status
      return axiosError.response.data?.error || 
             `HTTP ${axiosError.response.status}: ${axiosError.response.statusText}`;
    } else if (axiosError.request) {
      // Request was made but no response received
      return 'No response from server. Please check your connection.';
    }
  }
  
  // Something else happened
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred.';
};

export default api;
