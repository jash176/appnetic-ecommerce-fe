import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts as useSpaceGrotesk, Montserrat_600SemiBold, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import { useFonts as useDMSans, DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ApiProvider } from '@/lib/api/queryProvider';
import { useAuthStore } from '@/store/authStore';
import LoadingProvider from '@/components/ui/LoadingProvider';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const checkAuthState = useAuthStore(state => state.checkAuthState);
  
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
    if (loadedDM && loadedM) {
      // Check auth state when app loads
      checkAuthState().finally(() => {
        SplashScreen.hideAsync();
      });
    }
  }, [loadedDM, loadedM, checkAuthState]);

  const fontsLoaded = loadedM && loadedDM;

  if (!fontsLoaded) {
    return null; // or <AppLoading />
  }

  return (
    <ApiProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <LoadingProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="dark" />
          </LoadingProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </ApiProvider>
  );
}
