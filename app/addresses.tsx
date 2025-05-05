import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  Alert, 
  ActivityIndicator, 
  Animated, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAddressStore, Address } from '@/store/addressStore';
import Button from '@/components/ui/Button';
import AddressCard from '@/components/ui/ecommerce/AddressCard';
import AddressForm from '@/components/ui/ecommerce/AddressForm';
import { useAuthStore } from '@/store/authStore';
import { StatusBar } from 'expo-status-bar';

const SCREEN_WIDTH = Dimensions.get('window').width;

const AddressesScreen = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { 
    addresses, 
    loadAddresses, 
    addAddress, 
    updateAddress, 
    removeAddress, 
    setDefaultAddress,
    isLoading,
    error
  } = useAddressStore();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const formSlideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  
  // Load addresses on initial render with animation
  useEffect(() => {
    loadAddresses();
    
    // Start entrance animation
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
  
  // Animation for form transitions
  useEffect(() => {
    if (showAddForm || editingAddress) {
      Animated.timing(formSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(formSlideAnim, {
        toValue: SCREEN_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showAddForm, editingAddress]);
  
  // Handle adding new address
  const handleAddAddress = async (addressData: Omit<Address, 'id' | 'isDefault'> & { isDefault?: boolean }) => {
    try {
      await addAddress(addressData);
      setShowAddForm(false);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add address');
    }
  };
  
  // Handle updating existing address
  const handleUpdateAddress = async (addressData: Omit<Address, 'id' | 'isDefault'> & { isDefault?: boolean }) => {
    if (!editingAddress) return;
    
    try {
      await updateAddress(editingAddress.id, {
        ...addressData,
        isDefault: editingAddress.isDefault,
      });
      setEditingAddress(null);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update address');
    }
  };
  
  // Handle setting address as default
  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to set default address');
    }
  };
  
  // Handle editing an address
  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
  };
  
  // Handle deleting an address
  const handleDeleteAddress = (id: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeAddress(id);
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete address');
            }
          },
        },
      ]
    );
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
          <Ionicons name="location-outline" size={80} color="#4a6eb5" />
          <ThemedText style={styles.loginTitle}>Sign in to manage addresses</ThemedText>
          <ThemedText style={styles.loginSubtitle}>
            Save and manage your shipping addresses for faster checkout
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
  
  // Render add/edit form
  if (showAddForm || editingAddress) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButtonContainer}
            onPress={() => {
              setShowAddForm(false);
              setEditingAddress(null);
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#4a6eb5" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </ThemedText>
          <View style={{ width: 40 }} />
        </View>
        
        <Animated.View
          style={{
            transform: [{ translateX: formSlideAnim }],
            flex: 1,
          }}
        >
          <AddressForm
            initialAddress={editingAddress || undefined}
            onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
            onCancel={() => {
              setShowAddForm(false);
              setEditingAddress(null);
            }}
            isLoading={isLoading}
            submitButtonTitle={editingAddress ? 'Update Address' : 'Add Address'}
          />
        </Animated.View>
      </SafeAreaView>
    );
  }
  
  // Loading state
  if (isLoading && addresses.length === 0) {
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
          <ThemedText style={styles.headerTitle}>Addresses</ThemedText>
          <View style={{ width: 40 }} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a6eb5" />
          <ThemedText style={styles.loadingText}>Loading addresses...</ThemedText>
        </View>
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
        <ThemedText style={styles.headerTitle}>Your Addresses</ThemedText>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Address list */}
        <Animated.View 
          style={{ 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }] 
          }}
        >
          {addresses.length > 0 ? (
            <View style={styles.addressList}>
              {addresses.map((address, index) => (
                <Animated.View
                  key={address.id}
                  style={{
                    opacity: fadeAnim,
                    transform: [
                      { 
                        translateY: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [50 * (index + 1), 0]
                        }) 
                      }
                    ]
                  }}
                >
                  <AddressCard
                    address={address}
                    onSetDefault={handleSetDefault}
                    onEdit={handleEditAddress}
                    onDelete={handleDeleteAddress}
                  />
                </Animated.View>
              ))}
            </View>
          ) : (
            // Empty state
            <Animated.View 
              style={[
                styles.emptyState,
                { 
                  opacity: fadeAnim, 
                  transform: [{ translateY: slideAnim }] 
                }
              ]}
            >
              <Ionicons name="location-outline" size={80} color="#4a6eb5" />
              <ThemedText style={styles.emptyTitle}>No addresses yet</ThemedText>
              <ThemedText style={styles.emptySubtitle}>
                Add your shipping addresses for faster checkout
              </ThemedText>
            </Animated.View>
          )}
        </Animated.View>
        
        {/* Add address button */}
        <Animated.View 
          style={{ 
            opacity: fadeAnim, 
            transform: [{ translateY: slideAnim }],
            width: '100%'
          }}
        >
          {addresses.length < 3 ? (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddForm(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={20} color="#fff" />
              <ThemedText style={styles.addButtonText}>Add New Address</ThemedText>
            </TouchableOpacity>
          ) : (
            <View style={styles.maxNotice}>
              <ThemedText style={styles.maxNoticeText}>
                You've reached the maximum limit of 3 addresses. Please delete an address to add a new one.
              </ThemedText>
            </View>
          )}
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
  addressList: {
    marginBottom: 16,
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#000000',
  },
  maxNotice: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 10,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  maxNoticeText: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 20,
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

export default AddressesScreen; 