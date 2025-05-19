import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Switch, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import FormField from '../FormField';
import AddressForm, { AddressFormData } from '../AddressForm';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import payloadClient from '@/lib/api/payloadClient';
import { getStoreId } from '@/service/storeService';
import { useAuthStore } from '@/store/authStore';

interface SavedAddress extends AddressFormData {
  id?: string;
  type: 'shipping' | 'billing' | 'both';
  isDefault?: boolean;
}

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  shippingAddress: AddressFormData;
  billingAddressSameAsShipping: boolean;
  billingAddress: AddressFormData;
  paymentMethod: 'cod' | 'razorpay';
}

interface CheckoutFormProps {
  formData: CheckoutFormData;
  onChange: (field: string, value: any) => void;
  onBillingToggle: (value: boolean) => void;
  onPaymentMethodChange?: (method: 'cod' | 'razorpay') => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  formData,
  onChange,
  onBillingToggle,
  onPaymentMethodChange
}) => {
  const { user, isAuthenticated } = useAuthStore();
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      fetchSavedAddresses();
    }
  }, [isAuthenticated, user]);

  const fetchSavedAddresses = async () => {
    try {
      // Find customer by email
      const response = await payloadClient.collections.customers.find({
        where: {
          email: {
            equals: user?.email || ''
          },
          store: {
            equals: getStoreId()
          }
        }
      });
      
      if (response.docs.length > 0) {
        const customerData = response.docs[0];
        if (customerData.addresses && Array.isArray(customerData.addresses)) {
          // Convert the addresses to the correct type
          const typedAddresses: SavedAddress[] = customerData.addresses.map(addr => ({
            id: addr.id || undefined,
            type: addr.type,
            isDefault: addr.isDefault || false,
            name: addr.name,
            line1: addr.line1,
            line2: addr.line2 || undefined,
            city: addr.city,
            state: addr.state,
            postalCode: addr.postalCode,
            country: addr.country,
            phone: addr.phone || undefined
          }));
          
          setSavedAddresses(typedAddresses);
          
          // If we have addresses and default address exists, pre-select it
          const defaultAddress = typedAddresses.find(addr => addr.isDefault);
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id || null);
            // Apply the default address to shipping
            onChange('shippingAddress', { ...defaultAddress });
          }
        }
      }
    } catch (error) {
      console.error('Error fetching saved addresses:', error);
    }
  };

  const handleNameChange = useCallback((field: string, value: string) => {
    onChange(field, value);
  }, [onChange]);

  const handlePaymentMethodChange = useCallback((method: 'cod' | 'razorpay') => {
    onChange('paymentMethod', method);
    if (onPaymentMethodChange) {
      onPaymentMethodChange(method);
    }
  }, [onChange, onPaymentMethodChange]);

  const handleSelectAddress = (address: SavedAddress) => {
    setSelectedAddressId(address.id || null);
    onChange('shippingAddress', { ...address });
    setShowSavedAddresses(false);
  };

  const navigateToAddresses = () => {
    router.push('/shipping-addresses');
  };

  return (
    <View>
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Your Information</ThemedText>

        <FormField
          label="Full Name"
          value={formData.name}
          onChange={(value) => handleNameChange('name', value)}
          placeholder="Full Name"
          autoCapitalize="words"
        />

        <FormField
          label="Email"
          value={formData.email}
          onChange={(value) => handleNameChange('email', value)}
          placeholder="Email Address"
          keyboardType="email-address"
        />

        <FormField
          label="Phone Number"
          value={formData.phone}
          onChange={(value) => handleNameChange('phone', value)}
          placeholder="Phone Number"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Shipping Address</ThemedText>
          {isAuthenticated && (
            <TouchableOpacity 
              style={styles.manageAddressButton} 
              onPress={navigateToAddresses}
            >
              <ThemedText style={styles.manageAddressText}>Manage</ThemedText>
            </TouchableOpacity>
          )}
        </View>

        {isAuthenticated && savedAddresses.length > 0 && (
          <View style={styles.savedAddressesContainer}>
            <TouchableOpacity 
              style={styles.savedAddressToggle}
              onPress={() => setShowSavedAddresses(!showSavedAddresses)}
            >
              <ThemedText>
                {selectedAddressId 
                  ? `Using saved address${showSavedAddresses ? '' : ' (tap to change)'}` 
                  : 'Select from saved addresses'}
              </ThemedText>
              <Ionicons 
                name={showSavedAddresses ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#000" 
              />
            </TouchableOpacity>

            {showSavedAddresses && (
              <View style={styles.savedAddressList}>
                {savedAddresses.map((address) => (
                  <TouchableOpacity
                    key={address.id}
                    style={[
                      styles.savedAddressItem,
                      selectedAddressId === address.id && styles.selectedAddressItem
                    ]}
                    onPress={() => handleSelectAddress(address)}
                  >
                    <View>
                      <ThemedText style={styles.savedAddressName}>
                        {address.name} 
                        {address.isDefault && <ThemedText style={styles.defaultTag}> (Default)</ThemedText>}
                      </ThemedText>
                      <ThemedText style={styles.savedAddressDetails}>
                        {address.line1}, {address.city}, {address.state} {address.postalCode}
                      </ThemedText>
                    </View>
                    {selectedAddressId === address.id && (
                      <Ionicons name="checkmark-circle" size={20} color="#000" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        <AddressForm prefix="shippingAddress" address={formData.shippingAddress} onChange={onChange} />
      </View>

      <View style={styles.section}>
        <View style={styles.billingToggle}>
          <ThemedText>Billing address same as shipping</ThemedText>
          <Switch
            value={formData.billingAddressSameAsShipping}
            onValueChange={onBillingToggle}
          />
        </View>

        {!formData.billingAddressSameAsShipping && (
          <>
            <ThemedText style={styles.sectionTitle}>Billing Address</ThemedText>
            <AddressForm prefix="billingAddress" address={formData.billingAddress} onChange={onChange} />
          </>
        )}
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Payment Method</ThemedText>

        <TouchableOpacity 
          style={[styles.paymentOption, formData.paymentMethod === 'cod' && styles.selectedPayment]}
          onPress={() => handlePaymentMethodChange('cod')}
        >
          <View style={styles.paymentOptionContent}>
            <Ionicons name="cash-outline" size={24} color="#333" />
            <ThemedText style={styles.paymentOptionText}>Cash on Delivery (COD)</ThemedText>
          </View>
          {formData.paymentMethod === 'cod' && (
            <Ionicons name="checkmark-circle" size={24} color="#000" />
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.paymentOption, formData.paymentMethod === 'razorpay' && styles.selectedPayment]}
          onPress={() => handlePaymentMethodChange('razorpay')}
        >
          <View style={styles.paymentOptionContent}>
            <Ionicons name="card-outline" size={24} color="#333" />
            <ThemedText style={styles.paymentOptionText}>Pay Online (Razorpay)</ThemedText>
          </View>
          {formData.paymentMethod === 'razorpay' && (
            <Ionicons name="checkmark-circle" size={24} color="#000" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  billingToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  paymentOption: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedPayment: {
    borderColor: '#000',
    backgroundColor: '#f9f9f9',
  },
  paymentOptionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  manageAddressButton: {
    padding: 8,
  },
  manageAddressText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  savedAddressesContainer: {
    marginBottom: 16,
  },
  savedAddressToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 8,
  },
  savedAddressList: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 16,
  },
  savedAddressItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedAddressItem: {
    backgroundColor: '#f9f9f9',
  },
  savedAddressName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  savedAddressDetails: {
    fontSize: 13,
    color: '#666',
  },
  defaultTag: {
    fontWeight: 'normal',
    color: '#007AFF',
  },
});

export default CheckoutForm;