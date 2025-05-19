import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { router, Stack } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    const success = await login(email, password);
    if (success) {
      router.push('/(tabs)');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Sign In', headerBackTitle: 'Back' }} />
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.centered}>
              <View style={styles.formCard}>
                <View style={styles.header}>
                  <Ionicons name="lock-closed-outline" size={64} color="#2D6CDF" />
                  <ThemedText style={styles.title}>Welcome Back</ThemedText>
                  <ThemedText style={styles.subtitle}>
                    Sign in to your account to continue
                  </ThemedText>
                </View>

                {error && (
                  <View style={styles.errorContainer}>
                    <ThemedText style={styles.errorText}>{error}</ThemedText>
                    <TouchableOpacity onPress={clearError} style={styles.errorButton}>
                      <Ionicons name="close-circle" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                )}

                {/* Email Field */}
                <View style={styles.formField}>
                  <ThemedText style={styles.label}>Email</ThemedText>
                  <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      placeholderTextColor="#aaa"
                    />
                  </View>
                </View>

                {/* Password Field */}
                <View style={styles.formField}>
                  <ThemedText style={styles.label}>Password</ThemedText>
                  <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      placeholderTextColor="#aaa"
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggle}>
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color="#888"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={() => router.push('/forgot-password')}
                >
                  <ThemedText style={styles.forgotPasswordText}>Forgot Password?</ThemedText>
                </TouchableOpacity>

                <Button
                  title="Sign In"
                  onPress={handleLogin}
                  fullWidth
                  loading={isLoading}
                  style={styles.loginButton}
                />

                <View style={styles.registerContainer}>
                  <ThemedText style={styles.registerText}>Don't have an account? </ThemedText>
                  <TouchableOpacity onPress={() => router.push('/register')}>
                    <ThemedText style={styles.registerLink}>Sign Up</ThemedText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FA',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
    paddingVertical: 32,
  },
  centered: {
    width: '100%',
    alignItems: 'center',
  },
  formCard: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 6,
    color: '#222',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  errorContainer: {
    backgroundColor: '#FFEEEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  errorText: {
    color: '#FF3B30',
    flex: 1,
    fontSize: 14,
  },
  errorButton: {
    marginLeft: 8,
    padding: 4,
  },
  formField: {
    marginBottom: 18,
  },
  label: {
    marginBottom: 6,
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
    color: '#222',
  },
  passwordToggle: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 2,
    marginBottom: 22,
  },
  forgotPasswordText: {
    color: '#2D6CDF',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    marginTop: 4,
    borderRadius: 10,
    height: 48,
    justifyContent: 'center',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  registerText: {
    color: '#6B7280',
    fontSize: 15,
  },
  registerLink: {
    color: '#2D6CDF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});