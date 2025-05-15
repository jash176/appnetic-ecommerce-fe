import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/ui/Button';

// FAQ data structure
interface FAQ {
  id: string;
  question: string;
  answer: string;
}

// Support channel structure
interface SupportChannel {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  action: () => void;
}

export default function SupportScreen() {
  const { top } = useSafeAreaInsets();
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  
  // Handler for back navigation
  const handleBackPress = () => {
    // Navigate to the profile tab since support is typically accessed from there
    router.navigate('/(tabs)/profile');
  };
  
  // Toggle FAQ expansion
  const toggleFaq = (id: string) => {
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
    }
  };
  
  // List of FAQs
  const faqs: FAQ[] = [
    {
      id: 'order1',
      question: 'How do I track my order?',
      answer: 'You can track your order by going to "My Orders" in your profile and selecting the specific order. We provide real-time updates from order placement to delivery. You will also receive email and SMS notifications for major status changes.'
    },
    {
      id: 'order2',
      question: 'Can I change or cancel my order?',
      answer: 'You can cancel or modify your order only if it has not been shipped yet. Go to "My Orders," select the order you wish to change, and look for the Cancel or Modify options. If these options are not available, please contact our customer support for assistance.'
    },
    {
      id: 'return1',
      question: 'What is your return policy?',
      answer: 'We accept returns within 7 days of delivery for most products. Items must be in their original condition with tags attached. Some categories like personal care items and undergarments are not eligible for return due to hygiene reasons. Please check the product page for specific return eligibility.'
    },
    {
      id: 'return2',
      question: 'How do I initiate a return or exchange?',
      answer: 'To initiate a return, go to "My Orders" in your profile, select the order, and click on "Return or Exchange." Follow the on-screen instructions to complete the process. Our team will arrange for pickup, or you may need to ship the item back based on the product type.'
    },
    {
      id: 'payment1',
      question: 'What payment methods do you accept?',
      answer: 'We accept credit/debit cards (Visa, Mastercard, American Express), net banking, UPI, popular wallets like Paytm and PhonePe, and Cash on Delivery (COD). International customers can pay using PayPal or international credit cards.'
    },
    {
      id: 'payment2',
      question: 'Is Cash on Delivery available for all products?',
      answer: 'Cash on Delivery (COD) is available for most products below ₹10,000. However, certain high-value items, items shipped from international sellers, and orders delivered to some remote locations may not be eligible for COD. The COD availability is shown during checkout.'
    },
    {
      id: 'shipping1',
      question: 'How long will my delivery take?',
      answer: 'Standard delivery typically takes 3-5 business days for most locations. Metro cities usually receive deliveries within 1-3 days. Remote locations may take 5-7 days. Express delivery (available for select products) can deliver within 24 hours in major cities. The estimated delivery date is shown at checkout.'
    },
    {
      id: 'shipping2',
      question: 'Do you ship internationally?',
      answer: 'Currently, we only ship within India. We plan to expand our services to international locations in the near future. Please sign up for our newsletter to stay updated on our international shipping launch.'
    },
    {
      id: 'account1',
      question: 'How can I reset my password?',
      answer: 'To reset your password, go to the login screen and tap on "Forgot Password." Enter your registered email address, and we will send you a password reset link. If you don\'t receive the email, please check your spam folder or contact customer support.'
    },
    {
      id: 'product1',
      question: 'Are all products genuine and authentic?',
      answer: 'Yes, we guarantee the authenticity of all products sold on our platform. We source directly from brands or authorized distributors. In case you receive a product that you suspect is not authentic, please report it immediately, and we will investigate and provide a full refund if your claim is verified.'
    }
  ];
  
  // Support channel options
  const supportChannels: SupportChannel[] = [
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Chat with our support team (9AM - 9PM)',
      icon: 'chatbubble-ellipses-outline',
      action: () => {
        // In a real app, this would open your chat interface
        Alert.alert('Live Chat', 'Connecting to customer support...');
      }
    },
    {
      id: 'email',
      title: 'Email Support',
      description: 'support@appnetic.com',
      icon: 'mail-outline',
      action: () => {
        Linking.openURL('mailto:support@appnetic.com?subject=Support Request');
      }
    },
    {
      id: 'phone',
      title: 'Call Us',
      description: '+91 8800-123-456 (Toll Free)',
      icon: 'call-outline',
      action: () => {
        Linking.openURL('tel:+918800123456');
      }
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp Support',
      description: 'Message us on WhatsApp',
      icon: 'logo-whatsapp',
      action: () => {
        Linking.openURL('https://wa.me/918800123456');
      }
    }
  ];

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Help & Support</ThemedText>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Support Channels */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Contact Us</ThemedText>
          <View style={styles.supportChannels}>
            {supportChannels.map((channel) => (
              <TouchableOpacity 
                key={channel.id} 
                style={styles.channelCard}
                onPress={channel.action}
              >
                <Ionicons name={channel.icon} size={28} color="#007AFF" />
                <ThemedText style={styles.channelTitle}>{channel.title}</ThemedText>
                <ThemedText style={styles.channelDescription}>{channel.description}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Quick Help Buttons */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Quick Help</ThemedText>
          <View style={styles.quickHelp}>
            <TouchableOpacity style={styles.quickHelpButton} onPress={() => router.push('/orders')}>
              <Ionicons name="cube-outline" size={24} color="#007AFF" />
              <ThemedText style={styles.quickHelpText}>Track Order</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickHelpButton} onPress={() => toggleFaq('return1')}>
              <Ionicons name="refresh-outline" size={24} color="#007AFF" />
              <ThemedText style={styles.quickHelpText}>Returns</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickHelpButton} onPress={() => router.push('/shipping-addresses')}>
              <Ionicons name="location-outline" size={24} color="#007AFF" />
              <ThemedText style={styles.quickHelpText}>Addresses</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.quickHelpButton} onPress={() => toggleFaq('payment1')}>
              <Ionicons name="card-outline" size={24} color="#007AFF" />
              <ThemedText style={styles.quickHelpText}>Payments</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* FAQ Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Frequently Asked Questions</ThemedText>
          
          {faqs.map((faq) => (
            <View key={faq.id} style={styles.faqItem}>
              <TouchableOpacity 
                style={styles.faqQuestion}
                onPress={() => toggleFaq(faq.id)}
              >
                <ThemedText style={styles.questionText}>{faq.question}</ThemedText>
                <Ionicons 
                  name={expandedFaq === faq.id ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
              
              {expandedFaq === faq.id && (
                <View style={styles.faqAnswer}>
                  <ThemedText style={styles.answerText}>{faq.answer}</ThemedText>
                </View>
              )}
            </View>
          ))}
        </View>
        
        {/* Helpful Resources */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Helpful Resources</ThemedText>
          
          <TouchableOpacity style={styles.resourceItem} onPress={() => router.push('/shipping-policy')}>
            <Ionicons name="document-text-outline" size={22} color="#007AFF" />
            <ThemedText style={styles.resourceText}>Shipping Policy</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resourceItem} onPress={() => router.push('/return-policy')}>
            <Ionicons name="refresh-circle-outline" size={22} color="#007AFF" />
            <ThemedText style={styles.resourceText}>Return & Refund Policy</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resourceItem} onPress={() => router.push('/privacy-policy')}>
            <Ionicons name="shield-outline" size={22} color="#007AFF" />
            <ThemedText style={styles.resourceText}>Privacy Policy</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resourceItem} onPress={() => router.push('/terms-of-service')}>
            <Ionicons name="reader-outline" size={22} color="#007AFF" />
            <ThemedText style={styles.resourceText}>Terms of Service</ThemedText>
          </TouchableOpacity>
        </View>
        
        {/* Submit a Ticket */}
        <View style={styles.ticketSection}>
          <ThemedText style={styles.ticketText}>
            Can't find what you're looking for?
          </ThemedText>
          <Button
            title="Submit a Support Ticket"
            onPress={() => router.push('/create-ticket')}
            style={styles.ticketButton}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  supportChannels: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  channelCard: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  channelTitle: {
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  channelDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  quickHelp: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  quickHelpButton: {
    width: '23%',
    alignItems: 'center',
    padding: 10,
  },
  quickHelpText: {
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
  faqItem: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  questionText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    paddingRight: 8,
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
  },
  answerText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resourceText: {
    marginLeft: 12,
    fontSize: 14,
  },
  ticketSection: {
    alignItems: 'center',
    marginBottom: 40,
    padding: 20,
  },
  ticketText: {
    marginBottom: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  ticketButton: {
    width: '100%',
    maxWidth: 300,
  },
}); 