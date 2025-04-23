// app/_layout.tsx
import { Tabs } from 'expo-router';
import { Platform, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '@/store/cartStore';

export default function TabLayout() {
  const { getItemCount, items } = useCartStore();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          backgroundColor: '#FFF',
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 4,
          paddingBottom: 10,
          paddingTop: 10,
          borderRadius: 16,
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 20 : 10,
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
          tabBarIcon: ({ focused }) => {
            const itemCount = getItemCount();
            return(
            <View>
              <Ionicons 
                name="bag-outline" 
                size={20} 
                color={focused ? "#000" : "#9e9e9e"} 
              />
              {itemCount > 0 && (
                <View style={{
                  position: 'absolute',
                  right: -6,
                  top: -6,
                  backgroundColor: '#FF3B30',
                  borderRadius: 10,
                  width: 16,
                  height: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                    {itemCount > 9 ? '9+' : itemCount}
                  </Text>
                </View>
              )}
            </View>
          )},
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