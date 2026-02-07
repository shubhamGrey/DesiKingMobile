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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import { colors, spacing, fontSize, borderRadius, shadows } from '../config/theme';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to exit?', [
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
        <Header title="My Account" />
        <View style={styles.guestContainer}>
          <View style={styles.guestIconCircle}>
            <Ionicons name="person-outline" size={40} color={colors.text.disabled} />
          </View>
          <Text style={styles.guestTitle}>Welcome to Agro Nexis</Text>
          <Text style={styles.guestSubtitle}>Login to view your profile and track orders</Text>
          <Button
            title="Login / Register"
            onPress={() => navigation.navigate('Login')}
            style={styles.loginButton}
          />
        </View>
      </View>
    );
  }

  const menuGroups = [
    {
      title: 'Activity',
      items: [
        { icon: 'bag-handle-outline', label: 'My Orders', onPress: () => navigation.navigate('OrderHistory') },
//        { icon: 'heart-outline', label: 'Wishlist', onPress: () => {} },
      ]
    },
    {
      title: 'Settings',
      items: [
        { icon: 'location-outline', label: 'Addresses', onPress: () => navigation.navigate('AddressBook') },
//        { icon: 'notifications-outline', label: 'Notifications', onPress: () => {} },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle-outline', label: 'Help & Support', onPress: () => navigation.navigate('Contact') },
        { icon: 'information-circle-outline', label: 'About Us', onPress: () => navigation.navigate('About') },
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title="Account Dashboard" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Modern Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: 'https://i.pravatar.cc/150' }} style={styles.avatar} />
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {/*<View style={styles.memberBadge}>
            <Ionicons name="star" size={12} color={colors.secondary.main} />
            <Text style={styles.memberText}>Premium Member</Text>
          </View>*/}
        </View>

        {/* Menu Groups */}
        {menuGroups.map((group, gIndex) => (
          <View key={gIndex} style={styles.groupContainer}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.card}>
              {group.items.map((item, iIndex) => (
                <TouchableOpacity
                  key={iIndex}
                  style={[styles.menuItem, iIndex === group.items.length - 1 && { borderBottomWidth: 0 }]}
                  onPress={item.onPress}
                >
                  <View style={styles.menuIconCircle}>
                    <Ionicons name={item.icon} size={20} color={colors.primary.main} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.text.disabled} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.error.main} />
          <Text style={styles.logoutText}>Logout from Device</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>App Version 1.0.0 (Premium)</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background.default },
  scrollContent: { paddingBottom: 40 },
  guestContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, marginTop: 100 },
  guestIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.background.muted, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  guestTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text.primary, marginBottom: 8 },
  guestSubtitle: { fontSize: 14, color: colors.text.secondary, textAlign: 'center', marginBottom: spacing.xl },
  loginButton: { paddingHorizontal: 40 },
  profileHeader: { alignItems: 'center', paddingVertical: spacing.xl },
  avatarContainer: { position: 'relative', marginBottom: spacing.md },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#fff', ...shadows.medium },
  editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.primary.main, width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#fff' },
  userName: { fontSize: 22, fontWeight: '800', color: colors.text.primary, letterSpacing: -0.5 },
  userEmail: { fontSize: 14, color: colors.text.muted, marginTop: 2 },
  memberBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 12, ...shadows.light },
  memberText: { fontSize: 11, fontWeight: '700', color: colors.text.primary, marginLeft: 6, textTransform: 'uppercase' },
  groupContainer: { paddingHorizontal: spacing.md, marginTop: spacing.lg },
  groupTitle: { fontSize: 12, fontWeight: '800', color: colors.text.muted, textTransform: 'uppercase', letterSpacing: 1, marginLeft: spacing.sm, marginBottom: 10 },
  card: { backgroundColor: '#fff', borderRadius: borderRadius.lg, overflow: 'hidden', ...shadows.light, borderWidth: 1, borderColor: '#f0f0f0' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
  menuIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.background.muted, alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text.primary },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: spacing.xl, paddingVertical: 15 },
  logoutText: { color: colors.error.main, fontWeight: '700', fontSize: 15, marginLeft: 10 },
  versionText: { textAlign: 'center', fontSize: 11, color: colors.text.disabled, marginTop: spacing.md },
});

export default ProfileScreen;
