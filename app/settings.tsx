import React, { useRef, useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Animated
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { StatusBar } from 'expo-status-bar';

const SettingsScreen = () => {
  const { isAuthenticated } = useAuthStore();
  
  // State for settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [language, setLanguage] = useState('English');
  
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
          <Ionicons name="settings-outline" size={80} color="#4a6eb5" />
          <ThemedText style={styles.loginTitle}>Sign in to access settings</ThemedText>
          <ThemedText style={styles.loginSubtitle}>
            Sign in to customize your app experience
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
  
  const renderSettingItem = (
    title: string, 
    icon: keyof typeof Ionicons.glyphMap, 
    value: boolean | string, 
    onToggle?: () => void,
    onPress?: () => void
  ) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingIconContainer}>
        <Ionicons name={icon} size={22} color="#4a6eb5" />
      </View>
      <ThemedText style={styles.settingTitle}>{title}</ThemedText>
      {typeof value === 'boolean' ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#d9d9d9', true: '#a9c3f5' }}
          thumbColor={value ? '#4a6eb5' : '#f4f3f4'}
        />
      ) : (
        <View style={styles.settingValueContainer}>
          <ThemedText style={styles.settingValue}>{value}</ThemedText>
          <Ionicons name="chevron-forward" size={18} color="#ccc" />
        </View>
      )}
    </TouchableOpacity>
  );
  
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
        <ThemedText style={styles.headerTitle}>Settings</ThemedText>
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
          <View style={styles.settingsSection}>
            <ThemedText style={styles.sectionTitle}>Appearance</ThemedText>
            {renderSettingItem(
              'Dark Mode', 
              'moon-outline', 
              darkModeEnabled, 
              () => setDarkModeEnabled(prev => !prev)
            )}
          </View>
          
          <View style={styles.settingsSection}>
            <ThemedText style={styles.sectionTitle}>Notifications</ThemedText>
            {renderSettingItem(
              'Push Notifications', 
              'notifications-outline', 
              notificationsEnabled, 
              () => setNotificationsEnabled(prev => !prev)
            )}
            {renderSettingItem(
              'Email Notifications', 
              'mail-outline', 
              true, 
              () => {}
            )}
          </View>
          
          <View style={styles.settingsSection}>
            <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>
            {renderSettingItem(
              'Language', 
              'language-outline', 
              language, 
              undefined,
              () => {}
            )}
            {renderSettingItem(
              'Currency', 
              'cash-outline', 
              'INR ₹', 
              undefined,
              () => {}
            )}
          </View>
          
          <View style={styles.settingsSection}>
            <ThemedText style={styles.sectionTitle}>About</ThemedText>
            {renderSettingItem(
              'App Version', 
              'information-circle-outline', 
              '1.0.0'
            )}
            {renderSettingItem(
              'Privacy Policy', 
              'shield-outline', 
              '',
              undefined,
              () => {}
            )}
            {renderSettingItem(
              'Terms of Service', 
              'document-text-outline', 
              '',
              undefined,
              () => {}
            )}
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
  settingsSection: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f4f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTitle: {
    flex: 1,
    fontSize: 15,
    color: '#000000',
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: '#000000',
    marginRight: 8,
  },
});

export default SettingsScreen; 