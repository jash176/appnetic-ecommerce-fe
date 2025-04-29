import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useCartStore, Product } from '@/store/cartStore'
import { ThemedText } from '@/components/ThemedText'
import { Ionicons } from '@expo/vector-icons'
import Button from '@/components/ui/Button'
import GenericScrollView from '@/components/ui/GenericScrollView'
import { router } from 'expo-router'
import { getFullImageUrl } from '@/utils/functions'

const Cart = () => {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore()

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cart-outline" size={80} color="#ccc" />
      <ThemedText type="title" style={styles.emptyTitle}>Your cart is empty</ThemedText>
      <ThemedText style={styles.emptySubtitle}>Looks like you haven't added anything to your cart yet.</ThemedText>
    </View>
  )

  const renderCartItem = ({ item }: { item: Product }) => (
    <View style={styles.cartItem}>
      <Image 
        source={{ uri: getFullImageUrl(item.image as string) }} 
        style={styles.itemImage}
      />
      <View style={styles.itemInfo}>
        <ThemedText type="title" numberOfLines={1}>{item.productTitle}</ThemedText>
        <ThemedText>Rs. {item.price.toFixed(2)}</ThemedText>
        {item.variant && <ThemedText style={styles.variant}>Size: {item.variant}</ThemedText>}
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => {
              if (item.quantity > 1) {
                updateQuantity(item.productId, item.quantity - 1)
              }
            }}
          >
            <ThemedText style={styles.quantityButtonText}>-</ThemedText>
          </TouchableOpacity>
          
          <ThemedText style={styles.quantity}>{item.quantity}</ThemedText>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.productId, item.quantity + 1)}
          >
            <ThemedText style={styles.quantityButtonText}>+</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeItem(item.productId)}
      >
        <Ionicons name="close" size={20} color="#999" />
      </TouchableOpacity>
    </View>
  )

  if (items.length === 0) {
    return renderEmptyCart()
  }

  return (
    <View style={styles.container}>
      <GenericScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
        <View style={styles.header}>
          <ThemedText type="heading">Shopping Cart</ThemedText>
        </View>
          <TouchableOpacity onPress={clearCart}>
            <ThemedText style={styles.clearText}>Clear All</ThemedText>
          </TouchableOpacity>
        
        <FlatList
          data={items}
          renderItem={renderCartItem}
          keyExtractor={item => item.productId.toString()}
          scrollEnabled={false}
        />
        
        <View style={styles.summaryContainer}>
          <ThemedText type="title">Order Summary</ThemedText>
          
          <View style={styles.summaryRow}>
            <ThemedText>Subtotal</ThemedText>
            <ThemedText>Rs. {getSubtotal().toFixed(2)}</ThemedText>
          </View>
          
          <View style={styles.summaryRow}>
            <ThemedText>Shipping</ThemedText>
            <ThemedText>Rs. 0.00</ThemedText>
          </View>
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <ThemedText type="title">Total</ThemedText>
            <ThemedText type="title">Rs. {getSubtotal().toFixed(2)}</ThemedText>
          </View>
        </View>
        
        <View style={styles.checkoutButton}>
          <Button 
            title="CHECKOUT" 
            onPress={handleCheckout}
            fullWidth
          />
        </View>
      </GenericScrollView>
    </View>
  )
}

export default Cart

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: "#FFF"
  },
  emptyTitle: {
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    textAlign: 'center',
    color: '#999',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  clearText: {
    color: '#999',
    textAlign: "right",
    marginBottom: 10
  },
  cartItem: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  variant: {
    color: '#777',
    fontSize: 14,
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    paddingHorizontal: 15,
  },
  removeButton: {
    padding: 5,
  },
  summaryContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginVertical: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
    marginTop: 15,
  },
  checkoutButton: {
    marginBottom: 100,
  },
})