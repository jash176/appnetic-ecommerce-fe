import { addItemToCart, applyDiscountCode, getOrCreateCart, removeItemFromCart } from "@/utils/functions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import payloadClient, { createAuthenticatedClient } from "../payloadClient";
import { AUTH_TOKEN_KEY } from "@/store/authStore";
import { useEffect, useState } from "react";
import { Cart } from "../services/types";
import { useLoadingStore } from "@/hooks/useLoading";

export const useCart = () => {
  const { showLoading, hideLoading } = useLoadingStore();
  const [items, setItems] = useState<Cart>();
  const fetchCart = async () => {
    const cartId = await getOrCreateCart();
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    const client = token
      ? createAuthenticatedClient(token)
      : payloadClient;
    const cart = await client.collections.cart.findById({ id: Number(cartId) });
    setItems(cart)
  }

  const addToCart = async ({ productId, variant }: {
    productId: number;
    variant?: string;
}) => {
    showLoading("Adding item to cart...")
    const cart = await addItemToCart({ productId, variant });
    setItems(cart);
    hideLoading();
  }

  const removeFromCart = async ({ productId, variant }: {
    productId: number;
    variant?: string;
}) => {
    showLoading("Removing item from cart...")
    const cart = await removeItemFromCart(productId, variant);
    setItems(cart);
    hideLoading();
  }

  const applyPromo = async (code: string) => {
    showLoading("Applying promo code...")
    const cart = await applyDiscountCode(code);
    setItems(cart);
    hideLoading();
  }

  useEffect(() => {
    fetchCart()
  }, [])

  return { cart: items, addToCart, removeFromCart, fetchCart, applyPromo }
}