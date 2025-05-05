import { 
  StyleSheet, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Dimensions,
  StatusBar
} from 'react-native'
import React, { useRef, useEffect } from 'react'
import { useCartStore, Product } from '@/store/cartStore'
import { ThemedText } from '@/components/ThemedText'
import { Ionicons } from '@expo/vector-icons'
import Button from '@/components/ui/Button'
import GenericScrollView from '@/components/ui/GenericScrollView'
import { router } from 'expo-router'
import { getFullImageUrl } from '@/utils/functions'
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay,
  FadeIn,
  FadeOut,
  SlideInRight,
  Layout
} from 'react-native-reanimated'

const SCREEN_WIDTH = Dimensions.get('window').width;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const Cart = () => {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore()
  
  // Animation values
  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(30);
  
  // Start entrance animation
  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 600 });
    slideAnim.value = withTiming(0, { duration: 600 });
  }, []);

  // Animation styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
      transform: [{ translateY: slideAnim.value }]
    };
  });

  const handleCheckout = () => {
    router.push('/checkout');
  };
  
  const handleRemoveItem = (productId: number) => {
    // Animation for removal
    removeItem(productId);
  };

  const renderEmptyCart = () => (
    <Animated.View 
      entering={FadeIn.duration(600)}
      style={styles.emptyContainer}
    >
      <Ionicons name="cart-outline" size={100} color="#dce4f0" />
      <ThemedText type="title" style={styles.emptyTitle}>Your cart is empty</ThemedText>
      <ThemedText style={styles.emptySubtitle}>
        Looks like you haven't added anything to your cart yet.
      </ThemedText>
      <TouchableOpacity 
        style={styles.shopNowButton}
        onPress={() => router.push('/')}
        activeOpacity={0.8}
      >
        <Ionicons name="basket-outline" size={20} color="#fff" />
        <ThemedText style={styles.shopNowText}>SHOP NOW</ThemedText>
      </TouchableOpacity>
    </Animated.View>
  )

  const renderCartItem = ({ item, index }: { item: Product, index: number }) => {
    // Animation delay based on index for staggered entrance
    const delay = index * 100;
    
    return (
      <Animated.View 
        entering={SlideInRight.duration(400).delay(delay)} 
        layout={Layout.springify()}
        exiting={FadeOut.duration(300)}
        style={styles.cartItem}
      >
        <View style={styles.cartItemInner}>
          <Image 
            source={{ uri: getFullImageUrl(item.image as string) }} 
            style={styles.itemImage}
            resizeMode="cover"
          />
          <View style={styles.itemInfo}>
            <ThemedText style={styles.itemTitle} numberOfLines={2}>{item.productTitle}</ThemedText>
            <ThemedText style={styles.itemPrice}>₹ {item.price.toFixed(2)}</ThemedText>
            {item.variant && (
              <View style={styles.variantTag}>
                <ThemedText style={styles.variant}>{item.variant}</ThemedText>
              </View>
            )}
            
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={[styles.quantityButton, item.quantity <= 1 && styles.disabledButton]}
                onPress={() => {
                  if (item.quantity > 1) {
                    updateQuantity(item.productId, item.quantity - 1)
                  }
                }}
                disabled={item.quantity <= 1}
                activeOpacity={0.7}
              >
                <Ionicons name="remove" size={18} color={item.quantity <= 1 ? "#ccc" : "#4a6eb5"} />
              </TouchableOpacity>
              
              <View style={styles.quantityValue}>
                <ThemedText style={styles.quantity}>{item.quantity}</ThemedText>
              </View>
              
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.productId, item.quantity + 1)}
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={18} color="#4a6eb5" />
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => handleRemoveItem(item.productId)}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  if (items.length === 0) {
    return renderEmptyCart()
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <GenericScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View style={[styles.headerContainer, animatedStyle]}>
          <View style={styles.header}>
            <ThemedText style={styles.headerTitle}>Shopping Cart</ThemedText>
            <View style={styles.badge}>
              <ThemedText style={styles.badgeText}>{items.length}</ThemedText>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.clearButton} 
            onPress={clearCart}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={16} color="#e74c3c" />
            <ThemedText style={styles.clearText}>Clear All</ThemedText>
          </TouchableOpacity>
        </Animated.View>
        
        <FlatList
          data={items}
          renderItem={renderCartItem}
          keyExtractor={item => item.productId.toString()}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          style={styles.list}
        />
        
        <Animated.View 
          style={[styles.summaryContainer, animatedStyle]}
          entering={FadeIn.duration(600).delay(300)}
        >
          <ThemedText style={styles.summaryTitle}>Order Summary</ThemedText>
          
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Subtotal</ThemedText>
            <ThemedText style={styles.summaryValue}>₹ {getSubtotal().toFixed(2)}</ThemedText>
          </View>
          
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Shipping</ThemedText>
            <ThemedText style={styles.summaryValue}>₹ 0.00</ThemedText>
          </View>
          
          <View style={styles.divider} />
          
          <View style={[styles.summaryRow, styles.totalRow]}>
            <ThemedText style={styles.totalLabel}>Total</ThemedText>
            <ThemedText style={styles.totalValue}>₹ {getSubtotal().toFixed(2)}</ThemedText>
          </View>
        </Animated.View>
        
        <Animated.View 
          style={[styles.checkoutButtonContainer, animatedStyle]}
          entering={FadeIn.duration(600).delay(500)}
        >
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
            activeOpacity={0.8}
          >
            <Ionicons name="wallet-outline" size={20} color="#fff" />
            <ThemedText style={styles.checkoutText}>CHECKOUT</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </GenericScrollView>
    </View>
  )
}

export default Cart

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  badge: {
    backgroundColor: '#4a6eb5',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    padding: 6,
  },
  clearText: {
    color: '#e74c3c',
    marginLeft: 4,
    fontWeight: '500',
  },
  list: {
    marginTop: 8,
  },
  cartItem: {
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cartItemInner: {
    flexDirection: 'row',
    padding: 12,
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: '#f5f5f5',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    lineHeight: 22,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4a6eb5',
    marginBottom: 6,
  },
  variantTag: {
    backgroundColor: '#f0f4f9',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  variant: {
    color: '#4a6eb5',
    fontSize: 12,
    fontWeight: '600',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
  },
  quantityButton: {
    backgroundColor: '#f0f4f9',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dce4f0',
  },
  disabledButton: {
    backgroundColor: '#f8f8f8',
    borderColor: '#ebebeb',
  },
  quantityValue: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    height: 32,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#dce4f0',
  },
  quantity: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  removeButton: {
    padding: 8,
    marginLeft: 'auto',
    alignSelf: 'flex-start',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 10,
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    color: '#666',
    fontSize: 15,
  },
  summaryValue: {
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  totalRow: {
    marginTop: 4,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4a6eb5',
  },
  checkoutButtonContainer: {
    marginBottom: 40,
  },
  checkoutButton: {
    backgroundColor: '#4a6eb5',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4a6eb5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: "#f8f9fa"
  },
  emptyTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  emptySubtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    fontSize: 16,
    maxWidth: SCREEN_WIDTH * 0.7,
    lineHeight: 22,
  },
  shopNowButton: {
    backgroundColor: '#4a6eb5',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4a6eb5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  shopNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});