// Modern Premium Theme — Agro Nexis / Desi King
export const colors = {
  primary: {
    main: '#1f4f40',
    light: '#2d6a58',
    dark: '#14382b',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#BC8141',
    light: '#d4a265',
    dark: '#8b5e2e',
    contrastText: '#FFFFFF',
  },
  accent: {
    cream: '#F5EFE1',
    softWhite: '#FFFFFF',
    lightGray: '#F4F4F6',
    saffron: '#F5A623',
    turmeric: '#E8B84B',
    orange: '#E85D04',
  },
  background: {
    default: '#FAFAF9',
    paper: '#FFFFFF',
    dark: '#0D1B15',
    muted: '#EEE8DC',
    subtle: '#FAF7F2',
  },
  text: {
    primary: '#1A1A1A',
    secondary: '#4A4A4A',
    muted: '#8E8E93',
    light: '#FFFFFF',
    disabled: '#C7C7CC',
  },
  border: '#E5E5EA',
  divider: '#EBEBEF',
  success: '#34C759',
  warning: '#FF9F0A',
  error: {
    main: '#FF3B30',
    light: '#FF6961',
    dark: '#C0392B',
  },
  // Gradient stop helpers
  gradient: {
    primaryStart: '#2d6a58',
    primaryEnd: '#1f4f40',
    goldStart: '#d4a265',
    goldEnd: '#BC8141',
    darkStart: '#1A2E26',
    darkEnd: '#0D1B15',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSize = {
  tiny: 10,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
  hero: 44,
};

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 36,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: '#1f4f40',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  light: {
    shadowColor: '#1f4f40',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  medium: {
    shadowColor: '#1f4f40',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  dark: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  gold: {
    shadowColor: '#BC8141',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
};

export default {
  colors,
  spacing,
  fontSize,
  fontWeight,
  borderRadius,
  shadows,
};