import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { StatusBar } from 'expo-status-bar';

interface FAQItem {
  question: string;
  answer: string;
  isExpanded: boolean;
}

const SupportScreen = () => {
  const { isAuthenticated, user } = useAuthStore();
  
  // State for FAQ items
  const [faqItems, setFaqItems] = useState<FAQItem[]>([
    {
      question: 'How do I track my order?',
      answer: 'You can track your order by going to the "Orders" section in your profile. From there, click on the order you want to track and you\'ll see its current status.',
      isExpanded: false
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept credit cards, debit cards, net banking, UPI, and cash on delivery for all orders.',
      isExpanded: false
    },
    {
      question: 'How can I return a product?',
      answer: 'To return a product, go to your Orders section, select the order containing the item you wish to return, and follow the return instructions. Returns are usually processed within 5-7 business days.',
      isExpanded: false
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Currently, we only ship within India. We are working on expanding our services internationally and will update our customers when available.',
      isExpanded: false
    },
    {
      question: 'How do I change my password?',
      answer: 'To change your password, go to the Profile section, tap on Settings, and select "Change Password". Follow the instructions to update your password.',
      isExpanded: false
    }
  ]);
  
  // State for contact form
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
  });
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  // Start entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  // Toggle FAQ item expansion
  const toggleFAQItem = (index: number) => {
    const updatedFAQItems = [...faqItems];
    updatedFAQItems[index].isExpanded = !updatedFAQItems[index].isExpanded;
    setFaqItems(updatedFAQItems);
  };
  
  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <Animated.View 
          style={[
            styles.loginContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Ionicons name="help-circle-outline" size={80} color="#4a6eb5" />
          <ThemedText style={styles.loginTitle}>Sign in for support</ThemedText>
          <ThemedText style={styles.loginSubtitle}>
            Sign in to contact our customer support team and access help resources
          </ThemedText>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/login')}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.loginButtonText}>Sign In</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => router.push('/register')}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.registerButtonText}>Register</ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }
  
  const handleSubmit = () => {
    // In a real app, you would send this data to your backend
    alert('Your message has been sent! We will get back to you soon.');
    setContactForm({
      subject: '',
      message: '',
    });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButtonContainer}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#4a6eb5" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Help & Support</ThemedText>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          style={{ 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }] 
          }}
        >
          {/* Contact options */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Contact Us</ThemedText>
            <View style={styles.contactOptions}>
              <TouchableOpacity style={styles.contactOption} onPress={() => {}}>
                <View style={styles.contactIconContainer}>
                  <Ionicons name="call-outline" size={24} color="#4a6eb5" />
                </View>
                <ThemedText style={styles.contactOptionText}>Call Us</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.contactOption} onPress={() => {}}>
                <View style={styles.contactIconContainer}>
                  <Ionicons name="chatbubble-outline" size={24} color="#4a6eb5" />
                </View>
                <ThemedText style={styles.contactOptionText}>Live Chat</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.contactOption} onPress={() => {}}>
                <View style={styles.contactIconContainer}>
                  <Ionicons name="mail-outline" size={24} color="#4a6eb5" />
                </View>
                <ThemedText style={styles.contactOptionText}>Email</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* FAQ section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Frequently Asked Questions</ThemedText>
            {faqItems.map((item, index) => (
              <View key={index} style={styles.faqItem}>
                <TouchableOpacity 
                  style={styles.faqQuestion}
                  onPress={() => toggleFAQItem(index)}
                  activeOpacity={0.7}
                >
                  <ThemedText style={styles.faqQuestionText}>{item.question}</ThemedText>
                  <Ionicons 
                    name={item.isExpanded ? "chevron-up" : "chevron-down"} 
                    size={18} 
                    color="#4a6eb5" 
                  />
                </TouchableOpacity>
                {item.isExpanded && (
                  <View style={styles.faqAnswer}>
                    <ThemedText style={styles.faqAnswerText}>{item.answer}</ThemedText>
                  </View>
                )}
              </View>
            ))}
          </View>
          
          {/* Contact form */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Send Us a Message</ThemedText>
            <View style={styles.formField}>
              <ThemedText style={styles.formLabel}>Subject</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="What is your inquiry about?"
                placeholderTextColor="#8e8e8e"
                value={contactForm.subject}
                onChangeText={(text) => setContactForm(prev => ({...prev, subject: text}))}
              />
            </View>
            <View style={styles.formField}>
              <ThemedText style={styles.formLabel}>Message</ThemedText>
              <TextInput
                style={styles.textArea}
                placeholder="Describe your issue or question in detail"
                placeholderTextColor="#8e8e8e"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                value={contactForm.message}
                onChangeText={(text) => setContactForm(prev => ({...prev, message: text}))}
              />
            </View>
            <Button
              title="Submit"
              onPress={handleSubmit}
              fullWidth
              style={styles.submitButton}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  backButtonContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000',
  },
  contactOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactOption: {
    alignItems: 'center',
    width: '30%',
  },
  contactIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f4f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
    marginBottom: 12,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  faqQuestionText: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    paddingRight: 10,
    color: '#000000',
  },
  faqAnswer: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  faqAnswerText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#000000',
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#000000',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    color: '#000000',
  },
  textArea: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 120,
    color: '#000000',
  },
  submitButton: {
    marginTop: 8,
  },
  loginContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
    color: '#000000',
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: '#4a6eb5',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4a6eb5',
    width: '100%',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SupportScreen; 