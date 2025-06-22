import payloadClient, { createAuthenticatedClient } from "@/lib/api/payloadClient";
import { Product } from "@/lib/api/services/types";
import { AUTH_TOKEN_KEY } from "@/store/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getFullImageUrl = (filename: string) =>
  `${process.env.EXPO_PUBLIC_STORAGE_URL}${filename}`

export const formatPrice = (price: number, currency = 'INR'): string => {
  return `Rs. ${price.toFixed(2)}`;
};

export const pollOrderStatus = async (orderId: number, onSuccess: () => void, onFailure: () => void) => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    const client = token
      ? createAuthenticatedClient(token)
      : payloadClient;
    const poll = setInterval(async () => {
      const order = await client.collections.orders.findById({
        id: orderId,
      });
      console.log('Polling order status:', order);
      if (order.status === "completed") {
        clearInterval(poll);
        onSuccess();
      } else if (order.status === 'cancelled') {
        clearInterval(poll);
        onFailure();
      }
    }, 3000)
  } catch (error) {
    console.error('Error polling order status:', error);
  }
}

export const getOrCreateCart = async () => {
  try {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    let cartId = await AsyncStorage.getItem('cartId');
    const client = token
      ? createAuthenticatedClient(token)
      : payloadClient;
    if (cartId) {
      try {
        await client.collections.cart.findById({
          id: Number(cartId),
        });
        return cartId
      } catch (err) {
        await AsyncStorage.removeItem('cartId') // in case it's deleted
      }
    }

    const newCart = await client.collections.cart.create({
      doc: {
        store: Number(process.env.EXPO_PUBLIC_STORE_ID),
        items: [],
      }
    })

    cartId = newCart.doc.id.toString();
    await AsyncStorage.setItem('cartId', cartId);
    return cartId

  } catch (error) {
    console.error('Error getting or creating cart:', error);
  }
}

export const addItemToCart = async (
  {
    productId,
    variant
  }: {
    productId: number
    variant?: string
  }
) => {
  const cartId = await getOrCreateCart();
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  const client = token
    ? createAuthenticatedClient(token)
    : payloadClient;
  const cart = await client.collections.cart.findById({ id: Number(cartId) });
  const existingItemIndex = cart.items.findIndex((item) => {
    const product = item.product as Product;
    return product.id === Number(productId) && item.variant === variant
  });
  if (existingItemIndex > -1) {
    // Update quantity
    cart.items[existingItemIndex].quantity += 1
  } else {
    cart.items.push({ product: Number(productId), quantity: 1, variant })
  }
  const updated = await client.collections.cart.updateById({
    id: Number(cartId),
    patch: {
      items: cart.items
    }
  })

  console.log('Updated cart:', JSON.stringify(updated))

  return updated.doc
}

export const removeItemFromCart = async (productId: number, variant?: string) => {
  const cartId = await getOrCreateCart();
  if (!cartId) return
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  const client = token
    ? createAuthenticatedClient(token)
    : payloadClient;
  const cart = await client.collections.cart.findById({ id: Number(cartId) });

  const updatedItems = cart.items
    .map((item: any) => {
      const product = item.product as Product;

      if (product.id === Number(productId) && item.variant === variant) {
        const newQuantity = item.quantity - 1;

        // If quantity becomes 0 or less, we filter it out later
        return newQuantity > 0
          ? { ...item, quantity: newQuantity }
          : null;
      }

      return item;
    })
    .filter(Boolean);

  const updated = await client.collections.cart.updateById({

    id:
      Number(cartId),

    patch: {
      items: updatedItems,
    }
  })

  return updated.doc
}

export const applyDiscountCode = async (code: string) => {
  const cartId = await getOrCreateCart();
  if (!cartId) return;
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  const client = token
    ? createAuthenticatedClient(token)
    : payloadClient;
  const res = await client.collections.discounts.find({
    where: {
      code: {
        equals: code,
      },
      active: {
        equals: true,
      },
      isAutomatic: {
        equals: false,
      },
      store: {
        equals: Number(process.env.EXPO_PUBLIC_STORE_ID),
      }
    }
  })
  const validDiscount = res.docs[0];
  if (!validDiscount) throw new Error(JSON.stringify({
    errors: [
      {
        message: 'Invalid discount code',
        code: 'INVALID_DISCOUNT_CODE',
      }
    ]
  }));
  const cart = await client.collections.cart.findById({ id: Number(cartId) });

  const appliedDiscounts = [...cart.appliedDiscounts || [], validDiscount.id]
  const updated = await client.collections.cart.updateById({

    id: Number(cartId),
    patch: {
      appliedDiscounts,
    }
  })
  return updated.doc
}

export const removeDiscountCode = async (code: string) => {
  const cartId = await getOrCreateCart();
  if (!cartId) return;
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  const client = token
    ? createAuthenticatedClient(token)
    : payloadClient;
  const cart = await client.collections.cart.findById({ id: Number(cartId) });
  const appliedDiscounts = cart.appliedDiscounts?.filter((discount: any) => discount.code !== code) || []
  const updated = await client.collections.cart.updateById({

    id: Number(cartId),
    patch: {
      appliedDiscounts,
    }
  })
  return updated.doc
}

export const clearDiscountCode = async () => {
  const cartId = await getOrCreateCart();
  if (!cartId) return;
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  const client = token
    ? createAuthenticatedClient(token)
    : payloadClient;
  const updated = await client.collections.cart.updateById({
    id: Number(cartId),
    patch: {
      appliedDiscounts: [],
    }
  })
  return updated.doc
}

export const clearCartItems = async () => {
  const cartId = await getOrCreateCart();
  if (!cartId) return;
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  const client = token
    ? createAuthenticatedClient(token)
    : payloadClient;
  const updated = await client.collections.cart.updateById({
    id: Number(cartId),
    patch: {
      items: [],
    }
  })
  return updated.doc
}