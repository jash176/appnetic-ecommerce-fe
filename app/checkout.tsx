import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Button from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import payloadClient from "@/lib/api/payloadClient";
import CheckoutForm, {
  CheckoutFormData,
} from "@/components/ui/ecommerce/CheckoutForm";
import OrderSummary from "@/components/ui/ecommerce/OrderSummary";
import PasswordCreationModal from "@/components/ui/ecommerce/PasswordCreationModal";
import { formatCreatePayload, extractId } from "@/lib/api/utils";
import { set } from "lodash";
import { getStoreId } from "@/service/storeService";
import {
  initiateRazorpayPayment,
  generateRazorpayOptions,
  handleRazorpayResponse,
} from "@/service/RazorpayService";
import ProcessingPaymentModal from "@/components/ui/ecommerce/ProcessingPaymentModal";
import { pollOrderStatus } from "@/utils/functions";
import { useCart } from "@/lib/api/hooks/useCart";
export default function CheckoutPage() {
  const { top } = useSafeAreaInsets();
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuthStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProcessingModal, setShowProcessingModal] = useState(false);
  const [customerData, setCustomerData] = useState<any>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  // Form state for checkout
  const [formData, setFormData] = useState<CheckoutFormData>({
    name:
      user?.name
        ? `${user.name}`
        : user?.name || "",
    email: user?.email || "",
    phone: "",
    shippingAddress: {
      name: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      phone: "",
    },
    billingAddressSameAsShipping: true,
    billingAddress: {
      name: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      phone: "",
    },
    paymentMethod: "cod",
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      const updatedData = { ...prev };

      // Update the original field
      set(updatedData, field, value);

      // If billing is same as shipping and it's a shipping field, also update billing field
      // if (prev.billingAddressSameAsShipping && field.startsWith('shippingAddress.')) {
      //   const billingField = field.replace('shippingAddress.', 'billingAddress.');
      //   set(updatedData, billingField, value);
      // }

      return updatedData;
    });
  };

  // Handle toggle for billing address same as shipping
  const handleBillingToggle = (value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      billingAddressSameAsShipping: value,
      billingAddress: value ? { ...prev.shippingAddress } : prev.billingAddress,
    }));
  };

  const onRazorpayPaymentSuccess = (newOrderId: number) => {
    setShowProcessingModal(false);
    clearCart();
    completeCheckout(newOrderId);
  };

  const onRazorpayPaymentFailure = () => {
    // Payment failed
    setIsSubmitting(false);
  };

  // Handle checkout submission
  const handleCheckout = async () => {
    if (!validateForm() || !cart || !cart.items) return;

    setIsSubmitting(true);

    try {
      // Step 1: Check if customer exists or create new customer
      let customerId: number;

      // Try to find existing customer by email
      const customersResponse = await payloadClient.collections.customers.find({
        where: {
          email: {
            equals: formData.email,
          },
          store: {
            equals: 1,
          },
        },
      });

      if (customersResponse.docs.length > 0) {
        // Use existing customer
        customerId = customersResponse.docs[0].id as number;
        setCustomerData(customersResponse.docs[0]);
      } else {
        // Create new customer
        const customerData = {
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          addresses: [
            {
              type: "both" as const,
              isDefault: true,
              ...formData.shippingAddress,
            },
          ],
          // Default store value required by schema
          store: getStoreId(),
        };
        const customerResponse =
          await payloadClient.collections.customers.create(
            formatCreatePayload(customerData)
          );

        console.log("customerResponse : ", customerResponse);

        customerId = extractId(customerResponse.doc);
        setCustomerData(customerResponse.doc);
      }

      // Step 2: Create order with customer ID
      const orderItems = cart.items.map((item) => ({
        product: item.product,
        variant: item.variant,
        quantity: item.quantity,
        price: item.price ?? 0,
      }));

      const subtotal = cart?.subtotal ?? 0;

      const orderData = {
        orderNumber: `ORD-${Date.now()}`,
        store: getStoreId(),
        customer: customerId,
        items: orderItems,
        subtotal,
        tax: 0, // Calculate tax if needed
        shipping: 0, // Calculate shipping if needed
        discount: 0, // Apply discounts if needed
        total: subtotal,
        currency: "INR",
        status: "pending" as const,
        shippingAddress: formData.shippingAddress,
        billingAddress: formData.billingAddressSameAsShipping
          ? formData.shippingAddress
          : formData.billingAddress,
        paymentInfo: {
          method: formData.paymentMethod,
          status: "pending" as const,
        },
      };

      const orderResponse = await payloadClient.collections.orders.create(
        formatCreatePayload(orderData)
      );

      const newOrderId = extractId(orderResponse.doc);
      setOrderId(newOrderId);

      // Process payment based on selected payment method
      if (formData.paymentMethod === "razorpay") {
        try {
          const razorpayOrderId = orderResponse.doc.razorpay?.orderId || "";
          const options = generateRazorpayOptions(razorpayOrderId, subtotal, {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          });

          // Initiate Razorpay payment
          const paymentResponse = await initiateRazorpayPayment(options);

          // Handle payment response
          handleRazorpayResponse(
            paymentResponse,
            async (paymentId, orderId, signature) => {
              // Update order with payment information
              await payloadClient.collections.orders.update({
                where: {
                  id: {
                    equals: orderResponse.doc.id,
                  },
                },
                patch: {
                  paymentInfo: {
                    method: "razorpay",
                    status: "pending",
                    transactionId: paymentId,
                  },
                },
              });
              setShowProcessingModal(true);
              pollOrderStatus(
                orderResponse.doc.id,
                () => onRazorpayPaymentSuccess(newOrderId),
                onRazorpayPaymentFailure
              );
            },
            () => {
              // Payment failed
              setIsSubmitting(false);
            }
          );
        } catch (paymentError) {
          console.error("Payment error:", paymentError);
          Alert.alert(
            "Payment Failed",
            "There was an error processing your payment. Please try again."
          );
          setIsSubmitting(false);
        }
      } else {
        // COD payment - proceed as usual
        clearCart();
        completeCheckout(newOrderId);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      Alert.alert(
        "Checkout Failed",
        "There was an error processing your order. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  // Helper function to complete checkout and navigate
  const completeCheckout = (orderId: number) => {
    // Show password creation modal if user is not authenticated
    if (!isAuthenticated && !customerData?.user) {
      setShowPasswordModal(true);
    } else {
      router.push({
        pathname: "/order-confirmation",
        params: { orderId: orderId.toString() },
      });
    }
    setIsSubmitting(false);
  };

  // Validate form fields
  const validateForm = () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      Alert.alert(
        "Missing Information",
        "Please fill in all required personal information."
      );
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return false;
    }

    // Validate shipping address
    const { name, line1, city, state, postalCode, country } =
      formData.shippingAddress;
    if (!name || !line1 || !city || !state || !postalCode || !country) {
      Alert.alert(
        "Missing Address Information",
        "Please fill in all required shipping address fields."
      );
      return false;
    }

    // Validate billing address if different from shipping
    if (!formData.billingAddressSameAsShipping) {
      const { name, line1, city, state, postalCode, country } =
        formData.billingAddress;
      if (!name || !line1 || !city || !state || !postalCode || !country) {
        Alert.alert(
          "Missing Address Information",
          "Please fill in all required billing address fields."
        );
        return false;
      }
    }

    return true;
  };

  // Handle password creation completion
  const handlePasswordCreation = () => {
    setShowPasswordModal(false);

    setTimeout(() => {
      if (orderId) {
        router.push({
          pathname: "/order-confirmation",
          params: { orderId: orderId.toString() },
        });
      }
    }, 200);
  };

  // Skip password creation
  const handleSkipPasswordCreation = () => {
    setShowPasswordModal(false);

    if (orderId) {
      router.push({
        pathname: "/order-confirmation",
        params: { orderId: orderId.toString() },
      });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <ThemedText type="heading">Checkout</ThemedText>
        </View>

        <CheckoutForm
          formData={formData}
          onChange={handleChange}
          onBillingToggle={handleBillingToggle}
          onPaymentMethodChange={(method) =>
            setFormData((prev) => ({ ...prev, paymentMethod: method }))
          }
        />

        {cart && <OrderSummary cart={cart} />}

        <View style={styles.checkoutButton}>
          <Button
            title="PLACE ORDER"
            onPress={handleCheckout}
            loading={isSubmitting}
            fullWidth
          />
        </View>
      </ScrollView>

      <PasswordCreationModal
        visible={showPasswordModal}
        email={formData.email}
        customerId={customerData?.id}
        onComplete={handlePasswordCreation}
        onSkip={handleSkipPasswordCreation}
      />

      <ProcessingPaymentModal visible={showProcessingModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    marginTop: 12,
  },
  backButton: {
    marginBottom: 16,
  },
  checkoutButton: {
    marginTop: 24,
    marginBottom: 60,
  },
});
