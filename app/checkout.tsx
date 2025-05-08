import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Button from '@/components/ui/Button';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import payloadClient from '@/lib/api/payloadClient';
import CheckoutForm, { CheckoutFormData } from '@/components/ui/ecommerce/CheckoutForm';
import OrderSummary from '@/components/ui/ecommerce/OrderSummary';
import PasswordCreationModal from '@/components/ui/ecommerce/PasswordCreationModal';
import { formatCreatePayload, extractId } from '@/lib/api/utils';
import { set } from 'lodash';
import { getStoreId } from '@/service/storeService';
export default function CheckoutPage() {
  const { top } = useSafeAreaInsets();
  const { items, clearCart, getSubtotal } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [customerData, setCustomerData] = useState<any>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  
  // Form state for checkout
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || '',
    email: user?.email || '',
    phone: '',
    shippingAddress: {
      name: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      phone: ''
    },
    billingAddressSameAsShipping: true,
    billingAddress: {
      name: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      phone: ''
    },
    paymentMethod: 'cod'
  });

const handleChange = (field: string, value: any) => {
  setFormData(prev => {
    const updatedData = { ...prev };

    // Update the original field
    set(updatedData, field, value);

    // If billing is same as shipping and it's a shipping field, also update billing field
    // if (prev.billingAddressSameAsShipping && field.startsWith('shippingAddress.')) {
    //   const billingField = field.replace('shippingAddress.', 'billingAddress.');
    //   set(updatedData, billingField, value);
    // }

    return updatedData;
  });
};

  
  
  // Handle toggle for billing address same as shipping
  const handleBillingToggle = (value: boolean) => {
    setFormData(prev => ({
      ...prev,
      billingAddressSameAsShipping: value,
      billingAddress: value ? {...prev.shippingAddress} : prev.billingAddress
    }));
  };
  
  // Handle checkout submission
  const handleCheckout = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Step 1: Check if customer exists or create new customer
      let customerId: number;
      
      // Try to find existing customer by email
      const customersResponse = await payloadClient.collections.customers.find({
        where: {
          email: {
            equals: formData.email
          },
          store: {
            equals: 1
          }
        }
      });

      
      if (customersResponse.docs.length > 0) {
        // Use existing customer
        customerId = customersResponse.docs[0].id as number;
        setCustomerData(customersResponse.docs[0]);
      } else {
        // Create new customer
        const customerData = {
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          addresses: [
            {
              type: 'both' as const,
              isDefault: true,
              ...formData.shippingAddress
            }
          ],
          // Default store value required by schema
          store: getStoreId()
        };
        const customerResponse = await payloadClient.collections.customers.create(
          formatCreatePayload(customerData)
        );
        
        console.log("customerResponse : ", customerResponse);
        
        customerId = extractId(customerResponse.doc);
        setCustomerData(customerResponse.doc);
      }
      
      // Step 2: Create order with customer ID
      const orderItems = items.map(item => ({
        product: item.productId,
        variant: item.variant,
        quantity: item.quantity,
        price: item.price
      }));
      
      const subtotal = getSubtotal();
      
      const orderData = {
        orderNumber: `ORD-${Date.now()}`,
        store: getStoreId(),
        customer: customerId,
        items: orderItems,
        subtotal,
        tax: 0, // Calculate tax if needed
        shipping: 0, // Calculate shipping if needed
        discount: 0, // Apply discounts if needed
        total: subtotal,
        currency: 'INR',
        status: 'pending' as const,
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.billingAddressSameAsShipping 
          ? formData.shippingAddress 
          : formData.billingAddress,
        paymentInfo: {
          method: 'cod' as const,
          status: 'pending' as const
        },
      };
      
      const orderResponse = await payloadClient.collections.orders.create(
        formatCreatePayload(orderData)
      );
      
      const newOrderId = extractId(orderResponse.doc);
      setOrderId(newOrderId);
      console.log("newOrderId : ", orderResponse);
      // Clear cart after successful order
      clearCart();
      console.log("customerData : ", customerData?.user);
      // Show password creation modal if user is not authenticated
      if (!isAuthenticated && !customerData?.user) {
        setShowPasswordModal(true);
      } else {
        router.push({
          pathname: '/order-confirmation',
          params: { orderId: newOrderId.toString() }
        })
      }
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert('Checkout Failed', 'There was an error processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Validate form fields
  const validateForm = () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      Alert.alert('Missing Information', 'Please fill in all required personal information.');
      return false;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return false;
    }
    
    // Validate shipping address
    const { name, line1, city, state, postalCode, country } = formData.shippingAddress;
    if (!name || !line1 || !city || !state || !postalCode || !country) {
      Alert.alert('Missing Address Information', 'Please fill in all required shipping address fields.');
      return false;
    }
    
    // Validate billing address if different from shipping
    if (!formData.billingAddressSameAsShipping) {
      const { name, line1, city, state, postalCode, country } = formData.billingAddress;
      if (!name || !line1 || !city || !state || !postalCode || !country) {
        Alert.alert('Missing Address Information', 'Please fill in all required billing address fields.');
        return false;
      }
    }
    
    return true;
  };
  
  // Handle password creation completion
  const handlePasswordCreation = () => {
    setShowPasswordModal(false);
    
    setTimeout(() => {
      if (orderId) {
        router.push({
          pathname: '/order-confirmation',
          params: { orderId: orderId.toString() }
        });
      }
    }, 200)
  };
  
  // Skip password creation
  const handleSkipPasswordCreation = () => {
    setShowPasswordModal(false);
    
    if (orderId) {
      router.push({
        pathname: '/order-confirmation',
        params: { orderId: orderId.toString() }
      });
    }
  };
  
  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText type="heading">Checkout</ThemedText>
        </View>
        
        <CheckoutForm 
          formData={formData}
          onChange={handleChange}
          onBillingToggle={handleBillingToggle}
        />
        
        <OrderSummary items={items} />
        
        <View style={styles.checkoutButton}>
          <Button 
            title="PLACE ORDER" 
            onPress={handleCheckout}
            loading={isSubmitting}
            fullWidth
          />
        </View>
      </ScrollView>
      
      <PasswordCreationModal
        visible={showPasswordModal}
        email={formData.email}
        customerId={customerData?.id}
        onComplete={handlePasswordCreation}
        onSkip={handleSkipPasswordCreation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    marginTop: 12,
  },
  backButton: {
    marginBottom: 16,
  },
  checkoutButton: {
    marginTop: 24,
    marginBottom: 60,
  }
}); 