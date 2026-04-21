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
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { colors, spacing, fontSize, borderRadius, fonts } from '../config/theme';
import { useAuth } from '../context/AuthContext';

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

      {/* Hero */}
      <View style={styles.hero}>
        {/* Blobs */}
        <View style={styles.blobA} />
        <View style={styles.blobB} />

        {/* Back button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          accessibilityLabel="Go back"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>

        {/* Brand */}
        <View style={styles.heroContent}>
          <View style={styles.logoCircle}>
            <LottieView
              source={require('../../assets/lottie/leaf.json')}
              autoPlay
              loop
              style={styles.logoLottie}
            />
          </View>
          <Text style={styles.heroTitle}>DESI KING</Text>
          <Text style={styles.heroSub}>Premium Spices, Pure Tradition</Text>
        </View>
      </View>

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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.default,
  },

  // Hero
  hero: {
    backgroundColor: colors.primary.main,
    height: 300,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 36,
    overflow: 'hidden',
    position: 'relative',
  },
  blobA: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255,255,255,0.055)',
    top: -70,
    right: -50,
  },
  blobB: {
    position: 'absolute',
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: `rgba(${parseInt(colors.secondary.main.slice(1,3),16)},${parseInt(colors.secondary.main.slice(3,5),16)},${parseInt(colors.secondary.main.slice(5,7),16)},0.14)`,
    bottom: 10,
    left: -40,
  },
  backBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 36,
    left: spacing.md + 2,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  heroContent: {
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logoLottie: {
    width: 48,
    height: 48,
  },
  heroTitle: {
    fontFamily: fonts.heading.extrabold,
    fontSize: 30,
    color: '#fff',
    letterSpacing: 4,
  },
  heroSub: {
    fontFamily: fonts.heading.italic,
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 5,
  },

  // Card
  cardWrapper: {
    flex: 1,
    marginTop: -24,
  },
  card: {
    flex: 1,
    backgroundColor: colors.background.warm,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },
  cardContent: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },

  // Tab switcher
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.background.cream,
    borderRadius: borderRadius.full,
    padding: 4,
    marginBottom: spacing.xl,
    borderWidth: 1.5,
    borderColor: colors.card.border,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.full,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary.main,
  },
  tabText: {
    fontSize: fontSize.sm,
    fontFamily: fonts.body.semibold,
    color: colors.text.muted,
  },
  tabTextActive: {
    color: '#fff',
    fontFamily: fonts.body.extrabold,
  },

  // Form
  formTitle: {
    fontSize: 24,
    fontFamily: fonts.heading.extrabold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  formSub: {
    fontSize: fontSize.sm,
    fontFamily: fonts.body.regular,
    color: colors.text.secondary,
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
    fontFamily: fonts.body.regular,
    color: colors.text.secondary,
  },
  toggleLink: {
    fontSize: fontSize.sm,
    fontFamily: fonts.body.extrabold,
    color: colors.secondary.dark,
  },
});

export default LoginScreen;
