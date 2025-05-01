import React, { useCallback } from 'react';
import { View, StyleSheet, TextInput, Switch, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import FormField from '../FormField';
import AddressForm, { AddressFormData } from '../AddressForm';
import { Ionicons } from '@expo/vector-icons';

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

  const handleNameChange = useCallback((field: string, value: string) => {
    onChange(field, value);
  }, [onChange]);

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
});

export default CheckoutForm;