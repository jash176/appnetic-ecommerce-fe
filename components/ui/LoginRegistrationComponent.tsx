import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { ThemedText } from '../ThemedText'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Button from './Button'
import { useAuthStore } from '@/store/authStore'
import EyeIcon from '@/assets/icons/EyeIcon'
import EyeCloseIcon from '@/assets/icons/EyeCloseIcon'
import PasswordValidation from './PasswordValidation'

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
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {checkEmailExists} = useAuthStore();
  const inputRef = useRef<TextInput>(null);

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
        // if(inputRef.current) {
        //   inputRef.current.focus(); // Focus on password input if email does not exist
        // }
        setLoginView(false); // Switch to registration view
      }
      setIsLoading(false);
    }
  }
  const handleBackToSignInPress = () => {
    setLoginView(true);
    setEmailExist(false);
    setEmail('');
    setPassword('');
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
          ref={inputRef}
          style={styles.inputBox}
          placeholder='Enter your password'
          keyboardType='default'
          autoCapitalize='none'
          placeholderTextColor='#6C757D'
          value={password}
          onChangeText={setPassword}
          autoFocus
        />
      </View>}
      <Button loading={isLoading} style={{marginTop: 16}} onPress={() => handleCheckEmail()} title='CONTINUE' />
    </View>
  )
  return(
    <View style={[styles.container, { paddingTop: top }]}>
      <ThemedText type='heading'>{isLoginView ? "SIGN IN" : "SIGN UP"}</ThemedText> 
      {/* Email input */}
      <View style={[styles.inputContainer, {opacity: 0.5}]}>
        <ThemedText type='subtitle'>Email *</ThemedText>
        <TextInput
          style={[styles.inputBox, {backgroundColor: "#E6E6E6"}]}
          placeholder='Enter your email'
          keyboardType='email-address'
          autoCapitalize='none'
          autoComplete='email'
          textContentType='emailAddress'
          placeholderTextColor='#6C757D'
          value={email}
          onChangeText={setEmail}
          editable={false}
        />
      </View>

      {/* Password input */}
      <View style={styles.inputContainer}>
        <ThemedText type='subtitle'>Create a password *</ThemedText>
        <View style={[styles.inputBox, styles.createPasswordInputContainer]}>
          <TextInput
            key={isPasswordVisible ? 'text' : 'password'} 
            style={styles.passwordInput}
            placeholder='Enter your password'
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            {isPasswordVisible ? <EyeIcon /> : <EyeCloseIcon />}
          </TouchableOpacity>
        </View>
        <PasswordValidation password={password} />
      </View>
      <Button 
        style={{marginTop: 16}} 
        onPress={() => {
          const isPasswordValid = 
            password.length >= 8 && 
            password.length <= 25 &&
            /\d/.test(password) &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            !/\s/.test(password);

          if (isPasswordValid) {
            onRegister(email, password);
          }
        }} 
        title='CONTINUE' 
      />
      <Button variant='outline' style={{marginTop: 16}} onPress={handleBackToSignInPress} title='BACK TO SIGN IN' />
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
    color: "#000",
  },
  createPasswordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  passwordInput: {
    // flex: 1,
    // height: '100%',
    // color: "#000",
    // paddingVertical: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  dateInputWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    height: 48,
    justifyContent: 'center',
  },
  dateInput: {
    height: '100%',
    textAlign: 'center',
    color: '#000',
    fontSize: 16,
  },
  dateSeparator: {
    marginHorizontal: 8,
    fontSize: 18,
    color: '#000',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
  },
})