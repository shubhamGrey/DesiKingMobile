import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/common/Button';
import { colors, spacing, fontSize, borderRadius, shadows, fonts } from '../config/theme';
import { useAuth } from '../context/AuthContext';

const MENU_GROUPS = (navigation) => [
  {
    title: 'Activity',
    items: [
      { icon: 'bag-handle-outline', label: 'My Orders', sublabel: 'Track & view orders', onPress: () => navigation.navigate('OrderHistory') },
    ],
  },
  {
    title: 'Settings',
    items: [
      { icon: 'location-outline', label: 'Address Book', sublabel: 'Manage saved addresses', onPress: () => navigation.navigate('AddressBook') },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'help-circle-outline', label: 'Help & Support', sublabel: 'Get in touch with us', onPress: () => navigation.navigate('Contact') },
      { icon: 'information-circle-outline', label: 'About Us', sublabel: 'Our story & mission', onPress: () => navigation.navigate('About') },
    ],
  },
];

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
        },
      },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0a1628" />
        <View style={styles.heroBanner}>
          <View style={styles.decCircle} />
          <Text style={styles.heroGreet}>Hello, Guest!</Text>
          <Text style={styles.heroSub}>Sign in to access your account</Text>
        </View>
        <View style={styles.guestCard}>
          <View style={styles.guestIconWrap}>
            <Ionicons name="person-outline" size={36} color={colors.primary.main} />
          </View>
          <Text style={styles.guestTitle}>Welcome to Desi King</Text>
          <Text style={styles.guestSub}>Login to view orders, track deliveries and manage your profile</Text>
          <Button
            title="Login / Register"
            onPress={() => navigation.navigate('Login')}
            fullWidth
            size="large"
            style={styles.loginBtn}
            icon="log-in-outline"
          />
        </View>
      </View>
    );
  }

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1628" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile hero */}
        <View style={styles.heroBanner}>
          <View style={styles.decCircle} />
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
            <TouchableOpacity
              style={styles.cameraBtn}
              onPress={() => Alert.alert('Coming Soon', 'Profile photo upload will be available in a future update.')}
            >
              <Ionicons name="camera" size={13} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.heroName}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.heroEmail}>{user?.email}</Text>
        </View>

        {/* Menu groups */}
        <View style={styles.menuSection}>
          {MENU_GROUPS(navigation).map((group, gIdx) => (
            <View key={gIdx} style={styles.group}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              <View style={styles.groupCard}>
                {group.items.map((item, iIdx) => (
                  <TouchableOpacity
                    key={iIdx}
                    style={[
                      styles.menuRow,
                      iIdx < group.items.length - 1 && styles.menuRowBorder,
                    ]}
                    onPress={item.onPress}
                    activeOpacity={0.75}
                  >
                    <View style={styles.menuIconCircle}>
                      <Ionicons name={item.icon} size={20} color={colors.primary.main} />
                    </View>
                    <View style={styles.menuMeta}>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                      {item.sublabel && <Text style={styles.menuSublabel}>{item.sublabel}</Text>}
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={colors.text.disabled} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.error.main} />
          <Text style={styles.logoutText}>Logout from Device</Text>
        </TouchableOpacity>

        <Text style={styles.version}>App Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  heroBanner: {
    backgroundColor: '#0d1e3d',
    paddingTop: Platform.OS === 'ios' ? 64 : 50,
    paddingBottom: spacing.xl + 10,
    alignItems: 'center',
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(188,129,65,0.2)',
  },
  decCircle: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -60,
    right: -50,
  },
  heroGreet: {
    fontSize: fontSize.xxl,
    fontFamily: fonts.heading.black,
    color: '#fff',
    letterSpacing: -0.5,
  },
  heroSub: {
    fontSize: fontSize.sm,
    fontFamily: fonts.body.regular,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 6,
  },
  guestCard: {
    margin: spacing.md,
    marginTop: -20,
    backgroundColor: colors.glass.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  guestIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  guestTitle: {
    fontSize: fontSize.xl,
    fontFamily: fonts.heading.extrabold,
    color: colors.text.primary,
    marginBottom: 8,
  },
  guestSub: {
    fontSize: fontSize.sm,
    fontFamily: fonts.body.regular,
    color: colors.text.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  loginBtn: {},
  avatarWrap: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.secondary.main,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(188,129,65,0.5)',
  },
  avatarInitials: {
    fontSize: 30,
    fontFamily: fonts.heading.black,
    color: '#fff',
    letterSpacing: 1,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  heroName: {
    fontSize: fontSize.xl,
    fontFamily: fonts.heading.black,
    color: '#fff',
    letterSpacing: -0.3,
  },
  heroEmail: {
    fontSize: fontSize.sm,
    fontFamily: fonts.body.regular,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 3,
  },
  menuSection: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  group: {
    marginBottom: spacing.lg,
  },
  groupTitle: {
    fontSize: 11,
    fontFamily: fonts.body.extrabold,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginLeft: spacing.xs,
    marginBottom: spacing.sm,
  },
  groupCard: {
    backgroundColor: colors.glass.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  menuIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuMeta: {
    flex: 1,
  },
  menuLabel: {
    fontSize: fontSize.md,
    fontFamily: fonts.body.bold,
    color: colors.text.primary,
  },
  menuSublabel: {
    fontSize: 11,
    fontFamily: fonts.body.regular,
    color: colors.text.muted,
    marginTop: 2,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
  logoutText: {
    color: colors.error.main,
    fontFamily: fonts.body.bold,
    fontSize: fontSize.md,
    marginLeft: spacing.sm,
  },
  version: {
    textAlign: 'center',
    fontSize: 11,
    fontFamily: fonts.body.regular,
    color: colors.text.disabled,
    marginTop: spacing.sm,
  },
});

export default ProfileScreen;
