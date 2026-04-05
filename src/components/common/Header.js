import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, fontSize, borderRadius, fonts } from '../../config/theme';
import { useCart } from '../../context/CartContext';

const Header = ({ title, showBack = false, showCart = true, rightIcon, onRightPress, rightIconAccessibilityLabel = 'Action' }) => {
  const navigation = useNavigation();
  const { itemCount } = useCart();

  return (
    <LinearGradient
      colors={['#1B4D3E', '#234F42']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      {/* Left */}
      <View style={styles.side}>
        {showBack ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconBtn}
            accessibilityLabel="Go back"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>
        ) : (
          <View style={styles.logoWrap}>
            <Image
              source={require('../../../assets/AgroNexisWhite.png')}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Agro Nexis logo"
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
          <TouchableOpacity
            onPress={onRightPress}
            style={styles.iconBtn}
            accessibilityLabel={rightIconAccessibilityLabel}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name={rightIcon} size={22} color="#fff" />
          </TouchableOpacity>
        ) : showCart ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('Cart')}
            style={styles.iconBtn}
            accessibilityLabel="Open cart"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="cart-outline" size={22} color="#fff" />
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    paddingTop: Platform.OS === 'ios' ? 56 : 38,
    height: Platform.OS === 'ios' ? 106 : 86,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
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
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoWrap: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    backgroundColor: 'rgba(255,255,255,0.12)',
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: fontSize.lg,
    fontFamily: fonts.heading.bold,
    color: '#fff',
    letterSpacing: -0.3,
  },
  brandTitle: {
    fontSize: 15,
    fontFamily: fonts.body.extrabold,
    color: '#fff',
    letterSpacing: 2.5,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.accent.orange,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1B4D3E',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: fonts.body.extrabold,
  },
});

export default Header;
