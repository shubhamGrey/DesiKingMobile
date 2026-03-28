import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, shadows } from '../../config/theme';

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
  testID,
}) => {
  const buttonStyles = [
    styles.button,
    styles[variant],
    styles[`${size}Size`],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ];

  const labelStyles = [
    styles.label,
    styles[`${variant}Label`],
    styles[`${size}Label`],
    textStyle,
  ];

  const spinnerColor = variant === 'primary' || variant === 'secondary' ? '#fff' : colors.primary.main;

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.82}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} size="small" />
      ) : (
        <View style={styles.inner}>
          {icon && <Ionicons name={icon} size={18} color={spinnerColor} style={styles.icon} />}
          <Text style={labelStyles}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 6,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.48,
  },

  // --- Variants ---
  primary: {
    backgroundColor: colors.primary.main,
    ...shadows.light,
  },
  secondary: {
    backgroundColor: colors.secondary.main,
    ...shadows.gold,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary.main,
  },
  ghost: {
    backgroundColor: colors.background.muted,
  },
  danger: {
    backgroundColor: colors.error.main,
  },

  // --- Labels ---
  label: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  primaryLabel: { color: '#fff' },
  secondaryLabel: { color: '#fff' },
  outlineLabel: { color: colors.primary.main },
  ghostLabel: { color: colors.primary.main },
  dangerLabel: { color: '#fff' },

  // --- Sizes ---
  smallSize: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  mediumSize: {
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  largeSize: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 56,
  },

  smallLabel: { fontSize: fontSize.xs },
  mediumLabel: { fontSize: fontSize.md },
  largeLabel: { fontSize: fontSize.lg },
});

export default Button;
