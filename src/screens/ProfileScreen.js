import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/common/Button';
import { colors, spacing, fontSize, borderRadius, fonts } from '../config/theme';
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

  // Guest state
  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary.main} />
        <View style={styles.hero}>
          <View style={styles.blobA} />
          <View style={styles.blobB} />
          <View style={styles.heroContent}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person-outline" size={32} color="rgba(255,255,255,0.8)" />
            </View>
            <Text style={styles.heroName}>Hello, Guest!</Text>
            <Text style={styles.heroEmail}>Sign in to access your account</Text>
          </View>
          <View style={styles.heroWave} />
        </View>

        <View style={styles.guestCard}>
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
      <StatusBar barStyle="light-content" backgroundColor={colors.primary.main} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile hero */}
        <View style={styles.hero}>
          <View style={styles.blobA} />
          <View style={styles.blobB} />
          <View style={styles.heroContent}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
              <TouchableOpacity
                style={styles.cameraBtn}
                onPress={() => Alert.alert('Coming Soon', 'Profile photo upload will be available in a future update.')}
              >
                <Ionicons name="camera" size={12} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.heroName}>{user?.firstName} {user?.lastName}</Text>
            <Text style={styles.heroEmail}>{user?.email}</Text>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>⭐ Premium Member</Text>
            </View>
          </View>
          <View style={styles.heroWave} />
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
          <View style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={18} color={colors.primary.main} />
            <Text style={styles.logoutText}>Logout from Device</Text>
          </View>
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

  // Hero
  hero: {
    backgroundColor: colors.primary.main,
    paddingTop: Platform.OS === 'ios' ? 54 : 44,
    overflow: 'hidden',
    position: 'relative',
  },
  blobA: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.055)',
    top: -60,
    right: -50,
  },
  blobB: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(201,151,90,0.12)',
    bottom: 20,
    left: -40,
  },
  heroContent: {
    alignItems: 'center',
    paddingBottom: 36,
    position: 'relative',
    zIndex: 2,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary.main,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarInitials: {
    fontSize: 28,
    fontFamily: fonts.heading.extrabold,
    color: '#fff',
    letterSpacing: 1,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  heroName: {
    fontFamily: fonts.heading.extrabold,
    fontSize: 22,
    color: '#fff',
    letterSpacing: -0.3,
    marginBottom: 3,
  },
  heroEmail: {
    fontFamily: fonts.body.regular,
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 12,
  },
  premiumBadge: {
    backgroundColor: 'rgba(201,151,90,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(201,151,90,0.45)',
    borderRadius: borderRadius.full,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  premiumText: {
    fontFamily: fonts.body.bold,
    fontSize: 11,
    color: colors.secondary.light,
    letterSpacing: 0.5,
  },
  heroWave: {
    height: 24,
    backgroundColor: colors.background.default,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: 'relative',
    zIndex: 3,
  },

  // Guest card
  guestCard: {
    margin: spacing.md,
    marginTop: spacing.lg,
    backgroundColor: '#fff',
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.card.border,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 3,
  },
  guestTitle: {
    fontSize: 20,
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

  // Menu
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
    backgroundColor: '#fff',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.card.border,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  menuRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background.cream,
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

  // Logout
  logoutRow: {
    alignItems: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.md,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary.main,
    borderRadius: borderRadius.full,
    paddingHorizontal: 24,
    paddingVertical: 10,
    gap: 8,
  },
  logoutText: {
    color: colors.primary.main,
    fontFamily: fonts.body.bold,
    fontSize: fontSize.sm,
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
