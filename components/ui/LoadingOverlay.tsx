import React from 'react';
import { 
  ActivityIndicator, 
  StyleSheet, 
  View, 
  Dimensions, 
  Platform 
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { 
  FadeIn, 
  FadeOut 
} from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';

interface LoadingOverlayProps {
  visible: boolean;
  text?: string;
  fullScreen?: boolean;
  blurIntensity?: number;
  blurTint?: 'light' | 'dark' | 'default';
}

const { width, height } = Dimensions.get('window');

export default function LoadingOverlay({
  visible,
  text,
  fullScreen = true,
  blurIntensity = 50,
  blurTint = 'light'
}: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        styles.container, 
        fullScreen ? styles.fullScreen : styles.content
      ]}
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
    >
      <BlurView 
        intensity={blurIntensity} 
        tint={blurTint}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
        {text && (
          <ThemedText style={styles.text}>{text}</ThemedText>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    ...Platform.select({
      android: {
        backgroundColor: 'rgba(0,0,0,0.2)',
      }
    })
  },
  content: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  loaderContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  text: {
    marginTop: 12,
    textAlign: 'center',
  }
}); 