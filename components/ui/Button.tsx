import React from 'react';
import { 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  View, 
  TouchableOpacityProps,
  StyleProp,
  ViewStyle,
  TextStyle
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  fullWidth?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  fullWidth = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  textStyle,
  style,
  ...rest
}) => {
  // Determine button styles based on props
  const buttonStyles = [
    styles.button,
    styles[`${size}Button`],
    styles[`${variant}Button`],
    fullWidth && styles.fullWidth,
    style,
  ];
  
  // Determine text styles based on props
  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    textStyle,
  ];
  
  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.7}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' ? '#ffffff' : '#0a7ea4'} 
        />
      ) : (
        <ThemedText style={textStyles}>
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fullWidth: {
    width: '100%',
  },
  
  // Size styles
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  
  // Variant styles
  primaryButton: {
    backgroundColor: '#0a7ea4',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  
  // Text styles
  text: {
    fontWeight: '600',
  },
  primaryText: {
    color: '#000000',
  },
  secondaryText: {
    color: '#000000',
  },
  outlineText: {
    color: '#000000',
  },
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },
});

export default Button; 