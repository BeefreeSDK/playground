import axios from 'axios';

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

export default api;
