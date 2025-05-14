import payloadClient, { createAuthenticatedClient } from "@/lib/api/payloadClient";
import { AUTH_TOKEN_KEY } from "@/store/authStore";

export const getFullImageUrl = (filename: string) =>
  `https://repzaskxofppkxvcmokf.supabase.co/storage/v1/object/public/media/media/${filename}`

export const formatPrice = (price: number, currency = 'INR'): string => {
  return `Rs. ${price.toFixed(2)}`;
};

export const pollOrderStatus = async (orderId: number, onSuccess: () => void, onFailure: () => void) => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const client = token
      ? createAuthenticatedClient(token)
      : payloadClient;
    const poll = setInterval(async () => {
      const order = await client.collections.orders.findById({
        id: orderId,
      });
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