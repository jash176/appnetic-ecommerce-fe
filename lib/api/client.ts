import axios from 'axios';

/**
 * Base API client for making requests to PayloadCMS
 */
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://10.2.2.0:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    // You can retrieve the token from a store or secure storage
    const token = ''; // Get from secure storage in a real app
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error codes or formats returned by PayloadCMS
    const errorResponse = error.response;
    
    if (errorResponse && errorResponse.status === 401) {
      // Handle unauthorized - maybe clear token or redirect to login
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 