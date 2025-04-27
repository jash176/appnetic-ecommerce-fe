import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import Button from '@/components/ui/Button';
import { createAuthenticatedClient } from '@/lib/api/payloadClient';
import { Media, Order, Product } from '@/lib/api/services/types';
import { getFullImageUrl } from '@/utils/functions';

// Format date to a readable format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Map order status to colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return '#FFA000';
    case 'processing':
      return '#2196F3';
    case 'completed':
      return '#4CAF50';
    case 'cancelled':
      return '#F44336';
    case 'refunded':
      return '#9C27B0';
    default:
      return '#757575';
  }
};

export default function OrderDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated, token } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderDetails = async () => {
    if (!isAuthenticated || !token || !id) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const client = createAuthenticatedClient(token);

      // Fetch specific order with detailed information
      const response = await client.collections.orders.findById({
        id: Number(id),
        depth: 2 // Include deeper relations like product details
      });

      setOrder(response);
    } catch (err: any) {
      console.error('Failed to fetch order details:', err);
      setError('Failed to load order details. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [isAuthenticated, token, id]);

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    router.replace('/login');
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={80} color="#F44336" />
          <ThemedText style={styles.errorTitle}>Something went wrong</ThemedText>
          <ThemedText style={styles.errorSubtitle}>{error}</ThemedText>
          <Button
            title="Try Again"
            onPress={fetchOrderDetails}
            style={styles.actionButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // No order found
  if (!order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="document-outline" size={80} color="#ccc" />
          <ThemedText style={styles.errorTitle}>Order Not Found</ThemedText>
          <ThemedText style={styles.errorSubtitle}>We couldn't find the order you're looking for</ThemedText>
          <Button
            title="Back to Orders"
            onPress={() => router.push('/orders')}
            style={styles.actionButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // At this point order is guaranteed to be non-null
  // Check if payment info exists
  const paymentMethod = order.paymentInfo?.method || 'N/A';
  const paymentStatus = order.paymentInfo?.status || 'N/A';

  // Default shipping address values as fallback
  const shippingName = order.shippingAddress?.name || 'Not available';
  const shippingLine1 = order.shippingAddress?.line1 || 'Not available';
  const shippingLine2 = order.shippingAddress?.line2;
  const shippingCity = order.shippingAddress?.city || 'Not available';
  const shippingState = order.shippingAddress?.state || '';
  const shippingPostal = order.shippingAddress?.postalCode || '';
  const shippingCountry = order.shippingAddress?.country || 'Not available';
  const shippingPhone = order.shippingAddress?.phone;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View>
              <ThemedText style={styles.orderNumber}>{order.orderNumber}</ThemedText>
              <ThemedText style={styles.date}>{formatDate(order.createdAt)}</ThemedText>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <ThemedText style={styles.statusText}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Order items */}
        <View style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Items</ThemedText>
          {order.items.map((item, index) => {
            // Get the product data if available
            const product = typeof item.product === 'object' ? item.product : null;
            const images = product?.images?.[0].image as Media;
            const productImage = images?.filename;
            return (
              <View key={index} style={styles.orderItem}>
                <View style={styles.productImageContainer}>
                  {productImage ? (
                    <Image
                      source={{
                        uri: getFullImageUrl(productImage)
                      }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Ionicons name="image-outline" size={24} color="#ccc" />
                    </View>
                  )}
                </View>
                <View style={styles.productDetails}>
                  <ThemedText style={styles.productTitle}>
                    {product ? (product as Product).title : 'Product'}
                  </ThemedText>
                  {item.variant && (
                    <ThemedText style={styles.variant}>Variant: {item.variant}</ThemedText>
                  )}
                  <ThemedText style={styles.quantity}>Qty: {item.quantity}</ThemedText>
                </View>
                <ThemedText style={styles.price}>Rs. {(item.price * item.quantity).toFixed(2)}</ThemedText>
              </View>
            );
          })}
        </View>

        {/* Payment summary */}
        <View style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Payment Summary</ThemedText>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Subtotal</ThemedText>
            <ThemedText style={styles.summaryValue}>Rs. {order.subtotal.toFixed(2)}</ThemedText>
          </View>

          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Shipping</ThemedText>
            <ThemedText style={styles.summaryValue}>Rs. {order.shipping.toFixed(2)}</ThemedText>
          </View>

          {order.tax > 0 && (
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Tax</ThemedText>
              <ThemedText style={styles.summaryValue}>Rs. {order.tax.toFixed(2)}</ThemedText>
            </View>
          )}

          {order.discount > 0 && (
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryLabel}>Discount</ThemedText>
              <ThemedText style={styles.summaryValue}>-Rs. {order.discount.toFixed(2)}</ThemedText>
            </View>
          )}

          <View style={styles.totalRow}>
            <ThemedText style={styles.totalLabel}>Total</ThemedText>
            <ThemedText style={styles.totalValue}>Rs. {order.total.toFixed(2)}</ThemedText>
          </View>

          <View style={styles.paymentInfo}>
            <ThemedText style={styles.paymentMethod}>
              Payment Method: {typeof paymentMethod === 'string' ? paymentMethod.replace('_', ' ').toUpperCase() : 'N/A'}
            </ThemedText>
            <ThemedText style={styles.paymentStatus}>
              Payment Status: {typeof paymentStatus === 'string'
                ? paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)
                : 'N/A'
              }
            </ThemedText>
          </View>
        </View>

        {/* Customer & Shipping */}
        <View style={styles.card}>
          <ThemedText style={styles.sectionTitle}>Shipping Information</ThemedText>
          <View style={styles.addressContainer}>
            <ThemedText style={styles.addressName}>{shippingName}</ThemedText>
            <ThemedText style={styles.addressLine}>{shippingLine1}</ThemedText>
            {shippingLine2 && (
              <ThemedText style={styles.addressLine}>{shippingLine2}</ThemedText>
            )}
            <ThemedText style={styles.addressLine}>
              {shippingCity}{shippingState ? `, ${shippingState}` : ''} {shippingPostal}
            </ThemedText>
            <ThemedText style={styles.addressLine}>{shippingCountry}</ThemedText>
            {shippingPhone && (
              <ThemedText style={styles.addressLine}>
                Phone: {shippingPhone}
              </ThemedText>
            )}
          </View>
        </View>

        <Button
          title="Back to Orders"
          onPress={() => router.push('/orders')}
          style={styles.backButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButton: {
    minWidth: 180,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2.5,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productDetails: {
    flex: 1,
    paddingHorizontal: 12,
  },
  productTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  variant: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  quantity: {
    fontSize: 13,
    color: '#666',
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'right',
    alignSelf: 'center',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
  },
  summaryValue: {
    fontSize: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  paymentMethod: {
    fontSize: 14,
    marginBottom: 4,
  },
  paymentStatus: {
    fontSize: 14,
    color: '#666',
  },
  addressContainer: {
    marginBottom: 8,
  },
  addressName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 6,
  },
  addressLine: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  backButton: {
    marginTop: 16,
  },
}); 