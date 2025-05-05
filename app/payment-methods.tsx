import React, { useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { StatusBar } from 'expo-status-bar';

const PaymentMethodsScreen = () => {
  const { isAuthenticated } = useAuthStore();
  
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
          <Ionicons name="card-outline" size={80} color="#4a6eb5" />
          <ThemedText style={styles.loginTitle}>Sign in to manage payment methods</ThemedText>
          <ThemedText style={styles.loginSubtitle}>
            Save and manage your payment methods for faster checkout
          </ThemedText>
          <Button
            title="Sign In"
            onPress={() => router.push('/login')}
            fullWidth
            style={styles.loginButton}
          />
          <Button
            title="Register"
            onPress={() => router.push('/register')}
            variant="outline"
            fullWidth
            style={styles.registerButton}
          />
        </Animated.View>
      </SafeAreaView>
    );
  }
  
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
        <ThemedText style={styles.headerTitle}>Payment Methods</ThemedText>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          style={[
            styles.emptyState,
            { 
              opacity: fadeAnim, 
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <Ionicons name="card-outline" size={80} color="#4a6eb5" />
          <ThemedText style={styles.emptyTitle}>No payment methods yet</ThemedText>
          <ThemedText style={styles.emptySubtitle}>
            This feature is coming soon. You'll be able to save and manage your payment methods for faster checkout.
          </ThemedText>
        </Animated.View>
        
        {/* Coming soon button */}
        <Animated.View 
          style={{ 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }],
            width: '100%',
            marginTop: 20
          }}
        >
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => Alert.alert('Coming Soon', 'Payment method management will be available in a future update.')}
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <ThemedText style={styles.addButtonText}>Add Payment Method (Coming Soon)</ThemedText>
          </TouchableOpacity>
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
    color: '#000000',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#4a6eb5',
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#4a6eb5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  addButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
    marginBottom: 12,
    backgroundColor: '#4a6eb5',
  },
  registerButton: {
    marginBottom: 16,
    borderColor: '#4a6eb5',
  }
});

export default PaymentMethodsScreen; 