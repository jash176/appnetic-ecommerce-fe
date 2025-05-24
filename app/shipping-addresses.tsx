import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import AddressForm, { AddressFormData } from '@/components/ui/AddressForm';
import payloadClient from '@/lib/api/payloadClient';
import { getStoreId } from '@/service/storeService';
import { formatCreatePayload } from '@/lib/api/utils';
import CommonHeader from '@/components/ui/CommonHeader';

interface Address extends AddressFormData {
  id?: string;
  type: 'shipping' | 'billing' | 'both';
  isDefault?: boolean;
}

export default function ShippingAddressesScreen() {
  const { top } = useSafeAreaInsets();
  const { user, isAuthenticated } = useAuthStore();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state for new/edited address
  const [formData, setFormData] = useState<Address>({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
    type: 'shipping',
    isDefault: false
  });
  
  // Fetch customer data including addresses
  useEffect(() => {
    if (isAuthenticated) {
      fetchCustomerData();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);
  
  const fetchCustomerData = async () => {
    try {
      setIsLoading(true);
      
      // Debug info about the current user
      console.log('Current user data:', user);
      
      // Find customer by email
      const response = await payloadClient.collections.customers.find({
        where: {
          email: {
            equals: user?.email || ''
          },
          store: {
            equals: getStoreId()
          }
        }
      });
      
      // Log response for debugging
      console.log('Customer find response:', response);
      
      if (response.docs.length > 0) {
        const customerData = response.docs[0];
        if (customerData.addresses && Array.isArray(customerData.addresses)) {
          // Convert the addresses to the correct type
          const typedAddresses: Address[] = customerData.addresses.map(addr => ({
            id: addr.id || undefined,
            type: addr.type,
            isDefault: addr.isDefault || false,
            name: addr.name,
            line1: addr.line1,
            line2: addr.line2 || undefined,
            city: addr.city,
            state: addr.state,
            postalCode: addr.postalCode,
            country: addr.country,
            phone: addr.phone || undefined
          }));
          setAddresses(typedAddresses);
        } else {
          setAddresses([]);
        }
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
      Alert.alert('Error', 'Failed to load your saved addresses.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field.replace('address.', '')]: value
    }));
  };
  
  const handleAddNewAddress = () => {
    setFormData({
      name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      phone: '',
      type: 'shipping',
      isDefault: addresses.length === 0 // Make default if first address
    });
    setIsAddingNew(true);
    setIsEditing(null);
  };
  
  const handleEditAddress = (addressId: string) => {
    const addressToEdit = addresses.find(addr => addr.id === addressId);
    if (addressToEdit) {
      setFormData(addressToEdit);
      setIsEditing(addressId);
      setIsAddingNew(false);
    }
  };
  
  const handleDeleteAddress = async (addressId: string) => {
    try {
      Alert.alert(
        'Delete Address',
        'Are you sure you want to delete this address?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: async () => {
              setIsLoading(true);
              
              // Find customer first
              const customerResponse = await payloadClient.collections.customers.find({
                where: {
                  email: {
                    equals: user?.email || ''
                  },
                  store: {
                    equals: getStoreId()
                  }
                }
              });
              
              if (customerResponse.docs.length > 0) {
                const customerId = customerResponse.docs[0].id;
                const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
                
                // Ensure at least one address is default if available
                if (updatedAddresses.length > 0 && !updatedAddresses.some(addr => addr.isDefault)) {
                  updatedAddresses[0].isDefault = true;
                }
                
                // Update customer with new addresses
                await payloadClient.collections.customers.update({
                  where: {
                    id: {
                      equals: customerId
                    }
                  },
                  patch: {
                    addresses: updatedAddresses
                  }
                });
                
                // Refresh the address list
                await fetchCustomerData();
                
                Alert.alert('Success', 'Address deleted successfully');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error deleting address:', error);
      Alert.alert('Error', 'Failed to delete the address.');
      setIsLoading(false);
    }
  };
  
  const handleSetDefault = async (addressId: string) => {
    try {
      setIsLoading(true);
      
      // Find customer first
      const customerResponse = await payloadClient.collections.customers.find({
        where: {
          email: {
            equals: user?.email || ''
          },
          store: {
            equals: getStoreId()
          }
        }
      });
      
      if (customerResponse.docs.length > 0) {
        const customerId = customerResponse.docs[0].id;
        const updatedAddresses = addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === addressId
        }));
        
        // Update customer with new addresses
        await payloadClient.collections.customers.update({
          where: {
            id: {
              equals: customerId
            }
          },
          patch: {
            addresses: updatedAddresses
          }
        });
        
        // Refresh the address list
        await fetchCustomerData();
      }
    } catch (error) {
      console.error('Error setting default address:', error);
      Alert.alert('Error', 'Failed to set default address.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name || !formData.line1 || !formData.city || !formData.state || !formData.postalCode) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Debug info about the current user
      console.log('Current user email:', user?.email);
      
      // Validate that we have a valid email for the user
      if (!user?.email) {
        Alert.alert('Account Error', 'Your account does not have an email address. Please update your profile first.');
        setIsSubmitting(false);
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user.email)) {
        Alert.alert('Account Error', 'Your account email address is not valid. Please update your profile with a valid email.');
        setIsSubmitting(false);
        return;
      }
      
      // Find customer by email
      const customerResponse = await payloadClient.collections.customers.find({
        where: {
          email: {
            equals: user.email
          },
          store: {
            equals: getStoreId()
          }
        }
      });
      
      let customerId;
      let existingAddresses: Address[] = [];
      
      if (customerResponse.docs.length > 0) {
        // Existing customer
        customerId = customerResponse.docs[0].id;
        if (customerResponse.docs[0].addresses && Array.isArray(customerResponse.docs[0].addresses)) {
          // Convert the addresses to the correct type
          existingAddresses = customerResponse.docs[0].addresses.map(addr => ({
            id: addr.id || undefined,
            type: addr.type,
            isDefault: addr.isDefault || false,
            name: addr.name,
            line1: addr.line1,
            line2: addr.line2 || undefined,
            city: addr.city,
            state: addr.state,
            postalCode: addr.postalCode,
            country: addr.country,
            phone: addr.phone || undefined
          }));
        }
      } else {
        // Create new customer
        // Ensure we have a valid name
        const customerName = user?.firstName && user?.lastName 
          ? `${user.firstName} ${user.lastName}` 
          : user?.firstName || user?.email?.split('@')[0] || 'Customer';
        
        const customerData = {
          email: user.email,
          name: customerName,
          phone: '',
          addresses: [],
          store: getStoreId()
        };
        
        // Log the data being sent
        console.log('Creating new customer with data:', customerData);
        
        try {
          const newCustomerResponse = await payloadClient.collections.customers.create(
            formatCreatePayload(customerData)
          );
          
          console.log('Customer creation response:', newCustomerResponse);
          
          customerId = newCustomerResponse.doc.id;
        } catch (createError) {
          console.error('Customer creation error:', createError);
          Alert.alert('Error', 'Could not create customer profile. Please try again later or contact support.');
          setIsSubmitting(false);
          return;
        }
      }
      
      let updatedAddresses = [...existingAddresses];
      
      if (isEditing) {
        // Update existing address
        updatedAddresses = updatedAddresses.map(addr => 
          addr.id === isEditing ? { ...formData } : addr
        );
      } else {
        // Add new address
        // If setting as default, remove default from others
        if (formData.isDefault) {
          updatedAddresses = updatedAddresses.map(addr => ({
            ...addr,
            isDefault: false
          }));
        }
        
        // Add the new address with a unique ID
        updatedAddresses.push({
          ...formData,
          id: `addr_${Date.now()}`
        });
      }
      
      // Ensure at least one address is default
      if (updatedAddresses.length > 0 && !updatedAddresses.some(addr => addr.isDefault)) {
        updatedAddresses[0].isDefault = true;
      }
      
      // Update customer with new addresses
      try {
        await payloadClient.collections.customers.update({
          where: {
            id: {
              equals: customerId
            }
          },
          patch: {
            addresses: updatedAddresses
          }
        });
        
        // Reset form and state
        setIsAddingNew(false);
        setIsEditing(null);
        
        // Refresh the address list
        await fetchCustomerData();
        
        Alert.alert('Success', isEditing ? 'Address updated successfully' : 'Address added successfully');
      } catch (updateError) {
        console.error('Customer update error:', updateError);
        Alert.alert('Error', 'Failed to save the address. Please try again.');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      Alert.alert('Error', 'Failed to save the address.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    setIsAddingNew(false);
    setIsEditing(null);
  };
  
  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { paddingTop: top }]}>
        <CommonHeader title='Shipping Addresses' showBack onBackPress={() =>router.back()}/>
        <View style={styles.centerContainer}>
          <ThemedText style={styles.messageText}>Please log in to manage your addresses</ThemedText>
          <Button
            title="Go to Login"
            onPress={() => router.push('/login')}
            style={styles.loginButton}
          />
        </View>
      </View>
    );
  }
  
  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Shipping Addresses</ThemedText>
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Shipping Addresses</ThemedText>
      </View>
      
      <ScrollView style={styles.content}>
        {(isAddingNew || isEditing) ? (
          <View style={styles.formContainer}>
            <ThemedText style={styles.formTitle}>
              {isEditing ? 'Edit Address' : 'Add New Address'}
            </ThemedText>
            
            <AddressForm prefix="address" address={formData} onChange={handleChange} />
            
            <View style={styles.defaultContainer}>
              <ThemedText>Use as default address</ThemedText>
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => setFormData(prev => ({ ...prev, isDefault: !prev.isDefault }))}
              >
                {formData.isDefault ? (
                  <Ionicons name="checkbox" size={24} color="#000" />
                ) : (
                  <Ionicons name="square-outline" size={24} color="#000" />
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.buttonContainer}>
              <Button
                title="Cancel"
                onPress={handleCancel}
                style={styles.secondaryButton}
                textStyle={styles.secondaryButtonText}
              />
              <Button
                title={isEditing ? 'Update' : 'Save'}
                onPress={handleSubmit}
                style={styles.primaryButton}
                disabled={isSubmitting}
                loading={isSubmitting}
              />
            </View>
          </View>
        ) : (
          <>
            {addresses.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="location-outline" size={64} color="#aaa" />
                <ThemedText style={styles.emptyText}>No saved addresses yet</ThemedText>
                <Button
                  title="Add New Address"
                  onPress={handleAddNewAddress}
                  style={styles.addButton}
                />
              </View>
            ) : (
              <>
                {addresses.map((address) => (
                  <View key={address.id} style={styles.addressCard}>
                    {address.isDefault && (
                      <View style={styles.defaultBadge}>
                        <ThemedText style={styles.defaultBadgeText}>Default</ThemedText>
                      </View>
                    )}
                    <ThemedText style={styles.addressName}>{address.name}</ThemedText>
                    <ThemedText style={styles.addressLine}>{address.line1}</ThemedText>
                    {address.line2 && <ThemedText style={styles.addressLine}>{address.line2}</ThemedText>}
                    <ThemedText style={styles.addressLine}>
                      {address.city}, {address.state} {address.postalCode}
                    </ThemedText>
                    <ThemedText style={styles.addressLine}>{address.country}</ThemedText>
                    {address.phone && <ThemedText style={styles.addressLine}>Phone: {address.phone}</ThemedText>}
                    
                    <View style={styles.addressActions}>
                      {!address.isDefault && (
                        <TouchableOpacity 
                          style={styles.addressAction}
                          onPress={() => handleSetDefault(address.id!)}
                        >
                          <Ionicons name="star-outline" size={18} color="#000" />
                          <ThemedText style={styles.actionText}>Set Default</ThemedText>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity 
                        style={styles.addressAction}
                        onPress={() => handleEditAddress(address.id!)}
                      >
                        <Ionicons name="create-outline" size={18} color="#000" />
                        <ThemedText style={styles.actionText}>Edit</ThemedText>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.addressAction}
                        onPress={() => handleDeleteAddress(address.id!)}
                      >
                        <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                        <ThemedText style={[styles.actionText, styles.deleteText]}>Delete</ThemedText>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                
                <Button
                  title="Add New Address"
                  onPress={handleAddNewAddress}
                  style={styles.addButton}
                />
              </>
            )}
          </>
        )}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  loginButton: {
    width: '80%',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  addButton: {
    marginTop: 16,
    marginBottom: 24,
  },
  addressCard: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  defaultBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  defaultBadgeText: {
    color: '#fff',
    fontSize: 12,
  },
  addressName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addressLine: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  addressActions: {
    flexDirection: 'row',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  addressAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 4,
  },
  deleteText: {
    color: '#FF3B30',
  },
  formContainer: {
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  defaultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 8,
  },
  checkbox: {
    padding: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryButton: {
    flex: 1,
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#f2f2f2',
  },
  secondaryButtonText: {
    color: '#000',
  },
}); 