import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, fontSize, borderRadius, fonts } from '../../config/theme';
import { useCart } from '../../context/CartContext';

/**
 * Main app header — two modes:
 *  - Brand mode (showBack=false): logo circle + "DESI KING" brand left, search + cart right
 *  - Back mode (showBack=true): back button left, title center, optional right action
 */
const Header = ({
  title,
  showBack = false,
  showCart = true,
  showSearch = false,
  onSearchPress,
  rightIcon,
  onRightPress,
  rightIconAccessibilityLabel = 'Action',
  subtitle,
}) => {
  const navigation = useNavigation();
  const { itemCount } = useCart();

  if (showBack) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.ghostBtn}
          accessibilityLabel="Go back"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.backTitle} numberOfLines={1}>
          {title || ''}
        </Text>

        {rightIcon ? (
          <TouchableOpacity
            onPress={onRightPress}
            style={styles.ghostBtn}
            accessibilityLabel={rightIconAccessibilityLabel}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name={rightIcon} size={22} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.ghostBtnPlaceholder} />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Brand left */}
      <View style={styles.brand}>
        <Image
          source={require('../../../assets/DesiKing.png')}
          style={styles.logoImg}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.brandName}>DESI KING</Text>
          <Text style={styles.brandSub}>
            {subtitle || 'Premium Spices · Est. 2025'}
          </Text>
        </View>
      </View>

      {/* Actions right */}
      <View style={styles.actions}>
        {showSearch && (
          <TouchableOpacity
            style={styles.ghostBtn}
            onPress={onSearchPress}
            accessibilityLabel="Search"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="search-outline" size={18} color="#fff" />
          </TouchableOpacity>
        )}
        {showCart && (
          <TouchableOpacity
            style={styles.ghostBtn}
            onPress={() => navigation.navigate('Cart')}
            accessibilityLabel="Open cart"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="cart-outline" size={18} color="#fff" />
            {itemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{itemCount > 99 ? '99+' : itemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
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
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.md + 2,
    paddingTop: Platform.OS === 'ios' ? 52 : 36,
    paddingBottom: spacing.sm + 6,
  },

  // Brand mode
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  logoImg: {
    width: 42,
    height: 42,
  },
  brandName: {
    fontFamily: fonts.heading.extrabold,
    fontSize: 21,
    color: '#fff',
    letterSpacing: 2,
    lineHeight: 24,
  },
  brandSub: {
    fontFamily: fonts.body.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
    marginTop: 1,
  },

  // Actions
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  ghostBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ghostBtnPlaceholder: {
    width: 38,
    height: 38,
  },

  // Back mode
  backTitle: {
    fontFamily: fonts.heading.bold,
    fontSize: fontSize.lg,
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },

  // Cart badge
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: colors.secondary.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: colors.primary.main,
    fontSize: 9,
    fontFamily: fonts.body.extrabold,
  },
});

export default Header;
