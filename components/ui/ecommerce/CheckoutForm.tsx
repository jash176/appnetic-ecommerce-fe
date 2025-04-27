import React, { useCallback } from 'react';
import { View, StyleSheet, TextInput, Switch, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import FormField from '../FormField';
import AddressForm, { AddressFormData } from '../AddressForm';

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  shippingAddress: AddressFormData;
  billingAddressSameAsShipping: boolean;
  billingAddress: AddressFormData;
  paymentMethod: string;
}

interface CheckoutFormProps {
  formData: CheckoutFormData;
  onChange: (field: string, value: any) => void;
  onBillingToggle: (value: boolean) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  formData,
  onChange,
  onBillingToggle
}) => {

  const handleNameChange = useCallback((field: string, value: string) => {
    onChange(field, value);
  }, [onChange]);

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
        <ThemedText style={styles.sectionTitle}>Shipping Address</ThemedText>
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

        <View style={[styles.paymentOption, formData.paymentMethod === 'cod' && styles.selectedPayment]}>
          <ThemedText style={styles.paymentOptionText}>Cash on Delivery (COD)</ThemedText>
        </View>
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
    marginBottom: 8,
  },
  selectedPayment: {
    borderColor: '#000',
    backgroundColor: '#f9f9f9',
  },
  paymentOptionText: {
    fontSize: 16,
  },
});

export default CheckoutForm; 