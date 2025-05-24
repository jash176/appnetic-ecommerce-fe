import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { router, Stack } from 'expo-router';
import Button from '@/components/ui/Button';
import { createAuthenticatedClient } from '@/lib/api/payloadClient';
import { Order } from '@/lib/api/services/types';
import { getStoreId } from '@/service/storeService';
import { formatPrice } from '@/utils/functions';

// Format date to a readable format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
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

export default function Orders() {
  const { isAuthenticated, token, user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchOrders = async () => {
    if (!isAuthenticated || !token || !user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      const client = createAuthenticatedClient(token);
      const customer = await client.collections.customers.find({
        where: {
          user: {
            equals: Number(user.id) // Ensure id is a number
          }
        }
      });

      // Fetch orders associated with the current user
      const response = await client.collections.orders.find({
        where: {
          customer: {
            equals: customer.docs[0].id
          },

          store: {
            equals: getStoreId()
          }
        },
        sort: '-createdAt', // Most recent orders first
        depth: 1 // Include basic relations
      });

      setOrders(response.docs);
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load your orders. Please try again later.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, [isAuthenticated, token, user]);

  // If user is not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <View style={styles.emptyStateContainer}>
          <Ionicons name="receipt-outline" size={80} color="#ccc" />
          <ThemedText style={styles.emptyStateTitle}>Sign in to see your orders</ThemedText>
          <ThemedText style={styles.emptyStateSubtitle}>
            Your order history will be displayed here
          </ThemedText>
          <Button
            title="Sign In"
            onPress={() => router.push('/login')}
            style={styles.actionButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <View style={styles.emptyStateContainer}>
          <Ionicons name="alert-circle-outline" size={80} color="#F44336" />
          <ThemedText style={styles.emptyStateTitle}>Something went wrong</ThemedText>
          <ThemedText style={styles.emptyStateSubtitle}>{error}</ThemedText>
          <Button
            title="Try Again"
            onPress={fetchOrders}
            style={styles.actionButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  // No orders state
  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <Ionicons name="receipt-outline" size={80} color="#ccc" />
          <ThemedText style={styles.emptyStateTitle}>No orders yet</ThemedText>
          <ThemedText style={styles.emptyStateSubtitle}>
            When you place orders, they will appear here
          </ThemedText>
          <Button
            title="Start Shopping"
            onPress={() => router.push('/(tabs)')}
            style={styles.actionButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
          <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                  <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <ThemedText style={styles.title}>My Orders</ThemedText>
              </View>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.orderCard}
              onPress={() => router.push(`/order-details/${item.id}`)}
            >
              <View style={styles.orderHeader}>
                <ThemedText style={styles.orderNumber}>{item.orderNumber}</ThemedText>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <ThemedText style={styles.statusText}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </ThemedText>
                </View>
              </View>

              <View style={styles.orderDetails}>
                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Date:</ThemedText>
                  <ThemedText style={styles.detailValue}>{formatDate(item.createdAt)}</ThemedText>
                </View>

                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Items:</ThemedText>
                  <ThemedText style={styles.detailValue}>{item.items.length}</ThemedText>
                </View>

                <View style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Total:</ThemedText>
                  <ThemedText style={styles.orderTotal}>{formatPrice(item.total)}</ThemedText>
                </View>
              </View>

              <View style={styles.orderFooter}>
                <Ionicons name="chevron-forward" size={20} color="#757575" />
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  listContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  actionButton: {
    minWidth: 180,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  orderDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    color: '#666',
  },
  detailValue: {
    fontWeight: '500',
  },
  orderTotal: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    alignItems: 'flex-end',
  },
   header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
   backButton: {
    marginRight: 16,
  },
   title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 