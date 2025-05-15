import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts as useSpaceGrotesk, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useFonts as useDMSans, DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { Slot } from 'expo-router';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ApiProvider } from '@/lib/api/queryProvider';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useFavoritesStore } from '@/store/favoritesStore';
import LoadingProvider from '@/components/ui/LoadingProvider';
import { usePushToken } from '@/hooks/usePushToken';

// Keep the splash screen visible until we're ready
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  usePushToken();
  const colorScheme = useColorScheme();
  const { checkAuthState, isLoading: authLoading } = useAuthStore();
  const { loadCart } = useCartStore();
  const { loadFavorites } = useFavoritesStore();
  
  const [loadedM] = useSpaceGrotesk({
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  const [loadedDM] = useDMSans({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  useEffect(() => {
    // Load all persistent data when the app starts
    const initializeApp = async () => {
      try {
        // Check if user is already authenticated
        await checkAuthState();
        
        // Load cart and favorites data
        await loadCart();
        await loadFavorites();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        // Hide splash screen once initialization is complete
        SplashScreen.hideAsync();
      }
    };

    initializeApp();
  }, []);

  const fontsLoaded = loadedM && loadedDM;

  // If auth is still checking, we can keep showing the splash screen
  if (authLoading || !fontsLoaded) {
    return null;
  }

  return (
    <ApiProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <LoadingProvider>
            <Slot />
            <StatusBar style="dark" />
          </LoadingProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </ApiProvider>
  );
}
