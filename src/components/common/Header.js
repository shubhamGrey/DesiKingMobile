import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../config/theme';
import { useCart } from '../../context/CartContext';

const Header = ({ title, showBack = false, showCart = true, rightIcon, onRightPress }) => {
  const navigation = useNavigation();
  const { itemCount } = useCart();

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBack ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/DesiKing.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        )}
      </View>

      <View style={styles.centerSection}>
        {title ? (
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        ) : !showBack ? (
          <Text style={styles.brandTitle}>DESI KING</Text>
        ) : null}
      </View>

      <View style={styles.rightSection}>
        {rightIcon ? (
          <TouchableOpacity
            onPress={onRightPress}
            style={styles.actionButton}
          >
            <Ionicons name={rightIcon} size={22} color={colors.text.primary} />
          </TouchableOpacity>
        ) : showCart ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('Cart')}
            style={styles.actionButton}
          >
            <Ionicons name="cart-outline" size={22} color={colors.text.primary} />
            {itemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{itemCount > 99 ? '99+' : itemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.default,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    height: Platform.OS === 'ios' ? 110 : 90,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.light,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 4,
    ...shadows.light,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.primary.main,
    letterSpacing: 1,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.light,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.secondary.main,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
});

export default Header;
