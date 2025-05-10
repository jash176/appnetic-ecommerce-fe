import React, { useCallback, useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, Switch, TouchableOpacity, Animated, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import FormField from '../FormField';
import AddressForm, { AddressFormData } from '../AddressForm';
import { useAddressStore, Address } from '@/store/addressStore';
import { useAuthStore } from '@/store/authStore';
import { LinearGradient } from 'expo-linear-gradient';

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
  const { isAuthenticated } = useAuthStore();
  const { addresses, loadAddresses } = useAddressStore();
  const [showSavedAddresses, setShowSavedAddresses] = useState(false);
  
  // Animation refs for the dropdown
  const dropdownHeight = useRef(new Animated.Value(0)).current;
  const dropdownOpacity = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // Calculate the maximum height for the dropdown based on number of addresses
  const getMaxDropdownHeight = () => {
    return Math.min(addresses.length * 100, 300); // Limit to 300px maximum
  };
  
  // Handle dropdown animation
  useEffect(() => {
    if (showSavedAddresses) {
      Animated.parallel([
        Animated.timing(dropdownHeight, {
          toValue: getMaxDropdownHeight(),
          duration: 300,
          useNativeDriver: false, // height can't use native driver
        }),
        Animated.timing(dropdownOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(dropdownHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(dropdownOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [showSavedAddresses]);
  
  // Load saved addresses if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAddresses();
    }
  }, [isAuthenticated]);

  const handleNameChange = useCallback((field: string, value: string) => {
    onChange(field, value);
  }, [onChange]);
  
  // Apply a saved address to the shipping address
  const handleSelectAddress = (address: Address) => {
    // Update shipping address with saved address
    onChange('shippingAddress.name', address.name);
    onChange('shippingAddress.line1', address.line1);
    onChange('shippingAddress.line2', address.line2 || '');
    onChange('shippingAddress.city', address.city);
    onChange('shippingAddress.state', address.state);
    onChange('shippingAddress.postalCode', address.postalCode);
    onChange('shippingAddress.country', address.country);
    onChange('shippingAddress.phone', address.phone);
    
    // Hide saved addresses dropdown
    setShowSavedAddresses(false);
  };
  
  // Rotation interpolation for the dropdown icon
  const rotateInterpolation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const handlePaymentMethodChange = useCallback((method: 'cod' | 'razorpay') => {
    onChange('paymentMethod', method);
    if (onPaymentMethodChange) {
      onPaymentMethodChange(method);
    }
  }, [onChange, onPaymentMethodChange]);

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
          
          {/* Show saved addresses button - only if authenticated and has addresses */}
          {isAuthenticated && addresses.length > 0 && (
            <TouchableOpacity 
              style={styles.savedAddressButton}
              onPress={() => setShowSavedAddresses(!showSavedAddresses)}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.savedAddressText}>
                {showSavedAddresses ? 'Hide saved' : 'Use saved'}
              </ThemedText>
              <Animated.View
                style={{
                  transform: [{ rotate: rotateInterpolation }]
                }}
              >
                <Ionicons 
                  name="chevron-down" 
                  size={16} 
                  color="#4a6eb5" 
                />
              </Animated.View>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Saved addresses dropdown with animation */}
        <Animated.View 
          style={[
            styles.savedAddressesContainer,
            {
              maxHeight: dropdownHeight,
              opacity: dropdownOpacity,
              overflow: 'hidden'
            }
          ]}
        >
          {addresses.map((address, index) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.savedAddress,
                address.isDefault && styles.defaultAddress,
                index === addresses.length - 1 && styles.lastAddress
              ]}
              onPress={() => handleSelectAddress(address)}
              activeOpacity={0.7}
            >
              <View style={styles.addressInfo}>
                <ThemedText style={styles.addressName}>
                  {address.isDefault && (
                    <Ionicons name="star" size={14} color="#4a6eb5" />
                  )} {address.name}
                </ThemedText>
                <ThemedText numberOfLines={1} style={styles.addressLine}>{address.line1}</ThemedText>
                <ThemedText numberOfLines={1} style={styles.addressLine}>
                  {address.city}, {address.state} {address.postalCode}
                </ThemedText>
              </View>
              <View style={styles.selectButton}>
                <Ionicons name="checkmark-circle-outline" size={22} color="#4a6eb5" />
              </View>
            </TouchableOpacity>
          ))}
          <LinearGradient 
            colors={['rgba(248,249,250,0)', 'rgba(248,249,250,1)']}
            style={styles.dropdownFade}
          />
        </Animated.View>
        
        <AddressForm prefix="shippingAddress" address={formData.shippingAddress} onChange={onChange} />
      </View>

      <View style={styles.section}>
        <View style={styles.billingToggle}>
          <ThemedText>Billing address same as shipping</ThemedText>
          <Switch
            value={formData.billingAddressSameAsShipping}
            onValueChange={onBillingToggle}
            trackColor={{ false: '#d9d9d9', true: '#95acd1' }}
            thumbColor={formData.billingAddressSameAsShipping ? '#4a6eb5' : '#f4f3f4'}
            ios_backgroundColor="#d9d9d9"
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
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  savedAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4f9',
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dce4f0',
  },
  savedAddressText: {
    fontSize: 14,
    marginRight: 6,
    color: '#4a6eb5',
    fontWeight: '500',
  },
  savedAddressesContainer: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dce4f0',
    position: 'relative',
  },
  savedAddress: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeef4',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastAddress: {
    borderBottomWidth: 0,
  },
  defaultAddress: {
    backgroundColor: '#f0f4f9',
  },
  addressInfo: {
    flex: 1,
    paddingRight: 8,
  },
  addressName: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
    fontSize: 15,
  },
  addressLine: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  selectButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f4f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    zIndex: 1,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  billingToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
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
    borderColor: '#4a6eb5',
    backgroundColor: '#f0f4f9',
  },
  paymentOptionText: {
    fontSize: 16,
    color: '#333',
  },
  paymentIcon: {
    marginRight: 12,
  },
});

export default CheckoutForm;