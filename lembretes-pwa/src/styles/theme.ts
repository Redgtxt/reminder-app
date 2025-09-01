export const colors = {
  // Primary Colors (Azul da imagem)
  primary: '#4F9EFF', // Azul dos botões da imagem
  primaryLight: '#7BB3FF',
  primaryDark: '#2E7FE6',
  
  // Secondary Colors
  secondary: '#6B7280', // Cinza médio
  secondaryLight: '#9CA3AF',
  secondaryDark: '#4B5563',
  
  // Status Colors
  success: '#10B981', // Green
  successLight: '#34D399',
  successDark: '#059669',
  
  warning: '#F59E0B', // Amber
  warningLight: '#FBBF24',
  warningDark: '#D97706',
  
  error: '#EF4444', // Red
  errorLight: '#F87171',
  errorDark: '#DC2626',
  
  // Dark Theme Colors (baseado na imagem)
  background: '#1A1A1A', // Fundo escuro da imagem
  surface: '#2A2A2A', // Cards cinza escuro
  surfaceSecondary: '#353535', // Variação mais clara
  
  // Text Colors (invertidas para tema escuro)
  textPrimary: '#FFFFFF', // Texto branco
  textSecondary: '#D1D5DB', // Cinza claro
  textTertiary: '#9CA3AF', // Cinza médio
  textInverse: '#1A1A1A', // Texto escuro para fundos claros
  
  // Border Colors (para tema escuro)
  border: '#404040',
  borderLight: '#505050',
  borderDark: '#303030',
  
  // Shadow (para tema escuro)
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowLight: 'rgba(0, 0, 0, 0.2)',
  shadowDark: 'rgba(0, 0, 0, 0.5)',
};

export const typography = {
  // Font Families
  fontFamily: {
    primary: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    secondary: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  
  // Font Sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  
  // Font Weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const layout = {
  // Container widths
  container: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
  
  // Common dimensions
  headerHeight: 60,
  tabBarHeight: 80,
  buttonHeight: 48,
  inputHeight: 48,
  cardMinHeight: 80,
};

// Responsive breakpoints
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

// Animation durations
export const animations = {
  fast: 150,
  normal: 300,
  slow: 500,
};

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
  breakpoints,
  animations,
};
