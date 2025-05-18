import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button'
import { ThemedText } from '@/components/ThemedText'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

type MenuItem = {
  title: string
  icon: keyof typeof Ionicons.glyphMap
  onPress: () => void
}

const Profile = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuthStore()

  const menuItems: MenuItem[] = [
    {
      title: 'My Orders',
      icon: 'receipt-outline',
      onPress: () => router.push('/orders'),
    },
    {
      title: 'Shipping Addresses',
      icon: 'location-outline',
      onPress: () => router.push('/shipping-addresses'),
    },
    {
      title: 'Settings',
      icon: 'settings-outline',
      onPress: () => router.push('/settings'),
    },
    {
      title: 'FAQs',
      icon: 'help-circle-outline',
      onPress: () => router.push('/support'),
    },
  ]

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          const success = await logout()
          if (!success) Alert.alert('Error', 'Failed to logout. Please try again.')
        },
        style: 'destructive',
      },
    ])
  }

  const handleLogin = () => router.push('/login')

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginContainer}>
          <Ionicons name="person-circle-outline" size={100} color="#ccc" />
          <ThemedText style={styles.loginTitle}>Welcome!</ThemedText>
          <ThemedText style={styles.loginSubtitle}>
            Sign in to access your orders, addresses, and more.
          </ThemedText>
          <Button title="Sign In" onPress={handleLogin} fullWidth style={styles.loginButton} />
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
        {/* Profile Header */}
        <View style={styles.card}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={{ marginLeft: 14 }}>
              <Text style={styles.name}>
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.email}
              </Text>
              <Text style={styles.email}>{user?.email}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('/edit-profile')}
          >
            <Ionicons name="create-outline" size={18} color="#000" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Menu */}
        <View style={styles.menuWrapper}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={item.onPress}
            >
              <View style={styles.menuIconWrapper}>
                <Ionicons name={item.icon} size={22} color="#333" />
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={18} color="#aaa" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          loading={isLoading}
          style={styles.logoutBtn}
        />

        {/* Clear Cache */}
        <TouchableOpacity onPress={() => AsyncStorage.clear()}>
          <Text style={styles.clearData}>Clear App Cache</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      android: { elevation: 4 },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
    }),
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F2F2F2',
  },
  editButtonText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#000',
  },
  menuWrapper: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
      },
    }),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#222',
  },
  logoutBtn: {
    marginTop: 32,
  },
  clearData: {
    textAlign: 'center',
    fontSize: 13,
    color: '#888',
    marginTop: 12,
    marginBottom: 40,
    textDecorationLine: 'underline',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
  loginSubtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  loginButton: {
    marginBottom: 20,
  },
  registerText: {
    color: '#000',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
})

