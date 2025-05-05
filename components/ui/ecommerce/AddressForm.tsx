import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  Alert, 
  Animated, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import Button from '@/components/ui/Button';
import { Address } from '@/store/addressStore';
import { Ionicons } from '@expo/vector-icons';

interface AddressFormProps {
  initialAddress?: Partial<Address>;
  onSubmit: (addressData: Omit<Address, 'id' | 'isDefault'> & { isDefault?: boolean }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitButtonTitle?: string;
}

const AddressForm: React.FC<AddressFormProps> = ({
  initialAddress,
  onSubmit,
  onCancel,
  isLoading = false,
  submitButtonTitle = 'Save Address'
}) => {
  const [addressData, setAddressData] = useState({
    name: initialAddress?.name || '',
    line1: initialAddress?.line1 || '',
    line2: initialAddress?.line2 || '',
    city: initialAddress?.city || '',
    state: initialAddress?.state || '',
    postalCode: initialAddress?.postalCode || '',
    country: initialAddress?.country || 'India',
    phone: initialAddress?.phone || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  
  // Start entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleChange = (field: string, value: string) => {
    setAddressData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!addressData.name.trim()) newErrors.name = 'Name is required';
    if (!addressData.line1.trim()) newErrors.line1 = 'Address line 1 is required';
    if (!addressData.city.trim()) newErrors.city = 'City is required';
    if (!addressData.state.trim()) newErrors.state = 'State is required';
    if (!addressData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!addressData.country.trim()) newErrors.country = 'Country is required';
    
    // Phone validation (basic)
    if (!addressData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(addressData.phone.trim())) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(addressData);
    } else {
      // Shake animation for error
      Animated.sequence([
        Animated.timing(slideAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
      
      Alert.alert('Please fix the errors', 'There are some issues with your form that need to be corrected.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          style={[
            styles.form,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Name Field */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>
              Full Name <ThemedText style={styles.required}>*</ThemedText>
            </ThemedText>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#aaa" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={addressData.name}
                onChangeText={(value) => handleChange('name', value)}
                placeholder="Enter full name"
                placeholderTextColor="#999"
              />
            </View>
            {errors.name && (
              <ThemedText style={styles.errorText}>
                <Ionicons name="alert-circle-outline" size={14} color="#e74c3c" /> {errors.name}
              </ThemedText>
            )}
          </View>

          {/* Address Line 1 */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>
              Address Line 1 <ThemedText style={styles.required}>*</ThemedText>
            </ThemedText>
            <View style={styles.inputContainer}>
              <Ionicons name="home-outline" size={20} color="#aaa" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.line1 && styles.inputError]}
                value={addressData.line1}
                onChangeText={(value) => handleChange('line1', value)}
                placeholder="Street address, house number"
                placeholderTextColor="#999"
              />
            </View>
            {errors.line1 && (
              <ThemedText style={styles.errorText}>
                <Ionicons name="alert-circle-outline" size={14} color="#e74c3c" /> {errors.line1}
              </ThemedText>
            )}
          </View>

          {/* Address Line 2 */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>Address Line 2 (Optional)</ThemedText>
            <View style={styles.inputContainer}>
              <Ionicons name="business-outline" size={20} color="#aaa" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={addressData.line2}
                onChangeText={(value) => handleChange('line2', value)}
                placeholder="Apartment, suite, unit, building, etc."
                placeholderTextColor="#999"
              />
            </View>
          </View>

          {/* Two fields in one row */}
          <View style={styles.rowContainer}>
            {/* City */}
            <View style={[styles.formGroup, styles.halfWidth]}>
              <ThemedText style={styles.label}>
                City <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="#aaa" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.city && styles.inputError]}
                  value={addressData.city}
                  onChangeText={(value) => handleChange('city', value)}
                  placeholder="Enter city"
                  placeholderTextColor="#999"
                />
              </View>
              {errors.city && (
                <ThemedText style={styles.errorText}>
                  <Ionicons name="alert-circle-outline" size={14} color="#e74c3c" /> {errors.city}
                </ThemedText>
              )}
            </View>

            {/* State */}
            <View style={[styles.formGroup, styles.halfWidth]}>
              <ThemedText style={styles.label}>
                State <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <View style={styles.inputContainer}>
                <Ionicons name="map-outline" size={20} color="#aaa" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.state && styles.inputError]}
                  value={addressData.state}
                  onChangeText={(value) => handleChange('state', value)}
                  placeholder="Enter state"
                  placeholderTextColor="#999"
                />
              </View>
              {errors.state && (
                <ThemedText style={styles.errorText}>
                  <Ionicons name="alert-circle-outline" size={14} color="#e74c3c" /> {errors.state}
                </ThemedText>
              )}
            </View>
          </View>

          {/* Another row */}
          <View style={styles.rowContainer}>
            {/* Postal Code */}
            <View style={[styles.formGroup, styles.halfWidth]}>
              <ThemedText style={styles.label}>
                Postal Code <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#aaa" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.postalCode && styles.inputError]}
                  value={addressData.postalCode}
                  onChangeText={(value) => handleChange('postalCode', value)}
                  placeholder="Enter postal code"
                  placeholderTextColor="#999"
                  keyboardType="number-pad"
                />
              </View>
              {errors.postalCode && (
                <ThemedText style={styles.errorText}>
                  <Ionicons name="alert-circle-outline" size={14} color="#e74c3c" /> {errors.postalCode}
                </ThemedText>
              )}
            </View>

            {/* Country */}
            <View style={[styles.formGroup, styles.halfWidth]}>
              <ThemedText style={styles.label}>
                Country <ThemedText style={styles.required}>*</ThemedText>
              </ThemedText>
              <View style={styles.inputContainer}>
                <Ionicons name="globe-outline" size={20} color="#aaa" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.country && styles.inputError]}
                  value={addressData.country}
                  onChangeText={(value) => handleChange('country', value)}
                  placeholder="Enter country"
                  placeholderTextColor="#999"
                />
              </View>
              {errors.country && (
                <ThemedText style={styles.errorText}>
                  <Ionicons name="alert-circle-outline" size={14} color="#e74c3c" /> {errors.country}
                </ThemedText>
              )}
            </View>
          </View>

          {/* Phone */}
          <View style={styles.formGroup}>
            <ThemedText style={styles.label}>
              Phone Number <ThemedText style={styles.required}>*</ThemedText>
            </ThemedText>
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#aaa" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                value={addressData.phone}
                onChangeText={(value) => handleChange('phone', value)}
                placeholder="Enter 10-digit phone number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>
            {errors.phone && (
              <ThemedText style={styles.errorText}>
                <Ionicons name="alert-circle-outline" size={14} color="#e74c3c" /> {errors.phone}
              </ThemedText>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.submitButton, isLoading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ThemedText style={styles.buttonText}>Saving...</ThemedText>
              ) : (
                <>
                  <Ionicons name="save-outline" size={18} color="#fff" />
                  <ThemedText style={styles.buttonText}>{submitButtonTitle}</ThemedText>
                </>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Ionicons name="close-outline" size={18} color="#4a6eb5" />
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#444',
  },
  required: {
    color: '#e74c3c',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#333',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  submitButton: {
    backgroundColor: '#4a6eb5',
    paddingVertical: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4a6eb5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#95acd1',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#4a6eb5',
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4a6eb5',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default AddressForm; 