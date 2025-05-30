import { create } from 'zustand';
import payloadClient, { createAuthenticatedClient } from '@/lib/api/payloadClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/lib/api/services/types';

// Storage keys
export const AUTH_TOKEN_KEY = 'auth_token';
export const USER_DATA_KEY = 'user_data';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  checkAuthState: () => Promise<void>;
  checkEmailExists: (email: string) => Promise<boolean>;
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
      
      // Persist auth data
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, response.token);
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user));
      
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
        await client.collections.users.logout();
      }
      
      // Clear auth state
      set({
        isAuthenticated: false,
        token: null,
        user: null,
        isLoading: false,
      });
      
      // Clear persisted auth data
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);
      
      return true;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Failed to logout',
      });
      return false;
    }
  },
  
  register: async (email: string, password: string, name: string, phone?: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // Call PayloadCMS register endpoint
      await payloadClient.collections.users.create({
        
        doc: {
          email,
          password,
          phone,
          name,
          role: 'customer',
        }
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
      
      // Try to get token from AsyncStorage first
      const storedToken = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      const storedUserData = await AsyncStorage.getItem(USER_DATA_KEY);
      
      // If no stored token, user is not authenticated
      if (!storedToken) {
        set({ 
          isLoading: false,
          isAuthenticated: false
        });
        return;
      }
      
      // Set the token and user from AsyncStorage
      const userData = storedUserData ? JSON.parse(storedUserData) : null;
      set({
        token: storedToken,
        user: userData,
        isAuthenticated: true,
      });
      
      // Verify token is still valid with the server
      try {
        const client = createAuthenticatedClient(storedToken);
        const response = await client.collections.users.me();
        
        // Update user data if it's changed
        set({
          user: response.user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        // Update stored user data if needed
        await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.user));
      } catch (serverError) {
        // Token is invalid/expired, clear auth state
        await get().logout();
      }
    } catch (error) {
      // Something went wrong, clear auth state
      await get().logout();
      set({ isLoading: false });
    }
  },

  checkEmailExists: async (email: string): Promise<boolean> => {
    const response = await payloadClient.collections.users.find({
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    });
    if (response.docs && response.docs.length > 0) {
      return true; // Email exists
    }
    return false;
  },
  
  clearError: () => {
    set({ error: null });
  },
})); 