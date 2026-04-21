// DesiKing — Full Redesign Theme
export const colors = {
  primary: {
    main: '#1f4f40',
    light: '#2d6a58',
    dark: '#14382b',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#c9975a',
    light: '#e8c080',
    dark: '#a07040',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#fff9f2',      // ivory — screen background
    paper: '#FFFFFF',        // cards, modals
    dark: '#1f4f40',         // header / hero areas (brand green)
    muted: 'rgba(31,79,64,0.03)',
    subtle: 'rgba(31,79,64,0.015)',
    cream: '#fdf0e0',        // section tints, image areas
    warm: '#fffcf8',         // bottom nav, login card
  },
  card: {
    surface: '#FFFFFF',
    border: 'rgba(31,79,64,0.09)',
    shadow: 'rgba(31,79,64,0.07)',
    muted: '#fdf0e0',
  },
  text: {
    primary: '#1a0a00',
    secondary: '#5c3d2e',
    muted: '#b09080',
    light: '#FFFFFF',
    disabled: '#d4c0b0',
    inverse: '#FFFFFF',
  },
  border: 'rgba(31,79,64,0.09)',
  divider: 'rgba(31,79,64,0.07)',
  success: '#2E8B57',
  warning: '#E8A838',
  error: {
    main: '#D94F3D',
    light: '#F07167',
    dark: '#B03226',
  },
  gradient: {
    primaryStart: '#1f4f40',
    primaryEnd: '#2d6a58',
    goldStart: '#c9975a',
    goldEnd: '#e8c080',
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
  hero: 52,
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
  // Neuton — for headings, product names, hero text, prices
  heading: {
    regular: 'Neuton_400Regular',
    italic: 'Neuton_400Regular_Italic',
    bold: 'Neuton_700Bold',
    extrabold: 'Neuton_800ExtraBold',
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
    shadowColor: '#c9975a',
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
  button: {
    shadowColor: '#1f4f40',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 16,
    elevation: 6,
  },
};

// Category → gradient color map for product card top bars
export const CATEGORY_COLORS = {
  'Powdered Spices': ['#c9923a', '#E8B84B'],
  'Ground Spices':   ['#c9923a', '#E8B84B'],
  'Whole Spices':    ['#c0392b', '#e04020'],
  'Blends':          ['#1f4f40', '#2d6a58'],
  'Seeds':           ['#8b6914', '#c9950a'],
  'Masalas':         ['#1f4f40', '#2d6a58'],
};
export const CATEGORY_COLORS_DEFAULT = ['#1f4f40', '#2d6a58'];

export default {
  colors,
  spacing,
  fontSize,
  fontWeight,
  fonts,
  borderRadius,
  shadows,
  CATEGORY_COLORS,
  CATEGORY_COLORS_DEFAULT,
};
