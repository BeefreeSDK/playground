import axios from 'axios';
import { API_ENDPOINTS } from '../constants';

// API base configuration
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication
export const authAPI = {
  getToken: async (uid: string = 'demo-user') => {
    const response = await api.post(API_ENDPOINTS.AUTH, { uid });
    return response.data;
  },
};

export default api;
