import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { formatPrice } from "@/utils/functions";
import { Cart, Discount } from "@/lib/api/services/types";

interface OrderSummaryProps {
  cart: Cart;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cart }) => {
  if (!cart.items) return null;

  const subtotal = cart.subtotal ?? 0;

  // Calculate tax (example: 10%)
  const taxRate = 0;
  const tax = subtotal * taxRate;

  // Calculate shipping (example: free shipping over 500)
  const shippingThreshold = 500;
  const baseShippingCost = 0;
  const shipping = subtotal >= shippingThreshold ? 0 : baseShippingCost;

  return (
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
        const discountObj = discount as Discount;
        return (
          <View key={discountObj.id} style={styles.summaryRow}>
            <View style={styles.discountRow}>
              <ThemedText>{discountObj.code}</ThemedText>
            </View>
            <ThemedText>{formatPrice(discountObj?.value ?? 0)}</ThemedText>
          </View>
        );
      })}

      <View style={[styles.summaryRow, styles.totalRow]}>
        <ThemedText type="title">Total</ThemedText>
        <ThemedText type="title">{formatPrice(cart.total ?? 0)}</ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginVertical: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
    marginTop: 15,
  },
  discountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default OrderSummary;
