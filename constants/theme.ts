/**
 * WorkConnect App Theme - Unstop-inspired Design
 * Modern purple/blue gradient with clean typography
 */

import { Platform } from 'react-native';

// Unstop-inspired color palette
const primaryPurple = '#6366F1'; // Indigo-500
const primaryBlue = '#3B82F6'; // Blue-500
const accentPurple = '#8B5CF6'; // Violet-500
const lightGray = '#F8FAFC'; // Slate-50
const darkGray = '#1E293B'; // Slate-800
const successGreen = '#10B981'; // Emerald-500
const warningOrange = '#F59E0B'; // Amber-500
const errorRed = '#EF4444'; // Red-500

export const Colors = {
  light: {
    // Primary colors - Unstop style
    primary: primaryPurple,
    primaryLight: '#A5B4FC', // Indigo-300 - lighter version of primary
    secondary: primaryBlue,
    accent: accentPurple,
    
    // Background colors - Clean whites and grays
    background: '#FFFFFF',
    surface: lightGray,
    card: '#FFFFFF',
    
    // Text colors - Modern slate palette
    text: darkGray,
    textSecondary: '#64748B', // Slate-500
    textLight: '#94A3B8', // Slate-400
    
    // Status colors - Modern palette
    success: successGreen,
    warning: warningOrange,
    error: errorRed,
    info: primaryBlue,
    
    // UI elements - Subtle borders and shadows
    border: '#E2E8F0', // Slate-200
    borderLight: '#F1F5F9', // Slate-100 - lighter border
    divider: '#F1F5F9', // Slate-100
    shadow: 'rgba(99, 102, 241, 0.1)', // Purple shadow
    
    // Tab colors - Unstop style
    tabIconDefault: '#94A3B8',
    tabIconSelected: primaryPurple,
    tint: primaryPurple,
    icon: '#64748B',
    
    // Additional colors for rich media
    purple: '#8B5CF6',
    pink: '#EC4899',
    orange: '#F97316',
    teal: '#14B8A6',
    indigo: '#6366F1',
  },
  dark: {
    // Primary colors - Dark mode Unstop style
    primary: '#818CF8', // Indigo-400
    secondary: '#60A5FA', // Blue-400
    accent: '#A78BFA', // Violet-400
    
    // Background colors - Dark slate
    background: '#0F172A', // Slate-900
    surface: '#1E293B', // Slate-800
    card: '#334155', // Slate-700
    
    // Text colors - Light slate
    text: '#F8FAFC', // Slate-50
    textSecondary: '#CBD5E1', // Slate-300
    textLight: '#94A3B8', // Slate-400
    
    // Status colors - Dark mode
    success: '#34D399', // Emerald-400
    warning: '#FBBF24', // Amber-400
    error: '#F87171', // Red-400
    info: '#60A5FA', // Blue-400
    
    // UI elements - Dark borders
    border: '#475569', // Slate-600
    divider: '#334155', // Slate-700
    shadow: 'rgba(0, 0, 0, 0.3)',
    
    // Tab colors - Dark mode
    tabIconDefault: '#64748B',
    tabIconSelected: '#818CF8',
    tint: '#818CF8',
    icon: '#CBD5E1',
  },
};

export const Spacing = {
  // Unstop-inspired spacing scale
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BorderRadius = {
  // Unstop-inspired border radius
  none: 0,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  round: 50,
  full: 9999,
};

export const Typography = {
  // Unstop-inspired typography scale
  h1: {
    fontSize: 36,
    fontWeight: '700' as const,
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 30,
    fontWeight: '700' as const,
    lineHeight: 38,
    letterSpacing: -0.25,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    letterSpacing: 0,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: 0,
  },
  h5: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 26,
    letterSpacing: 0,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: 0,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0,
  },
  captionMedium: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    letterSpacing: 0,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0.25,
  },
  smallMedium: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0.25,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
