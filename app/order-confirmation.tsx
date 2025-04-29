import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, router } from 'expo-router';
import payloadClient from '@/lib/api/payloadClient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/ui/Button';

export default function OrderConfirmationPage() {
  const { orderId } = useLocalSearchParams();
  const { top } = useSafeAreaInsets();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!orderId) {
      router.replace('/');
      return;
    }
    
    async function fetchOrder() {
      try {
        const response = await payloadClient.collections.orders.find({
          where: {
            id: {
              equals: Number(orderId as string)
            }
          },
          depth: 1, // Include references
        });
        
        if (response.docs.length > 0) {
          setOrder(response.docs[0]);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. Please contact customer support.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchOrder();
  }, [orderId]);
  
  const handleContinueShopping = () => {
    router.replace('/');
  };
  
  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <ThemedText style={{ marginTop: 20 }}>Loading your order details...</ThemedText>
      </View>
    );
  }
  
  if (error || !order) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Ionicons name="alert-circle-outline" size={60} color="#ff0000" />
        <ThemedText style={styles.errorText}>{error || 'Order not found'}</ThemedText>
        <Button title="RETURN HOME" onPress={handleContinueShopping} />
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.successContainer}>
        <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
        <ThemedText style={styles.successTitle}>Order Confirmed!</ThemedText>
        <ThemedText style={styles.orderNumber}>Order #{order.orderNumber}</ThemedText>
        <ThemedText style={styles.successMessage}>
          Thank you for your purchase. We've received your order and will begin processing it soon.
        </ThemedText>
      </View>
      
      <View style={styles.orderDetails}>
        <ThemedText style={styles.sectionTitle}>Order Details</ThemedText>
        
        <View style={styles.detailRow}>
          <ThemedText>Order Date:</ThemedText>
          <ThemedText>{new Date(order.createdAt).toLocaleDateString()}</ThemedText>
        </View>
        
        <View style={styles.detailRow}>
          <ThemedText>Payment Method:</ThemedText>
          <ThemedText>{order.paymentInfo.method === 'cod' ? 'Cash on Delivery' : order.paymentInfo.method}</ThemedText>
        </View>
        
        <View style={styles.detailRow}>
          <ThemedText>Total Amount:</ThemedText>
          <ThemedText>Rs. {order.total.toFixed(2)}</ThemedText>
        </View>
      </View>
      
      <View style={styles.deliveryInfo}>
        <ThemedText style={styles.sectionTitle}>Delivery Information</ThemedText>
        
        <View style={styles.addressBox}>
          <ThemedText style={styles.addressName}>{order.shippingAddress.name}</ThemedText>
          <ThemedText>{order.shippingAddress.line1}</ThemedText>
          {order.shippingAddress.line2 && <ThemedText>{order.shippingAddress.line2}</ThemedText>}
          <ThemedText>
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </ThemedText>
          <ThemedText>{order.shippingAddress.country}</ThemedText>
          {order.shippingAddress.phone && <ThemedText>Phone: {order.shippingAddress.phone}</ThemedText>}
        </View>
      </View>
      
      <View style={styles.actionButtons}>
        <Button
          title="CONTINUE SHOPPING"
          onPress={handleContinueShopping}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
  },
  orderNumber: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  successMessage: {
    textAlign: 'center',
    marginTop: 16,
    color: '#666',
    lineHeight: 22,
  },
  orderDetails: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  deliveryInfo: {
    marginBottom: 24,
  },
  addressBox: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  addressName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionButtons: {
    marginTop: 'auto',
    marginBottom: 24,
  },
  errorText: {
    color: '#ff0000',
    textAlign: 'center',
    marginVertical: 20,
  },
}); 