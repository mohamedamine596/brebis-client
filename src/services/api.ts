import axios from 'axios';

// Configure axios defaults
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS with credentials
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || localStorage.getItem('brebis_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear local storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('brebis_token');
      localStorage.removeItem('user');
      localStorage.removeItem('brebis_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const apiService = {
  get: async (url: string) => {
    const response = await apiClient.get(url);
    return response;
  },

  post: async (url: string, data?: any) => {
    const response = await apiClient.post(url, data);
    return response;
  },

  put: async (url: string, data?: any) => {
    const response = await apiClient.put(url, data);
    return response;
  },

  delete: async (url: string) => {
    const response = await apiClient.delete(url);
    return response;
  }
};

export default apiService;
