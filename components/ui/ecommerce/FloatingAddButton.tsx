import React from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FloatingAddButtonProps {
  onPress: () => void;
  visible: boolean;
}

const FloatingAddButton = ({ onPress, visible }: FloatingAddButtonProps) => {
  const backgroundColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'background');
  const { bottom: safeAreaBottom } = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <View style={[styles.container, { bottom: Platform.OS === 'ios' ? 20 : safeAreaBottom + 16 }]}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Ionicons name="cart-outline" size={20} color={textColor} style={styles.icon} />
        <ThemedText style={[styles.text, { color: textColor }]}>ADD</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 1000,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 0,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FloatingAddButton; 