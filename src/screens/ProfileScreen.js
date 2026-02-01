import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/common/Header';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { colors, spacing, fontSize, borderRadius } from '../config/theme';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // Reset to MainTabs (which contains the Home screen)
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainTabs' }],
            });
          },
        },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <Header title="Profile" />
        <View style={styles.guestContainer}>
          <Ionicons name="person-circle-outline" size={80} color={colors.text.disabled} />
          <Text style={styles.guestTitle}>Welcome to Agro Nexis</Text>
          <Text style={styles.guestSubtitle}>
            Login to view your profile and orders
          </Text>
          <Button
            title="Login"
            onPress={() => navigation.navigate('Login')}
            style={styles.loginButton}
          />
        </View>
      </View>
    );
  }

  const menuItems = [
    {
      icon: 'bag-outline',
      title: 'My Orders',
      onPress: () => navigation.navigate('OrderHistory')
    },
    {
      icon: 'location-outline',
      title: 'Addresses',
      onPress: () => navigation.navigate('AddressBook')
    },
    {
      icon: 'heart-outline',
      title: 'Wishlist',
      onPress: () => {/* Future Feature */}
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      onPress: () => navigation.navigate('Contact')
    },
    {
      icon: 'information-circle-outline',
      title: 'About Us',
      onPress: () => navigation.navigate('About')
    },
  ];

  return (
    <View style={styles.container}>
      <Header title="Profile" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.firstName?.[0]?.toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {user?.mobileNumber && (
            <Text style={styles.userMobile}>{user.mobileNumber}</Text>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon} size={22} color={colors.primary.main} />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            title="Logout"
            variant="outline"
            onPress={handleLogout}
            fullWidth
          />
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.copyright}>
            © 2026 Agro Nexis India Overseas Pvt. Ltd.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  guestContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  guestTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  guestSubtitle: {
    fontSize: fontSize.md,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  loginButton: {
    paddingHorizontal: spacing.xl * 2,
  },
  profileHeader: {
    backgroundColor: colors.primary.main,
    padding: spacing.xl,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.primary.contrastText,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: fontSize.md,
    color: colors.primary.contrastText,
    opacity: 0.9,
  },
  userMobile: {
    fontSize: fontSize.sm,
    color: colors.primary.contrastText,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  menuContainer: {
    backgroundColor: colors.background.paper,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.divider,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuTitle: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.primary,
  },
  logoutContainer: {
    padding: spacing.lg,
  },
  appInfo: {
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: 0,
  },
  appVersion: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  copyright: {
    fontSize: fontSize.xs,
    color: colors.text.disabled,
    textAlign: 'center',
  },
});

export default ProfileScreen;
