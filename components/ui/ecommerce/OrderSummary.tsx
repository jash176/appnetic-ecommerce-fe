import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { getFullImageUrl } from '@/utils/functions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Product } from '@/store/cartStore';

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: any; // Using any for simplicity; could be more strongly typed
  variant?: {
    id: string;
    title: string;
    price: number;
  };
}

interface OrderSummaryProps {
  items: Product[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items }) => {
  const { top: paddingTop } = useSafeAreaInsets();
  // Calculate subtotal
  const subtotal = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
  
  // Calculate tax (example: 10%)
  const taxRate = 0;
  const tax = subtotal * taxRate;
  
  // Calculate shipping (example: free shipping over 500)
  const shippingThreshold = 500;
  const baseShippingCost = 0;
  const shipping = subtotal >= shippingThreshold ? 0 : baseShippingCost;
  
  // Calculate total
  const total = subtotal + tax + shipping;
  
  return (
    <View style={[styles.container, {paddingTop}]}>
      <ThemedText style={styles.title}>Order Summary</ThemedText>
      
      <View style={styles.itemsList}>
        {items.map((item, index) => (
          <View key={`${item.productId}-${index}`} style={styles.item}>
            {item.image && (
              <Image 
                source={{ uri: getFullImageUrl(item.image) }}
                style={styles.itemImage}
              />
            )}
            
            <View style={styles.itemDetails}>
              <ThemedText style={styles.itemTitle}>{item.productTitle}</ThemedText>
              {item.variant && (
                <ThemedText style={styles.itemVariant}>{item.variant}</ThemedText>
              )}
              <ThemedText>Qty: {item.quantity}</ThemedText>
            </View>
            
            <ThemedText style={styles.itemPrice}>
              Rs. {(item.price * item.quantity).toFixed(2)}
            </ThemedText>
          </View>
        ))}
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.summaryRows}>
        <View style={styles.summaryRow}>
          <ThemedText>Subtotal</ThemedText>
          <ThemedText>Rs. {subtotal.toFixed(2)}</ThemedText>
        </View>
        
        {tax > 0 && (
          <View style={styles.summaryRow}>
            <ThemedText>Tax</ThemedText>
            <ThemedText>Rs. {tax.toFixed(2)}</ThemedText>
          </View>
        )}
        
        <View style={styles.summaryRow}>
          <ThemedText>Shipping</ThemedText>
          <ThemedText>{shipping === 0 ? 'Free' : `Rs. ${shipping}`}</ThemedText>
        </View>
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <ThemedText style={styles.totalLabel}>Total</ThemedText>
          <ThemedText style={styles.totalAmount}>Rs. {total.toFixed(2)}</ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemsList: {
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontWeight: '600',
  },
  itemVariant: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  itemPrice: {
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 16,
  },
  summaryRows: {
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default OrderSummary; 