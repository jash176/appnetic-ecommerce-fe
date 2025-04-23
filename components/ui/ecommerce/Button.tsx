import React from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ButtonProps {
  title: string;
  onPress: () => void;
  icon?: string;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

const Button = ({
  title,
  onPress,
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = false
}: ButtonProps) => {
  const backgroundColor = useThemeColor({}, variant === 'primary' ? 'tint' : 'background');
  const textColor = useThemeColor({}, variant === 'primary' ? 'background' : 'text');
  const borderColor = useThemeColor({}, 'text');

  const getContainerStyle = () => {
    const baseStyle = [
      styles.container,
      styles[size],
      fullWidth && styles.fullWidth,
      disabled && styles.disabled
    ];

    if (variant === 'outline') {
      return [...baseStyle, { backgroundColor: 'transparent', borderColor, borderWidth: 1 }];
    }

    return [...baseStyle, { backgroundColor }];
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon as any} size={20} color={textColor} style={styles.leftIcon} />
          )}
          <ThemedText
            type="title"
            style={[styles.title, { color: textColor }]}
          >
            {title}
          </ThemedText>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon as any} size={20} color={textColor} style={styles.rightIcon} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  small: {
    minHeight: 36,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  medium: {
    minHeight: 48,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  large: {
    minHeight: 56,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default Button; 