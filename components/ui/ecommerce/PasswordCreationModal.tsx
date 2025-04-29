import React, { useState } from 'react';
import { View, StyleSheet, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Button from '@/components/ui/Button';
import payloadClient from '@/lib/api/payloadClient';
import { useAuthStore } from '@/store/authStore';

interface PasswordCreationModalProps {
  visible: boolean;
  email: string;
  customerId: number | undefined;
  onComplete: () => void;
  onSkip: () => void;
}

const PasswordCreationModal: React.FC<PasswordCreationModalProps> = ({
  visible,
  email,
  customerId,
  onComplete,
  onSkip
}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuthStore();
  
  const handleCreateAccount = async () => {
    // Validate passwords
    if (password.length < 8) {
      Alert.alert('Password Too Short', 'Password must be at least 8 characters long');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Passwords Do Not Match', 'Please make sure your passwords match');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create a user account with the same email
      await payloadClient.collections.users.create({
        doc: {
          email: email,
          password: password,
          name: email.split('@')[0], // Use part of email as name (required field)
          role: 'customer'
        }
      });
      
      // If we have a customer ID, link the user to the customer
      if (customerId) {
        // Get the newly created user
        const usersResponse = await payloadClient.collections.users.find({
          where: {
            email: {
              equals: email
            }
          }
        });
        
        if (usersResponse.docs.length > 0) {
          const userId = usersResponse.docs[0].id;
          
          // Update the customer to link to this user
          await payloadClient.collections.customers.update({
            where: {
              id: {
                equals: customerId,
              }
            },
            patch: {
              user: userId
            }
          });
        }
      }
      
      // Auto-login the user
      await login(email, password);
      
      // Call the completion handler
      onComplete();
    } catch (error) {
      console.error('Error creating account:', error);
      Alert.alert('Account Creation Failed', 'There was an error creating your account. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ThemedText style={styles.modalTitle}>Create an Account</ThemedText>
          
          <ThemedText style={styles.modalDescription}>
            Want to save your details for next time? Create a password to complete your account.
          </ThemedText>
          
          <View style={styles.form}>
            <View style={styles.formField}>
              <ThemedText style={styles.label}>Email</ThemedText>
              <TextInput
                style={styles.input}
                value={email}
                editable={false}
                selectTextOnFocus={false}
              />
            </View>
            
            <View style={styles.formField}>
              <ThemedText style={styles.label}>Password</ThemedText>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Create a password"
              />
            </View>
            
            <View style={styles.formField}>
              <ThemedText style={styles.label}>Confirm Password</ThemedText>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholder="Confirm your password"
              />
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              title="CREATE ACCOUNT"
              onPress={handleCreateAccount}
              loading={isSubmitting}
              fullWidth
            />
            
            <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
              <ThemedText style={styles.skipButtonText}>Skip for now</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  form: {
    marginBottom: 24,
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  skipButton: {
    marginTop: 16,
    padding: 8,
  },
  skipButtonText: {
    color: '#666',
  },
});

export default PasswordCreationModal; 