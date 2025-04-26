import { createClient } from 'payload-rest-client';
import Constants from 'expo-constants';
import { Config } from './services/types';

// Get API URL from environment variables
const apiUrl = Constants.expoConfig?.extra?.apiUrl || 'http://192.168.29.43:3000/api';

// Define locale types if needed (can be extended later)
type Locales = 'en' | 'es';

// Create a client instance with our PayloadConfig type
const payloadClient = createClient<Config, Locales>({
  apiUrl,
  cache: 'no-store',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to create an authenticated client with token
export const createAuthenticatedClient = (token: string) => {
  return createClient<Config, Locales>({
    apiUrl,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
};

export default payloadClient; 