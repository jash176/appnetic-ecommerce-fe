import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import FormField from '@/components/ui/FormField';
import { createAuthenticatedClient } from '@/lib/api/payloadClient';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePasswordScreen() {
  const { top } = useSafeAreaInsets();
  const { user, token, checkAuthState } = useAuthStore();
  
  const [isSaving, setIsSaving] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Handle navigation back to profile
  const navigateToProfile = () => {
    router.back();
  };
  
  // Handle form changes
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Save new password
  const handleSave = async () => {
    if (!user || !token) {
      Alert.alert('Error', 'You must be logged in to change your password.');
      return;
    }
    
    try {
      // Validate inputs
      if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
        Alert.alert('Missing Information', 'Please fill in all password fields.');
        return;
      }
      
      // Check if passwords match
      if (formData.newPassword !== formData.confirmPassword) {
        Alert.alert('Password Mismatch', 'New password and confirmation do not match.');
        return;
      }
      
      // Validate password strength
      if (formData.newPassword.length < 8) {
        Alert.alert('Weak Password', 'Password must be at least 8 characters long.');
        return;
      }
      
      setIsSaving(true);
      
      // Create authenticated client
      const client = createAuthenticatedClient(token);
      
      // Cast user.id to number if needed
      const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
      
      // Send API request to change password
      try {
        // Use the standard update method with password fields
        await client.collections.users.update({
          where: {
            id: {
              equals: userId
            }
          },
          patch: {
            password: formData.newPassword
          } as any // Use type assertion for the password field
        });
        
        Alert.alert(
          'Success', 
          'Password changed successfully!',
          [{ text: 'OK', onPress: () => navigateToProfile() }]
        );
      } catch (apiError: any) {
        // Handle specific API errors
        const errorMessage = apiError?.data?.errors?.message || 'Server error or incorrect credentials.';
        Alert.alert('Error', errorMessage);
      }
      
    } catch (error: any) {
      console.error('Error changing password:', error);
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <KeyboardAvoidingView 
      style={[styles.container, { paddingTop: top }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={navigateToProfile}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Change Password</ThemedText>
        <View style={styles.spacer} />
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.formSection}>
          <ThemedText style={styles.sectionDescription}>
            Enter your current password and choose a new strong password to update your account security.
          </ThemedText>
          
          <FormField
            label="Current Password"
            value={formData.currentPassword}
            onChange={(value) => handleChange('currentPassword', value)}
            placeholder="Enter your current password"
            secureTextEntry
          />
          
          <FormField
            label="New Password"
            value={formData.newPassword}
            onChange={(value) => handleChange('newPassword', value)}
            placeholder="Enter your new password"
            secureTextEntry
          />
          
          <FormField
            label="Confirm New Password"
            value={formData.confirmPassword}
            onChange={(value) => handleChange('confirmPassword', value)}
            placeholder="Confirm your new password"
            secureTextEntry
          />
          
          <View style={styles.passwordTips}>
            <ThemedText style={styles.tipHeader}>Password Tips:</ThemedText>
            <ThemedText style={styles.tip}>• Use at least 8 characters</ThemedText>
            <ThemedText style={styles.tip}>• Include uppercase and lowercase letters</ThemedText>
            <ThemedText style={styles.tip}>• Add numbers and special characters</ThemedText>
            <ThemedText style={styles.tip}>• Don't reuse passwords from other sites</ThemedText>
          </View>
        </View>
        
        {/* Save Button */}
        <Button
          title="Update Password"
          onPress={handleSave}
          style={styles.saveButton}
          disabled={isSaving}
          loading={isSaving}
        />
        
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={navigateToProfile}
        >
          <ThemedText style={styles.cancelText}>Cancel</ThemedText>
        </TouchableOpacity>
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
  formSection: {
    marginBottom: 24,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  passwordTips: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
  },
  tipHeader: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tip: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  saveButton: {
    marginTop: 8,
  },
  cancelButton: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
  },
}); 