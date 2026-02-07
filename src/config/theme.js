// Modern Premium Theme inspired by high-end e-commerce templates
export const colors = {
  primary: {
    main: '#1f4f40', // Agro Nexis Forest Green
    light: '#2d6a58',
    dark: '#14382b',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#BC8141', // Modern Golden Brown (from the cookie app images)
    light: '#d4a373',
    dark: '#8b5e34',
    contrastText: '#FFFFFF',
  },
  accent: {
    cream: '#F5EFE1', // Warm cream background
    softWhite: '#FFFFFF',
    lightGray: '#F8F8F8',
  },
  background: {
    default: '#F5EFE1', // Warm background from the template
    paper: '#FFFFFF',
    dark: '#1A1A1A',
  },
  text: {
    primary: '#1A1A1A',
    secondary: '#4A4A4A',
    muted: '#8E8E93',
    light: '#FFFFFF',
  },
  border: '#E5E5EA',
  success: '#34C759',
  error: '#FF3B30',
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
  xxl: 32, // Large bold headings like the cookie app
  xxxl: 40,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24, // High corner radius for that modern "bubble" look
  xl: 32,
  full: 9999,
};

export const shadows = {
  light: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
  },
  dark: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
};

export default {
  colors,
  spacing,
  fontSize,
  borderRadius,
  shadows,
};
