import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button'
import { ThemedText } from '@/components/ThemedText'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Define menu item type with properly typed icon names
type MenuItem = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

const Profile = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuthStore()

  // Example menu items for the profile screen
  const menuItems: MenuItem[] = [
    {
      title: 'My Orders',
      icon: 'receipt-outline',
      onPress: () => router.push('/orders'),
    },
    {
      title: 'Shipping Addresses',
      icon: 'location-outline',
      onPress: () => router.push('/addresses'),
    },
    {
      title: 'Payment Methods',
      icon: 'card-outline',
      onPress: () => router.push('/payment-methods'),
    },
    {
      title: 'Settings',
      icon: 'settings-outline',
      onPress: () => router.push('/settings'),
    },
    {
      title: 'Help & Support',
      icon: 'help-circle-outline',
      onPress: () => router.push('/support'),
    },
  ]

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            const success = await logout()
            if (!success) {
              Alert.alert('Error', 'Failed to logout. Please try again.')
            }
          },
          style: 'destructive',
        },
      ]
    )
  }

  const handleLogin = () => {
    router.push('/login')
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginContainer}>
          <Ionicons name="person-circle-outline" size={100} color="#ccc" />
          <ThemedText style={styles.loginTitle}>Sign in to your account</ThemedText>
          <ThemedText style={styles.loginSubtitle}>
            Sign in to view your profile, orders, and more
          </ThemedText>
          <Button
            title="Sign In"
            onPress={handleLogin}
            fullWidth
            style={styles.loginButton}
          />
          <TouchableOpacity onPress={() => router.push('/register')}>
            <ThemedText style={styles.registerText}>Don't have an account? Register</ThemedText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with profile info */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <ThemedText style={styles.userName}>
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email}
              </ThemedText>
              <ThemedText style={styles.userEmail}>{user?.email}</ThemedText>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push('/edit-profile')}
          >
            <ThemedText style={styles.editButtonText}>Edit</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Menu items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon} size={22} color="#000" />
              </View>
              <ThemedText style={styles.menuTitle}>{item.title}</ThemedText>
              <Ionicons name="chevron-forward" size={18} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout button */}
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          isLoading={isLoading}
          style={styles.logoutButton}
        />
        <ThemedText onPress={() => {
          AsyncStorage.clear()
        }}>Clear Data</ThemedText>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  editButtonText: {
    fontSize: 14,
    color: '#000',
  },
  menuContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 20,
    marginRight: 12,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 30,
    marginBottom: 40,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  loginButton: {
    marginBottom: 20,
  },
  registerText: {
    color: '#000',
    textDecorationLine: 'underline',
    marginTop: 10,
  },
})