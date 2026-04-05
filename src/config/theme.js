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
    default: '#0a1628',
    paper: '#0d1e3d',
    dark: '#060d1a',
    muted: 'rgba(255,255,255,0.05)',
    subtle: 'rgba(255,255,255,0.03)',
  },
  glass: {
    surface: 'rgba(255,255,255,0.07)',
    surfaceStrong: 'rgba(255,255,255,0.12)',
    border: 'rgba(255,255,255,0.12)',
    borderStrong: 'rgba(255,255,255,0.20)',
    gold: 'rgba(188,129,65,0.08)',
    goldBorder: 'rgba(188,129,65,0.35)',
    overlay: 'rgba(6,13,26,0.85)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255,255,255,0.75)',
    muted: 'rgba(255,255,255,0.45)',
    light: '#FFFFFF',
    disabled: 'rgba(255,255,255,0.25)',
  },
  border: 'rgba(255,255,255,0.12)',
  divider: 'rgba(255,255,255,0.08)',
  success: '#34C759',
  warning: '#FF9F0A',
  error: {
    main: '#FF3B30',
    light: '#FF6961',
    dark: '#C0392B',
  },
  // Gradient stop helpers
  gradient: {
    primaryStart: '#0d1e3d',
    primaryEnd: '#0a1628',
    goldStart: '#BC8141',
    goldEnd: '#d4a265',
    darkStart: '#0d1e3d',
    darkEnd: '#0a1628',
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

// Font families — loaded via @expo-google-fonts in App.js
export const fonts = {
  // Playfair Display — for headings, product names, hero text, prices
  heading: {
    regular: 'PlayfairDisplay_400Regular',
    semibold: 'PlayfairDisplay_600SemiBold',
    bold: 'PlayfairDisplay_700Bold',
    extrabold: 'PlayfairDisplay_800ExtraBold',
    black: 'PlayfairDisplay_900Black',
  },
  // Inter — for body text, labels, buttons, UI elements
  body: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    extrabold: 'Inter_800ExtraBold',
  },
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
  fonts,
  borderRadius,
  shadows,
};