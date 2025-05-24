import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import FormField from '@/components/ui/FormField';
import { createAuthenticatedClient } from '@/lib/api/payloadClient';
import CommonHeader from '@/components/ui/CommonHeader';

// Extended User interface to match what's expected from the API
interface ExtendedUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | '';
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | '';
}

export default function EditProfileScreen() {
  const { top } = useSafeAreaInsets();
  const { user, token, checkAuthState } = useAuthStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: ''
  });
  
  // Load user data
  useEffect(() => {
    if (user) {
      // Cast user to ExtendedUser to access the fields we need
      const extendedUser = user as unknown as ExtendedUser;
      
      setFormData({
        firstName: extendedUser.firstName || '',
        lastName: extendedUser.lastName || '',
        email: extendedUser.email || '',
        phone: extendedUser.phone || '',
        dateOfBirth: extendedUser.dateOfBirth || '',
        gender: extendedUser.gender || ''
      });
    }
  }, [user]);
  
  // Handle form changes
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle navigation back to profile
  const navigateToProfile = () => {
    router.navigate('/(tabs)/profile');
  };
  
  // Save profile changes
  const handleSave = async () => {
    if (!user || !token) {
      Alert.alert('Error', 'You must be logged in to update your profile.');
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (formData.email && !emailRegex.test(formData.email)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        setIsSaving(false);
        return;
      }
      
      // Validate phone number (allow different formats)
      if (formData.phone && !/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
        Alert.alert('Invalid Phone', 'Please enter a valid phone number.');
        setIsSaving(false);
        return;
      }
      
      // Validate date format if provided (YYYY-MM-DD)
      if (formData.dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(formData.dateOfBirth)) {
        Alert.alert('Invalid Date Format', 'Please enter date in YYYY-MM-DD format.');
        setIsSaving(false);
        return;
      }
      
      // Create authenticated client
      const client = createAuthenticatedClient(token);
      
      // Cast user.id to number if needed
      const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
      
      // Update user data
      await client.collections.users.update({
        where: {
          id: {
            equals: userId
          }
        },
        patch: {
          // Use fields that match the API schema
          firstName: formData.firstName || undefined,
          lastName: formData.lastName || undefined,
          phone: formData.phone || undefined,
          // Only include if the API supports these fields
          ...(formData.dateOfBirth ? { dateOfBirth: formData.dateOfBirth } : {}),
          ...(formData.gender ? { gender: formData.gender as any } : {})
        } as any // Use type assertion to bypass TypeScript check
      });
      
      // Refresh auth state to get updated user data
      await checkAuthState();
      
      Alert.alert('Success', 'Profile updated successfully!');
      navigateToProfile();
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const errorMessage = error?.data?.errors?.message || error?.message || 'Failed to update profile';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Render loading screen
  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: top }]}>
         <CommonHeader title='Settings' showBack onBackPress={navigateToProfile}/>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: top }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
       <CommonHeader title='Settings' showBack onBackPress={navigateToProfile}/>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Form Fields */}
        <View style={styles.formSection}>
          <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>
          
          <FormField
            label="First Name"
            value={formData.firstName}
            onChange={(value) => handleChange('firstName', value)}
            placeholder="Your first name"
            autoCapitalize="words"
          />
          
          <FormField
            label="Last Name"
            value={formData.lastName}
            onChange={(value) => handleChange('lastName', value)}
            placeholder="Your last name"
            autoCapitalize="words"
          />
          
          <FormField
            label="Email"
            value={formData.email}
            onChange={(value) => handleChange('email', value)}
            placeholder="Your email address"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <FormField
            label="Phone Number"
            value={formData.phone}
            onChange={(value) => handleChange('phone', value)}
            placeholder="Your phone number"
            keyboardType="phone-pad"
          />
          
          <FormField
            label="Date of Birth (YYYY-MM-DD)"
            value={formData.dateOfBirth || ''}
            onChange={(value) => handleChange('dateOfBirth', value)}
            placeholder="YYYY-MM-DD"
          />
          
          <View style={styles.genderContainer}>
            <ThemedText style={styles.label}>Gender</ThemedText>
            <View style={styles.genderOptions}>
              <TouchableOpacity 
                style={[
                  styles.genderOption, 
                  formData.gender === 'male' && styles.selectedGender
                ]}
                onPress={() => handleChange('gender', 'male')}
              >
                <ThemedText style={[
                  styles.genderText,
                  formData.gender === 'male' && styles.selectedGenderText
                ]}>Male</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.genderOption, 
                  formData.gender === 'female' && styles.selectedGender
                ]}
                onPress={() => handleChange('gender', 'female')}
              >
                <ThemedText style={[
                  styles.genderText,
                  formData.gender === 'female' && styles.selectedGenderText
                ]}>Female</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.genderOption, 
                  formData.gender === 'other' && styles.selectedGender
                ]}
                onPress={() => handleChange('gender', 'other')}
              >
                <ThemedText style={[
                  styles.genderText,
                  formData.gender === 'other' && styles.selectedGenderText
                ]}>Other</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        {/* Save Button */}
        <Button
          title="Save Changes"
          onPress={handleSave}
          style={styles.saveButton}
          disabled={isSaving}
          loading={isSaving}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
    flex: 1,
  },
  spacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
  },
  genderContainer: {
    marginBottom: 16,
  },
  genderOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderOption: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedGender: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  genderText: {
    color: '#000',
  },
  selectedGenderText: {
    color: '#fff',
  },
  saveButton: {
    marginTop: 8,
  },
  changePasswordButton: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
  },
  changePasswordText: {
    color: '#007AFF',
    fontSize: 16,
  },
}); 