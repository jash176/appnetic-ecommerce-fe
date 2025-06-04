import { StyleSheet, View } from 'react-native';
import React from 'react';
import { ThemedText } from '../ThemedText';
import { Ionicons } from '@expo/vector-icons';

interface PasswordValidationProps {
  password: string;
}

const PasswordValidation = ({ password }: PasswordValidationProps) => {
  const validations = [
    {
      label: '8-25 characters only',
      isValid: password.length >= 8 && password.length <= 25,
    },
    {
      label: '1 number',
      isValid: /\d/.test(password),
    },
    {
      label: '1 uppercase',
      isValid: /[A-Z]/.test(password),
    },
    {
      label: '1 lowercase',
      isValid: /[a-z]/.test(password),
    },
    {
      label: 'No spaces',
      isValid: !/\s/.test(password),
    },
  ];

  return (
    <View style={styles.container}>
      {validations.map((validation, index) => (
        <View key={index} style={styles.validationItem}>
          <ThemedText
            style={[
              styles.validationText,
              { color: validation.isValid ? '#4CAF50' : '#FF3B30' }
            ]}
          >
            {validation.label}
          </ThemedText>
          <Ionicons
            name={validation.isValid ? "checkmark-circle" : "close-circle"}
            size={16}
            color={validation.isValid ? '#4CAF50' : '#FF3B30'}
            style={styles.icon}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  validationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    marginLeft: 4,
  },
  validationText: {
    fontSize: 12,
  },
});

export default PasswordValidation;
