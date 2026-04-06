import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius } from '../../config/theme';

/**
 * variant:
 *  'default'   — plain glass surface
 *  'featured'  — gold border + gold-tinted bg
 *  'product'   — 3px gold top-bar accent
 */
const GlassCard = ({ children, variant = 'default', style }) => {
  if (variant === 'product') {
    return (
      <View style={[styles.base, styles.defaultSurface, style]}>
        <LinearGradient
          colors={[colors.secondary.main, colors.secondary.light]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.topBar}
        />
        {children}
      </View>
    );
  }

  if (variant === 'featured') {
    return (
      <View style={[styles.base, styles.featuredSurface, style]}>
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.base, styles.defaultSurface, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  defaultSurface: {
    backgroundColor: colors.glass.surface,
    borderWidth: 1,
    borderColor: colors.glass.border,
  },
  featuredSurface: {
    backgroundColor: colors.glass.gold,
    borderWidth: 1,
    borderColor: colors.glass.goldBorder,
  },
  topBar: {
    height: 3,
    width: '100%',
  },
});

export default GlassCard;
