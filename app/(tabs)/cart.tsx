import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import { ThemedText } from '@/components/ThemedText'
import { Ionicons } from '@expo/vector-icons'
import Button from '@/components/ui/Button'
import GenericScrollView from '@/components/ui/GenericScrollView'
import { router } from 'expo-router'
import { formatPrice, getFullImageUrl } from '@/utils/functions'
import { useCart } from '@/lib/api/hooks/useCart'
import { Discount, Media, Product } from '@/lib/api/services/types'

const CartScreen = () => {
  const { removeItem, clearCart } = useCartStore()

  const { cart, addToCart, removeFromCart, fetchCart, applyPromo } = useCart()

  const [refreshing, setRefreshing] = useState(false)
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      await fetchCart()
    } finally {
      setRefreshing(false)
    }
  }

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const handleApplyPromo = () => {
    // Dummy logic for now, replace with real validation if needed
    applyPromo(promoCode)
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cart-outline" size={80} color="#ccc" />
      <ThemedText type="title" style={styles.emptyTitle}>Your cart is empty</ThemedText>
      <ThemedText style={styles.emptySubtitle}>Looks like you haven't added anything to your cart yet.</ThemedText>
    </View>
  )

  const renderCartItem = ({ item }: {
    item: {
      product: number | Product;
      variant?: string | null;
      quantity: number;
      price?: number | null;
      id?: string | null;
    }
  }) => {
    const product = item.product as Product;
    const images = product.images && product.images[0].image as Media;
    return (
      <View style={styles.cartItem}>
        <Image
          source={{ uri: getFullImageUrl(images?.filename ?? "") }}
          style={styles.itemImage}
        />
        <View style={styles.itemInfo}>
          <ThemedText type="title" numberOfLines={1}>{product.title}</ThemedText>
          <ThemedText>Rs. {product.price.toFixed(2)}</ThemedText>
          {item.variant && <ThemedText style={styles.variant}>Size: {item.variant}</ThemedText>}

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => {
                removeFromCart({
                  productId: product.id,
                  variant: item.variant as string
                })
              }}
            >
              <ThemedText style={styles.quantityButtonText}>-</ThemedText>
            </TouchableOpacity>

            <ThemedText style={styles.quantity}>{item.quantity}</ThemedText>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => addToCart({
                productId: product.id,
                variant: item.variant as string
              })}
            >
              <ThemedText style={styles.quantityButtonText}>+</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeItem(product.id)}
        >
          <Ionicons name="close" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    )
  }

  if (!cart) return renderEmptyCart()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="heading">Shopping Cart</ThemedText>
      </View>
      <View style={styles.promoContainer}>
        <TextInput
          style={styles.promoInput}
          placeholder="Enter promo code"
          value={promoCode}
          onChangeText={setPromoCode}
          editable={!promoApplied}
        />
        <TouchableOpacity
          style={styles.promoButton}
          onPress={handleApplyPromo}
          disabled={promoApplied}
        >
          <ThemedText style={styles.promoButtonText}>{promoApplied ? "Applied" : "Apply"}</ThemedText>
        </TouchableOpacity>
      </View>
      <FlatList
        data={cart.items}
        renderItem={renderCartItem}
        keyExtractor={item => item.product.toString()}
        scrollEnabled={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListHeaderComponent={() => (
          <View>
            <TouchableOpacity onPress={clearCart}>
              <ThemedText style={styles.clearText}>Clear All</ThemedText>
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={() => (
          <View>
            <View style={styles.summaryContainer}>
              <ThemedText type="title">Order Summary</ThemedText>

              <View style={styles.summaryRow}>
                <ThemedText>Subtotal</ThemedText>
                <ThemedText>{formatPrice(cart.subtotal ?? 0)}</ThemedText>
              </View>

              <View style={styles.summaryRow}>
                <ThemedText>Shipping</ThemedText>
                <ThemedText>Rs. 0.00</ThemedText>
              </View>

              {cart.appliedDiscounts?.map((discount, index) => {
                const discountObj = discount as Discount
return(
                <View style={styles.summaryRow}>
                <ThemedText>{discountObj.code}</ThemedText>
                <ThemedText>{formatPrice(discountObj?.value ?? 0)}</ThemedText>
              </View>
              )})}

              <View style={[styles.summaryRow, styles.totalRow]}>
                <ThemedText type="title">Total</ThemedText>
                <ThemedText type="title">{formatPrice(cart.total ?? 0)}</ThemedText>
              </View>
            </View>

            <View style={styles.checkoutButton}>
              <Button
                title="CHECKOUT"
                onPress={handleCheckout}
                fullWidth
              />
            </View>
          </View>
        )}
        ListEmptyComponent={renderEmptyCart}
      />
    </View>
  )
}

export default CartScreen

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
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  promoButton: {
    backgroundColor: '#222',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
  },
  promoButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  promoError: {
    color: 'red',
    marginTop: 4,
    marginBottom: 4,
  },
  promoSuccess: {
    color: 'green',
    marginTop: 4,
    marginBottom: 4,
  },
})