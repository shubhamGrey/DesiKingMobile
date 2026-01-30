import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, fontSize } from '../../config/theme';
import { useCart } from '../../context/CartContext';

const Header = ({ title, showBack = false, showCart = true }) => {
  const navigation = useNavigation();
  const { itemCount } = useCart();

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBack ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
            testID="header-back-btn"
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary.contrastText} />
          </TouchableOpacity>
        ) : (
          <Image
            source={{ uri: 'https://www.agronexis.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FAgroNexisWhite.2e4065d9.png&w=384&q=75' }}
            style={styles.logo}
            resizeMode="contain"
          />
        )}
      </View>

      <View style={styles.centerSection}>
        {title && <Text style={styles.title}>{title}</Text>}
      </View>

      <View style={styles.rightSection}>
        {showCart && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Cart')}
            style={styles.iconButton}
            testID="header-cart-btn"
          >
            <Ionicons name="cart-outline" size={24} color={colors.primary.contrastText} />
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
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    paddingTop: 50, // Safe area
    borderBottomWidth: 0.5,
    borderBottomColor: '#b36a26',
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
  logo: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.primary.contrastText,
  },
  iconButton: {
    padding: spacing.xs,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.secondary.main,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Header;
