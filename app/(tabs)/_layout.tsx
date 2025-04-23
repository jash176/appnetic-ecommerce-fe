// app/_layout.tsx
import { Tabs } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          backgroundColor: '#FFF',
          borderTopWidth: 0,
          elevation: 4,
          shadowOpacity: 0,
          paddingBottom: 10,
          paddingTop: 10,
          borderRadius: 16,
          position: 'absolute',
          bottom: 10,
          marginHorizontal: 16
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name="home-outline" 
              size={20} 
              color={focused ? "#000" : "#9e9e9e"} 
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name="search-outline" 
              size={20} 
              color={focused ? "#000" : "#9e9e9e"} 
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name="bag-outline" 
              size={20} 
              color={focused ? "#000" : "#9e9e9e"} 
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: 'Favourites',
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name="heart-outline" 
              size={20} 
              color={focused ? "#000" : "#9e9e9e"} 
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Ionicons 
              name="person-outline" 
              size={20} 
              color={focused ? "#000" : "#9e9e9e"} 
            />
          ),
          tabBarLabel: () => null,
        }}
      />
    </Tabs>
  );
}