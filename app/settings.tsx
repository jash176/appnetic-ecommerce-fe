import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import { useColorScheme } from '@/hooks/useColorScheme';
import CommonHeader from '@/components/ui/CommonHeader';
import payloadClient, { createAuthenticatedClient } from '@/lib/api/payloadClient';

// Setting types
interface NotificationSettings {
  orderUpdates: boolean;
  promotions: boolean;
  productUpdates: boolean;
  priceDrop: boolean;
  backInStock: boolean;
}

interface AppSettings {
  language: string;
  currency: string;
  darkMode: boolean;
  biometricLogin: boolean;
}

interface PrivacySettings {
  savePaymentInfo: boolean;
  trackingConsent: boolean;
  sharingConsent: boolean;
}

export default function SettingsScreen() {
  const { top } = useSafeAreaInsets();
  const { isAuthenticated, logout, token, user } = useAuthStore();
  const colorScheme = useColorScheme();
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Settings states
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    orderUpdates: true,
    promotions: false,
    productUpdates: false,
    priceDrop: true,
    backInStock: false
  });
  
  const [appSettings, setAppSettings] = useState<AppSettings>({
    language: 'English',
    currency: 'INR',
    darkMode: colorScheme === 'dark',
    biometricLogin: false
  });
  
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    savePaymentInfo: true,
    trackingConsent: true,
    sharingConsent: false
  });
  
  const appVersion = Application.nativeApplicationVersion || '1.0.0';
  const buildVersion = Application.nativeBuildVersion || '1';
  
  // Custom back handler to ensure proper navigation
  const handleBackPress = () => {
    // Navigate to the profile tab since settings is typically accessed from there
    router.back()
  };
  
  // Load saved settings from AsyncStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        
        // Load notification settings
        const savedNotificationSettings = await AsyncStorage.getItem('notificationSettings');
        if (savedNotificationSettings) {
          setNotificationSettings(JSON.parse(savedNotificationSettings));
        }
        
        // Load app settings
        const savedAppSettings = await AsyncStorage.getItem('appSettings');
        if (savedAppSettings) {
          setAppSettings(JSON.parse(savedAppSettings));
        }
        
        // Load privacy settings
        const savedPrivacySettings = await AsyncStorage.getItem('privacySettings');
        if (savedPrivacySettings) {
          setPrivacySettings(JSON.parse(savedPrivacySettings));
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);
  
  // Save settings
  const saveSettings = async (
    settingType: 'notification' | 'app' | 'privacy',
    key: string,
    value: any
  ) => {
    try {
      let updatedSettings;
      
      switch (settingType) {
        case 'notification':
          updatedSettings = {
            ...notificationSettings,
            [key]: value
          };
          setNotificationSettings(updatedSettings);
          await AsyncStorage.setItem('notificationSettings', JSON.stringify(updatedSettings));
          break;
          
        case 'app':
          updatedSettings = {
            ...appSettings,
            [key]: value
          };
          setAppSettings(updatedSettings);
          await AsyncStorage.setItem('appSettings', JSON.stringify(updatedSettings));
          break;
          
        case 'privacy':
          updatedSettings = {
            ...privacySettings,
            [key]: value
          };
          setPrivacySettings(updatedSettings);
          await AsyncStorage.setItem('privacySettings', JSON.stringify(updatedSettings));
          break;
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings.');
    }
  };

  const deleteAccount = async () => {
    try {
      const client = token ? createAuthenticatedClient(token) : payloadClient;
      if(user) {
        await client.collections.users.deleteById({id: user.id});
        await logout();
        await AsyncStorage.clear();
        Alert.alert('Success', 'Your account has been deleted successfully.');
      }
    }catch(error) {
      Alert.alert('Error', 'Failed to delete account.');
    }
  }
  
  // Clear all app data
  const handleClearAppData = () => {
    Alert.alert(
      'Delete account?',
      'This will clear all app data including your account information, preferences, and saved items. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              deleteAccount()
            } catch (error) {
              console.error('Error clearing app data:', error);
              Alert.alert('Error', 'Failed to clear app data.');
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };
  
  // Render loading screen
  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: top }]}>
         <CommonHeader title='Settings' showBack onBackPress={() =>router.back()}/>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </View>
    );
  }
  
  // Render settings screen
  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Settings</ThemedText>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Notification Settings */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          
          <View style={styles.settingItem}>
            <ThemedText>Notifications</ThemedText>
            <Switch
              value={notificationSettings.promotions}
              onValueChange={(value) => saveSettings('notification', 'promotions', value)}
            />
          </View>
           {isAuthenticated ? (
            <>
              <TouchableOpacity style={styles.linkItem} onPress={() => router.push('/edit-profile')}>
                <ThemedText>Edit Profile</ThemedText>
                <Ionicons name="chevron-forward" size={18} color="#999" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.linkItem} onPress={() => router.push('/change-password')}>
                <ThemedText>Change Password</ThemedText>
                <Ionicons name="chevron-forward" size={18} color="#999" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.linkItem} onPress={() => router.push('/login')}>
              <ThemedText>Sign In</ThemedText>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>
          )}
              <TouchableOpacity 
            style={[styles.linkItem, styles.dangerItem]} 
            onPress={handleClearAppData}
          >
            <ThemedText style={styles.dangerText}>Delete account</ThemedText>
            <Ionicons name="trash-outline" size={18} color="#FF3B30" />
          </TouchableOpacity>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    marginRight: 8,
    color: '#666',
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: '#FF3B30',
  },
  versionInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  versionText: {
    color: '#999',
    fontSize: 12,
  },
}); 