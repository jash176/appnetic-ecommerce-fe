/**
 * OBSOLETE: This file is no longer needed as we've moved to using the Payload REST client directly.
 * See lib/api/payloadClient.ts for the new implementation.
 */

import axios from 'axios';

/**
 * Base API client for making requests to PayloadCMS
 */
const apiClient = axios.create({
  baseURL:'http://192.168.29.51:3000/api',
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
    console.error('API Error:', error.message, error.response);
    return Promise.reject(error);
  }
);

export default apiClient;