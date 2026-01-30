import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/common/Header';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { colors, spacing, fontSize, borderRadius } from '../config/theme';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { login, register } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  // Login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register form
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({});

  const validateLogin = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email';
    if (!password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(mobile)) newErrors.mobile = 'Invalid mobile number';
    if (!regEmail.trim()) newErrors.regEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(regEmail)) newErrors.regEmail = 'Invalid email';
    if (!regPassword.trim()) newErrors.regPassword = 'Password is required';
    else if (regPassword.length < 6) newErrors.regPassword = 'Password must be at least 6 characters';
    if (regPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    
    setIsLoading(true);
    const result = await login({ email, password });
    setIsLoading(false);
    
    if (result.success) {
      const redirectTo = route.params?.redirect || 'Home';
      navigation.reset({
        index: 0,
        routes: [{ name: redirectTo }],
      });
    } else {
      Alert.alert('Login Failed', result.error || 'Please check your credentials');
    }
  };

  const handleRegister = async () => {
    if (!validateRegister()) return;
    
    setIsLoading(true);
    const result = await register({
      firstName,
      lastName,
      mobileNumber: mobile,
      email: regEmail,
      password: regPassword,
      username: regEmail,
      roleId: '00000000-0000-0000-0000-000000000002', // Default customer role
    });
    setIsLoading(false);
    
    if (result.success) {
      Alert.alert('Success', result.message || 'Registration successful! Please login.');
      setIsLogin(true);
      setEmail(regEmail);
    } else {
      Alert.alert('Registration Failed', result.error || 'Please try again');
    }
  };

  return (
    <View style={styles.container}>
      <Header title={isLogin ? 'Login' : 'Sign Up'} showBack showCart={false} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://www.agronexis.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FAgroNexisGreen.b28ec27e.png&w=384&q=75' }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Login to continue shopping' : 'Sign up to start shopping'}
          </Text>

          {isLogin ? (
            // Login Form
            <View style={styles.form}>
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                testID="login-email-input"
              />
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                error={errors.password}
                testID="login-password-input"
              />
              <Button
                title="Login"
                onPress={handleLogin}
                loading={isLoading}
                fullWidth
                style={styles.submitButton}
                testID="login-submit-btn"
              />
            </View>
          ) : (
            // Register Form
            <View style={styles.form}>
              <View style={styles.row}>
                <View style={styles.halfInput}>
                  <Input
                    label="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First name"
                    error={errors.firstName}
                    testID="register-firstname-input"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Input
                    label="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last name"
                    error={errors.lastName}
                    testID="register-lastname-input"
                  />
                </View>
              </View>
              <Input
                label="Mobile Number"
                value={mobile}
                onChangeText={setMobile}
                placeholder="10-digit mobile number"
                keyboardType="phone-pad"
                error={errors.mobile}
                testID="register-mobile-input"
              />
              <Input
                label="Email"
                value={regEmail}
                onChangeText={setRegEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.regEmail}
                testID="register-email-input"
              />
              <Input
                label="Password"
                value={regPassword}
                onChangeText={setRegPassword}
                placeholder="Create a password"
                secureTextEntry
                error={errors.regPassword}
                testID="register-password-input"
              />
              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry
                error={errors.confirmPassword}
                testID="register-confirm-password-input"
              />
              <Button
                title="Create Account"
                onPress={handleRegister}
                loading={isLoading}
                fullWidth
                style={styles.submitButton}
                testID="register-submit-btn"
              />
            </View>
          )}

          {/* Toggle Login/Register */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.toggleLink}>
                {isLogin ? 'Create account' : 'Log in'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.primary.main,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  form: {
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -spacing.xs,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  submitButton: {
    marginTop: spacing.md,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
  },
  toggleLink: {
    fontSize: fontSize.md,
    color: colors.primary.main,
    fontWeight: '600',
  },
});

export default LoginScreen;
