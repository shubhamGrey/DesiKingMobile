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
    default: '#FAFAF8',       // warm near-white
    paper: '#FFFFFF',         // cards, modals
    dark: '#1f4f40',          // header / hero areas (brand green)
    muted: 'rgba(0,0,0,0.03)',
    subtle: 'rgba(0,0,0,0.015)',
    cream: '#F5EFE1',         // section tints
  },
  // Glass tokens — kept for any overlay components
  glass: {
    surface: 'rgba(255,255,255,0.85)',
    surfaceStrong: 'rgba(255,255,255,0.95)',
    border: 'rgba(0,0,0,0.08)',
    borderStrong: 'rgba(0,0,0,0.14)',
    gold: 'rgba(188,129,65,0.08)',
    goldBorder: 'rgba(188,129,65,0.30)',
    overlay: 'rgba(6,13,26,0.82)',
  },
  // Card surface token
  card: {
    surface: '#FFFFFF',
    border: 'rgba(0,0,0,0.07)',
    shadow: 'rgba(31,79,64,0.08)',
    muted: '#F7F3ED',         // warm tinted card (e.g. featured)
  },
  text: {
    primary: '#1C1409',       // warm near-black
    secondary: '#6B5F55',     // warm medium gray
    muted: '#ABA39A',         // soft muted
    light: '#FFFFFF',
    disabled: '#C8C0B8',
    inverse: '#FFFFFF',
  },
  border: 'rgba(0,0,0,0.08)',
  divider: 'rgba(0,0,0,0.06)',
  success: '#2E8B57',
  warning: '#E8A838',
  error: {
    main: '#D94F3D',
    light: '#F07167',
    dark: '#B03226',
  },
  // Gradient stop helpers
  gradient: {
    primaryStart: '#1f4f40',
    primaryEnd: '#2d6a58',
    goldStart: '#BC8141',
    goldEnd: '#d4a265',
    darkStart: '#0d2b22',
    darkEnd: '#1f4f40',
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 5,
  },
  dark: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  gold: {
    shadowColor: '#BC8141',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 12,
    elevation: 6,
  },
  card: {
    shadowColor: '#1f4f40',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
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
