import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, borderRadius, fonts } from '../../config/theme';

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

  const spinnerColor = variant === 'primary' || variant === 'secondary' || variant === 'danger'
    ? '#fff'
    : colors.primary.main;

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
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 6,
  },
  secondary: {
    backgroundColor: colors.secondary.main,
    shadowColor: colors.secondary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 6,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
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
    fontFamily: fonts.body.extrabold,
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
    paddingVertical: spacing.sm + 5,
    paddingHorizontal: spacing.lg,
    minHeight: 48,
  },
  largeSize: {
    paddingVertical: spacing.md - 1,
    paddingHorizontal: spacing.xl - 4,
    minHeight: 52,
  },

  smallLabel: { fontSize: fontSize.xs },
  mediumLabel: { fontSize: fontSize.sm },
  largeLabel: { fontSize: fontSize.md - 1 },
});

export default Button;
