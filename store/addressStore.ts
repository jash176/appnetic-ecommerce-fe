import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key
const ADDRESSES_STORAGE_KEY = 'user_addresses';

export interface Address {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface AddressState {
  addresses: Address[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadAddresses: () => Promise<void>;
  addAddress: (address: Omit<Address, 'id' | 'isDefault'> & { isDefault?: boolean }) => Promise<void>;
  updateAddress: (id: string, address: Partial<Omit<Address, 'id'>>) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
  clearAddresses: () => Promise<void>;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  isLoading: false,
  error: null,
  
  loadAddresses: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const storedAddresses = await AsyncStorage.getItem(ADDRESSES_STORAGE_KEY);
      
      if (storedAddresses) {
        set({ addresses: JSON.parse(storedAddresses), isLoading: false });
      } else {
        set({ addresses: [], isLoading: false });
      }
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to load addresses' 
      });
    }
  },
  
  addAddress: async (addressData) => {
    try {
      set({ isLoading: true, error: null });
      
      const { addresses } = get();
      
      // Check if we already have the maximum number of addresses (3)
      if (addresses.length >= 3) {
        throw new Error('Maximum of 3 addresses allowed');
      }
      
      // Generate a unique ID
      const id = Date.now().toString();
      
      // Determine if this should be the default address
      const isDefault = addressData.isDefault ?? addresses.length === 0;
      
      // If this is set as default, we need to update other addresses
      let updatedAddresses = [...addresses];
      
      if (isDefault) {
        updatedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          isDefault: false
        }));
      }
      
      // Create the new address with generated ID
      const newAddress: Address = {
        id,
        name: addressData.name,
        line1: addressData.line1,
        line2: addressData.line2,
        city: addressData.city,
        state: addressData.state,
        postalCode: addressData.postalCode,
        country: addressData.country,
        phone: addressData.phone,
        isDefault
      };
      
      // Add the new address to the list
      const newAddresses = [...updatedAddresses, newAddress];
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(newAddresses));
      
      // Update state
      set({ addresses: newAddresses, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to add address' 
      });
    }
  },
  
  updateAddress: async (id, addressData) => {
    try {
      set({ isLoading: true, error: null });
      
      const { addresses } = get();
      
      // Find the address to update
      const addressIndex = addresses.findIndex(addr => addr.id === id);
      
      if (addressIndex === -1) {
        throw new Error('Address not found');
      }
      
      // Update the address
      const updatedAddresses = [...addresses];
      updatedAddresses[addressIndex] = {
        ...updatedAddresses[addressIndex],
        ...addressData
      };
      
      // If setting this as default, update other addresses
      if (addressData.isDefault) {
        updatedAddresses.forEach((addr, idx) => {
          if (idx !== addressIndex) {
            addr.isDefault = false;
          }
        });
      }
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(updatedAddresses));
      
      // Update state
      set({ addresses: updatedAddresses, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to update address' 
      });
    }
  },
  
  removeAddress: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { addresses } = get();
      
      // Find the address to remove
      const addressToRemove = addresses.find(addr => addr.id === id);
      
      if (!addressToRemove) {
        throw new Error('Address not found');
      }
      
      // Filter out the address to remove
      let updatedAddresses = addresses.filter(addr => addr.id !== id);
      
      // If we removed the default address and there are other addresses,
      // set the first one as default
      if (addressToRemove.isDefault && updatedAddresses.length > 0) {
        updatedAddresses = [
          { ...updatedAddresses[0], isDefault: true },
          ...updatedAddresses.slice(1)
        ];
      }
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(updatedAddresses));
      
      // Update state
      set({ addresses: updatedAddresses, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to remove address' 
      });
    }
  },
  
  setDefaultAddress: async (id) => {
    try {
      set({ isLoading: true, error: null });
      
      const { addresses } = get();
      
      // Update all addresses - set the selected one as default, all others as not default
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }));
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(updatedAddresses));
      
      // Update state
      set({ addresses: updatedAddresses, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to set default address' 
      });
    }
  },
  
  clearAddresses: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Remove from AsyncStorage
      await AsyncStorage.removeItem(ADDRESSES_STORAGE_KEY);
      
      // Update state
      set({ addresses: [], isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to clear addresses' 
      });
    }
  },
})); 