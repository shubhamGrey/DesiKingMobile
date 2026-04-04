import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { colors, spacing, fontSize, borderRadius, shadows } from '../config/theme';
import { useAuth } from '../context/AuthContext';

const { height } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login, register } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateLogin = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email address';
    if (!password.trim()) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateRegister = () => {
    const e = {};
    if (!firstName.trim()) e.firstName = 'Required';
    if (!lastName.trim()) e.lastName = 'Required';
    if (!mobile.trim()) e.mobile = 'Mobile is required';
    else if (!/^[6-9]\d{9}$/.test(mobile)) e.mobile = 'Invalid mobile number';
    if (!regEmail.trim()) e.regEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(regEmail)) e.regEmail = 'Invalid email';
    if (!regPassword.trim()) e.regPassword = 'Password is required';
    else if (regPassword.length < 6) e.regPassword = 'Min. 6 characters';
    if (regPassword !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    setIsLoading(true);
    const result = await login({ email, password });
    setIsLoading(false);
    if (result.success) {
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
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
      roleId: '00000000-0000-0000-0000-000000000002',
    });
    setIsLoading(false);
    if (result.success) {
      Alert.alert('Welcome!', result.message || 'Account created. Please login.');
      setIsLogin(true);
      setEmail(regEmail);
    } else {
      Alert.alert('Registration Failed', result.error || 'Please try again');
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary.main} />

      {/* Hero banner */}
      <ImageBackground
        source={require('../../assets/Login.png')}
        style={styles.heroBanner}
        resizeMode="cover"
      >
        <View style={styles.heroImageOverlay}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            accessibilityLabel="Go back"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <View style={styles.logoCircle}>
              <Image
                source={require('../../assets/AgroNexisWhite.png')}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
                accessibilityLabel="Agro Nexis logo"
              />
            </View>
            <Text style={styles.heroTitle}>DESI KING</Text>
            <Text style={styles.heroSub}>Premium Spices, Pure Tradition</Text>
          </View>
          {/* Decorative circles */}
          <View style={styles.decCircle1} />
          <View style={styles.decCircle2} />
          {/* Premium watermark */}
          <Image
            source={require('../../assets/premium symbol.png')}
            style={styles.premiumWatermark}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
        </View>
      </ImageBackground>

      {/* Card */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.cardWrapper}
      >
        <ScrollView
          style={styles.card}
          contentContainerStyle={styles.cardContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Tab switcher */}
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, isLogin && styles.tabActive]}
              onPress={() => { setIsLogin(true); setErrors({}); }}
            >
              <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, !isLogin && styles.tabActive]}
              onPress={() => { setIsLogin(false); setErrors({}); }}
            >
              <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {isLogin ? (
            <View>
              <Text style={styles.formTitle}>Welcome back</Text>
              <Text style={styles.formSub}>Sign in to continue shopping</Text>

              <Input
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                leftIcon={<Ionicons name="mail-outline" size={18} color={colors.text.muted} />}
                testID="login-email-input"
              />
              <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                error={errors.password}
                leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.text.muted} />}
                testID="login-password-input"
              />
              <Button
                title="Login"
                onPress={handleLogin}
                loading={isLoading}
                fullWidth
                size="large"
                style={styles.submitBtn}
                testID="login-submit-btn"
              />
            </View>
          ) : (
            <View>
              <Text style={styles.formTitle}>Create account</Text>
              <Text style={styles.formSub}>Join thousands of spice lovers</Text>

              <View style={styles.nameRow}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                  <Input
                    label="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="First"
                    error={errors.firstName}
                    testID="register-firstname-input"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Input
                    label="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder="Last"
                    error={errors.lastName}
                    testID="register-lastname-input"
                  />
                </View>
              </View>
              <Input
                label="Mobile Number"
                value={mobile}
                onChangeText={setMobile}
                placeholder="10-digit mobile"
                keyboardType="phone-pad"
                error={errors.mobile}
                leftIcon={<Ionicons name="call-outline" size={18} color={colors.text.muted} />}
                testID="register-mobile-input"
              />
              <Input
                label="Email Address"
                value={regEmail}
                onChangeText={setRegEmail}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.regEmail}
                leftIcon={<Ionicons name="mail-outline" size={18} color={colors.text.muted} />}
                testID="register-email-input"
              />
              <Input
                label="Password"
                value={regPassword}
                onChangeText={setRegPassword}
                placeholder="Create a strong password"
                secureTextEntry
                error={errors.regPassword}
                leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.text.muted} />}
                testID="register-password-input"
              />
              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Repeat your password"
                secureTextEntry
                error={errors.confirmPassword}
                leftIcon={<Ionicons name="shield-checkmark-outline" size={18} color={colors.text.muted} />}
                testID="register-confirm-password-input"
              />
              <Button
                title="Create Account"
                onPress={handleRegister}
                loading={isLoading}
                fullWidth
                size="large"
                style={styles.submitBtn}
                testID="register-submit-btn"
              />
            </View>
          )}

          {/* Toggle */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </Text>
            <TouchableOpacity onPress={() => { setIsLogin(!isLogin); setErrors({}); }}>
              <Text style={styles.toggleLink}>
                {isLogin ? 'Sign Up' : 'Log in'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const HERO_HEIGHT = height * 0.32;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.paper,
  },
  heroBanner: {
    height: HERO_HEIGHT,
    overflow: 'hidden',
  },
  heroImageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(27,77,62,0.88)',
    justifyContent: 'flex-end',
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  premiumWatermark: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 40,
    height: 40,
    opacity: 0.22,
  },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 36,
    left: spacing.md,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  heroContent: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 4,
  },
  heroSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    letterSpacing: 0.5,
  },
  decCircle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -60,
    right: -40,
  },
  decCircle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(188,129,65,0.2)',
    bottom: -30,
    right: 40,
  },
  cardWrapper: {
    flex: 1,
    marginTop: -24,
  },
  card: {
    flex: 1,
    backgroundColor: colors.background.paper,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
  },
  cardContent: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.accent.lightGray,
    borderRadius: borderRadius.full,
    padding: 4,
    marginBottom: spacing.xl,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.full,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.background.paper,
    ...shadows.sm,
  },
  tabText: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: colors.text.muted,
  },
  tabTextActive: {
    color: colors.primary.main,
    fontWeight: '800',
  },
  formTitle: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: colors.text.primary,
    marginBottom: 4,
  },
  formSub: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
    marginBottom: spacing.lg,
  },
  nameRow: {
    flexDirection: 'row',
  },
  submitBtn: {
    marginTop: spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  toggleText: {
    fontSize: fontSize.sm,
    color: colors.text.muted,
  },
  toggleLink: {
    fontSize: fontSize.sm,
    color: colors.primary.main,
    fontWeight: '800',
  },
});

export default LoginScreen;
