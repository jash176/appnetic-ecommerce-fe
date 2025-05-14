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
  const { isAuthenticated, logout } = useAuthStore();
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
  
  // Clear all app data
  const handleClearAppData = () => {
    Alert.alert(
      'Clear App Data',
      'Are you sure you want to clear all app data? This will sign you out and reset all settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await AsyncStorage.clear();
              // Force logout
              await logout();
              Alert.alert('Success', 'All app data has been cleared.');
              router.replace('/');
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
  
  // Language selector
  const handleLanguageSelect = () => {
    Alert.alert(
      'Select Language',
      'Choose your preferred language',
      [
        { text: 'English', onPress: () => saveSettings('app', 'language', 'English') },
        { text: 'Hindi', onPress: () => saveSettings('app', 'language', 'Hindi') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };
  
  // Currency selector
  const handleCurrencySelect = () => {
    Alert.alert(
      'Select Currency',
      'Choose your preferred currency',
      [
        { text: 'Indian Rupee (₹)', onPress: () => saveSettings('app', 'currency', 'INR') },
        { text: 'US Dollar ($)', onPress: () => saveSettings('app', 'currency', 'USD') },
        { text: 'Euro (€)', onPress: () => saveSettings('app', 'currency', 'EUR') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };
  
  // Render loading screen
  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Settings</ThemedText>
        </View>
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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>Settings</ThemedText>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Notification Settings */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Notifications</ThemedText>
          
          <View style={styles.settingItem}>
            <ThemedText>Promotions and Offers</ThemedText>
            <Switch
              value={notificationSettings.promotions}
              onValueChange={(value) => saveSettings('notification', 'promotions', value)}
            />
          </View>
          
          <View style={styles.settingItem}>
            <ThemedText>Price Drop Alerts</ThemedText>
            <Switch
              value={notificationSettings.priceDrop}
              onValueChange={(value) => saveSettings('notification', 'priceDrop', value)}
            />
          </View>
          
          <View style={styles.settingItem}>
            <ThemedText>Back in Stock Alerts</ThemedText>
            <Switch
              value={notificationSettings.backInStock}
              onValueChange={(value) => saveSettings('notification', 'backInStock', value)}
            />
          </View>
        </View>
        
        {/* App Settings */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>App Preferences</ThemedText>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleLanguageSelect}>
            <ThemedText>Language</ThemedText>
            <View style={styles.settingValue}>
              <ThemedText style={styles.settingValueText}>{appSettings.language}</ThemedText>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem} onPress={handleCurrencySelect}>
            <ThemedText>Currency</ThemedText>
            <View style={styles.settingValue}>
              <ThemedText style={styles.settingValueText}>{appSettings.currency}</ThemedText>
              <Ionicons name="chevron-forward" size={18} color="#999" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.settingItem}>
            <ThemedText>Dark Mode</ThemedText>
            <Switch
              value={appSettings.darkMode}
              onValueChange={(value) => saveSettings('app', 'darkMode', value)}
            />
          </View>
        </View>
        
        {/* Account Actions */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Account</ThemedText>
          
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
            <ThemedText style={styles.dangerText}>Clear App Data</ThemedText>
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