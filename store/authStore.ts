import { create } from 'zustand';
import apiClient from '@/lib/api/client';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  checkAuthState: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Call PayloadCMS login endpoint
      const response = await apiClient.post('/users/login', {
        email,
        password,
      });
      
      const { user, token } = response.data;
      
      // Store token securely in a real app
      // await SecureStore.setItemAsync('auth_token', token);
      
      set({
        user,
        token,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Login failed',
      });
    }
  },
  
  logout: () => {
    // Clear token from secure storage in a real app
    // await SecureStore.deleteItemAsync('auth_token');
    
    // Call PayloadCMS logout endpoint
    apiClient.post('/users/logout').catch(() => {
      // Silently fail on logout errors
    });
    
    set({
      user: null,
      token: null,
    });
  },
  
  register: async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Call PayloadCMS register endpoint
      await apiClient.post('/users', {
        email,
        password,
        firstName,
        lastName,
      });
      
      // Login after successful registration
      await get().login(email, password);
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Registration failed',
      });
    }
  },
  
  checkAuthState: async () => {
    try {
      set({ isLoading: true });
      
      // Get token from secure storage in a real app
      // const token = await SecureStore.getItemAsync('auth_token');
      
      if (!get().token) {
        set({ isLoading: false });
        return;
      }
      
      // Verify token and get user data
      const response = await apiClient.get('/users/me');
      
      set({
        user: response.data.user,
        isLoading: false,
      });
    } catch (error) {
      // Token is invalid, clear auth state
      get().logout();
      set({ isLoading: false });
    }
  },
  
  clearError: () => {
    set({ error: null });
  },
})); 