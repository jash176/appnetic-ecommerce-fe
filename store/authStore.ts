import { create } from 'zustand';
import payloadClient, { createAuthenticatedClient } from '@/lib/api/payloadClient';

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
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  checkAuthState: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  
  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Use payload client for login
      const response = await payloadClient.collections.users.login({
        email,
        password,
      });
      
      // Store token and user data
      set({
        isAuthenticated: true,
        token: response.token,
        user: response.user,
        isLoading: false,
      });
      
      return true;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to login',
      });
      return false;
    }
  },
  
  logout: async () => {
    try {
      set({ isLoading: true });
      
      // Get the current token to create an authenticated client
      const token = get().token;
      if (token) {
        const client = createAuthenticatedClient(token);
        await client.collections.users.logout({});
      }
      
      // Clear auth state
      set({
        isAuthenticated: false,
        token: null,
        user: null,
        isLoading: false,
      });
      
      return true;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to logout',
      });
      return false;
    }
  },
  
  register: async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Call PayloadCMS register endpoint
      await payloadClient.collections.users.create({
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
        error: error.message || 'Registration failed',
      });
    }
  },
  
  checkAuthState: async () => {
    try {
      set({ isLoading: true });
      
      // Get token from store
      const token = get().token;
      
      if (!token) {
        set({ isLoading: false });
        return;
      }
      
      // Verify token and get user data
      const client = createAuthenticatedClient(token);
      const response = await client.collections.users.me({});
      
      set({
        user: response.user,
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