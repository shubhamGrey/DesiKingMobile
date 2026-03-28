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
      {/* Left */}
      <View style={styles.side}>
        {showBack ? (
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Ionicons name="chevron-back" size={22} color={colors.text.primary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.logoWrap}>
            <Image
              source={require('../../../assets/DesiKing.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        )}
      </View>

      {/* Center */}
      <View style={styles.center}>
        {title ? (
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        ) : !showBack ? (
          <Text style={styles.brandTitle}>DESI KING</Text>
        ) : null}
      </View>

      {/* Right */}
      <View style={[styles.side, styles.sideRight]}>
        {rightIcon ? (
          <TouchableOpacity onPress={onRightPress} style={styles.iconBtn}>
            <Ionicons name={rightIcon} size={22} color={colors.text.primary} />
          </TouchableOpacity>
        ) : showCart ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('Cart')}
            style={styles.iconBtn}
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
    paddingTop: Platform.OS === 'ios' ? 56 : 38,
    height: Platform.OS === 'ios' ? 106 : 86,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  side: {
    width: 44,
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.paper,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
    position: 'relative',
  },
  logoWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.paper,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.3,
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.primary.main,
    letterSpacing: 2.5,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.secondary.main,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background.default,
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
  },
});

export default Header;
