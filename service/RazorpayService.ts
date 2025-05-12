import RazorpayCheckout, { CheckoutOptions } from 'react-native-razorpay';
import { Alert } from 'react-native';
import Constants from 'expo-constants';

// Define the payment response interface
export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature?: string;
}

/**
 * Initialize Razorpay payment
 * @param options Checkout options
 * @returns Promise with payment response
 */
export const initiateRazorpayPayment = (options: CheckoutOptions): Promise<RazorpayResponse> => {
  return new Promise((resolve, reject) => {
    RazorpayCheckout.open(options)
      .then((data: RazorpayResponse) => {
        // Handle success
        resolve(data);
      })
      .catch((error: any) => {
        // Handle failure
        reject(error);
      });
  });
};

/**
 * Generate Razorpay options object
 * @param orderId Order ID from your backend
 * @param amount Amount in rupees
 * @param customerInfo Customer information
 * @returns RazorpayOptions object
 */
export const generateRazorpayOptions = (
  orderId: string,
  amount: number,
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  }
): CheckoutOptions => {
  // Convert amount to paise (smallest currency unit for INR)
  const amountInPaise = Math.round(amount * 100);
  return {
    name: process.env.EXPO_PUBLIC_STORE_NAME || "Appnectic",
    description: `Payment for order #${orderId}`,
    currency: 'INR',
    key: Constants.expoConfig?.extra?.razorpayApiKey,
    amount: amountInPaise,
    order_id: orderId, // This should be generated from your backend
    prefill: {
      email: customerInfo.email,
      contact: customerInfo.phone,
      name: customerInfo.name,
    },
    theme: {
      color: '#000000', // Your brand color
    },
  };
};

/**
 * Handle Razorpay payment response
 * @param response Payment response from Razorpay
 * @param onSuccess Success callback
 * @param onError Error callback
 */
export const handleRazorpayResponse = (
  response: RazorpayResponse,
  onSuccess: (paymentId: string, orderId: string, signature?: string) => void,
  onError: () => void
) => {
  if (response.razorpay_payment_id) {
    // Payment successful
    onSuccess(
      response.razorpay_payment_id,
      response.razorpay_order_id,
      response.razorpay_signature
    );
  } else {
    // Payment failed
    Alert.alert('Payment Failed', 'Your payment was not successful. Please try again.');
    onError();
  }
};