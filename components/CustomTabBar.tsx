// components/CustomTabBar.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const CustomTabBar = () => {
  const router = useRouter();
  const currentPath = usePathname();

  const tabs = [
    {
      name: 'Home',
      path: '/(tabs)',
      icon: 'home-outline',
    },
    {
      name: 'Explore',
      path: '/(tabs)/explore',
      icon: 'bag-outline',
    },
    // {
    //   name: 'Orders',
    //   path: '/orders',
    //   icon: 'receipt-outline',
    // },
    // {
    //   name: 'Profile',
    //   path: '/profile',
    //   icon: 'person-outline',
    // },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = 
          (tab.path === '/' && currentPath === '/') || 
          (tab.path !== '/' && currentPath.startsWith(tab.path));
        
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabButton}
            onPress={() => router.push(tab.path as any)}
          >
            <Ionicons
              name={tab.icon as any}
              size={24}
              color={isActive ? '#000' : '#9e9e9e'}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? '#000' : '#9e9e9e' },
              ]}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomTabBar;