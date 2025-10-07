// src/utils/axiosConfig.js
import axios from 'axios';

// Create public axios instance (no auth required)
const publicClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
});

// Create admin axios instance (auth required)
const adminClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds default timeout
});

// Request interceptor for admin client to add auth token
adminClient.interceptors.request.use(
  (config) => {
    // Always get the latest token from localStorage
    const token = localStorage.getItem('adminToken');
    console.log('Making admin request to:', config.url);
    console.log('Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'No token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set');
    } else {
      console.log('No token available - request will be unauthorized');
    }

    return config;
  },
  (error) => {
    console.error('Admin request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for admin client to handle auth errors
adminClient.interceptors.response.use(
  (response) => {
    console.log('Admin response received:', response.status, 'Data length:', response.data?.length || 'N/A');
    return response;
  },
  (error) => {
    console.error('Admin response error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url
    });

    if (error.response?.status === 401) {
      // Token expired or invalid
      console.log('Unauthorized - removing token and redirecting');
      localStorage.removeItem('adminToken');
      // Only redirect if we're not already on the login page
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Response interceptor for public client (just for logging)
publicClient.interceptors.response.use(
  (response) => {
    console.log('Public response received:', response.status, 'Data length:', response.data?.length || 'N/A');
    return response;
  },
  (error) => {
    console.error('Public response error:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

// Export both clients
export { publicClient, adminClient };

// Default export for backward compatibility (admin client)
export default adminClient;