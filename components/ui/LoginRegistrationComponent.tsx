import { SafeAreaView, StyleSheet, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { ThemedText } from '../ThemedText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Button from './Button'
import { useAuthStore } from '@/store/authStore'

interface LoginRegistrationComponentProps {
  onLogin: (email: string, password: string) => void;
  onRegister: (email: string, password: string) => void;
}

const LoginRegistrationComponent = (props: LoginRegistrationComponentProps) => {
  const { onLogin, onRegister } = props;
  const { top } = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailExist, setEmailExist] = useState(false);
  const [isLoginView, setLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const {checkEmailExists} = useAuthStore();

  const handleCheckEmail = async () => {
    if(emailExist && email && password) {
      onLogin(email, password);
      return;
    }
    if (email) {
      setIsLoading(true);
      const exists = await checkEmailExists(email);
      setEmailExist(exists);
      if (!exists) {
        setLoginView(false); // Switch to registration view
      }
      setIsLoading(false);
    }
  }
  if(isLoginView)
  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <ThemedText type='heading'>SIGN IN</ThemedText>
      <ThemedText style={styles.signInTitle} type='subtitle'>Sign in with your email or sign up to become a member</ThemedText>
      <View style={styles.inputContainer}>
        <ThemedText type='title'>Email</ThemedText>
        <TextInput
          style={styles.inputBox}
          placeholder='Enter your email'
          keyboardType='email-address'
          autoCapitalize='none'
          autoComplete='email'
          textContentType='emailAddress'
          placeholderTextColor='#6C757D'
          value={email}
          onChangeText={setEmail}
        />

      </View>
      {emailExist && <View style={styles.inputContainer}>
        <ThemedText type='title'>Password</ThemedText>
        <TextInput
          style={styles.inputBox}
          placeholder='Enter your password'
          keyboardType='email-address'
          autoCapitalize='none'
          autoComplete='email'
          textContentType='emailAddress'
          placeholderTextColor='#6C757D'
          value={password}
          onChangeText={setPassword}
        />
      </View>}
      <Button loading={isLoading} style={{marginTop: 16}} onPress={() => handleCheckEmail()} title='CONTINUE' />
    </View>
  )
  return(
    <View style={[styles.container, { paddingTop: top }]}>
      <ThemedText type='heading'>SIGN IN</ThemedText>
      <ThemedText style={styles.signInTitle} type='subtitle'>Sign in with your email or sign up to become a member</ThemedText>
      <View style={styles.inputContainer}>
        <ThemedText type='title'>Email *</ThemedText>
        <TextInput
          style={styles.inputBox}
          placeholder='Enter your email'
          keyboardType='email-address'
          autoCapitalize='none'
          autoComplete='email'
          textContentType='emailAddress'
          placeholderTextColor='#6C757D'
          value={email}
          onChangeText={setEmail}
        />

      </View>
      <View style={styles.inputContainer}>
        <ThemedText type='title'>Create a password *</ThemedText>
        <TextInput
          style={styles.inputBox}
          placeholder='Enter your password'
          keyboardType='email-address'
          autoCapitalize='none'
          autoComplete='email'
          textContentType='emailAddress'
          placeholderTextColor='#6C757D'
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <Button style={{marginTop: 16}} onPress={() => { }} title='CONTINUE' />
      <Button variant='outline' style={{marginTop: 16}} onPress={() => { }} title='BACK TO SIGN IN' />
    </View>
  )
}

export default LoginRegistrationComponent

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
  },
  signInTitle: {
    marginVertical: 20,
  },
  inputContainer: {
    marginTop: 8,
  },
  inputBox: {
    height: 48,
    borderWidth: 1,
    padding: 0,
    paddingHorizontal: 16,
    marginTop: 8,
    color: "#000"
  }
})