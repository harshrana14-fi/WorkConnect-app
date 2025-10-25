import { Dimensions, PixelRatio } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive breakpoints
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
};

// Device type detection
export const isTablet = screenWidth >= BREAKPOINTS.tablet;
export const isDesktop = screenWidth >= BREAKPOINTS.desktop;
export const isLandscape = screenWidth > screenHeight;
export const isSmallScreen = screenWidth < 375;

// Responsive dimensions
export const getResponsiveWidth = (mobileWidth: number, tabletWidth?: number, desktopWidth?: number) => {
  if (isDesktop && desktopWidth) return desktopWidth;
  if (isTablet && tabletWidth) return tabletWidth;
  return mobileWidth;
};

export const getResponsiveHeight = (mobileHeight: number, tabletHeight?: number, desktopHeight?: number) => {
  if (isDesktop && desktopHeight) return desktopHeight;
  if (isTablet && tabletHeight) return tabletHeight;
  return mobileHeight;
};

// Responsive font size
export const getResponsiveFontSize = (mobileSize: number, tabletSize?: number, desktopSize?: number) => {
  if (isDesktop && desktopSize) return desktopSize;
  if (isTablet && tabletSize) return tabletSize;
  return mobileSize;
};

// Responsive padding/margin
export const getResponsiveSpacing = (mobileSpacing: number, tabletSpacing?: number, desktopSpacing?: number) => {
  if (isDesktop && desktopSpacing) return desktopSpacing;
  if (isTablet && tabletSpacing) return tabletSpacing;
  return mobileSpacing;
};

// Grid columns based on screen size
export const getGridColumns = () => {
  if (isDesktop) return 3;
  if (isTablet) return 2;
  return 1;
};

// Card width based on screen size
export const getCardWidth = () => {
  if (isDesktop) return (screenWidth - 120) / 3; // 3 columns with gaps
  if (isTablet) return (screenWidth - 60) / 2; // 2 columns with gaps
  return screenWidth - 32; // Full width with padding
};

// Container max width
export const getContainerMaxWidth = () => {
  if (isDesktop) return 1200;
  if (isTablet) return 768;
  return screenWidth;
};

// Responsive image dimensions
export const getImageDimensions = (baseWidth: number, baseHeight: number) => {
  const aspectRatio = baseHeight / baseWidth;
  const responsiveWidth = getCardWidth();
  return {
    width: responsiveWidth,
    height: responsiveWidth * aspectRatio,
  };
};

// Safe area adjustments
export const getSafeAreaPadding = () => {
  return {
    paddingTop: isLandscape ? 8 : 16,
    paddingBottom: isLandscape ? 8 : 16,
    paddingHorizontal: isTablet ? 24 : 16,
  };
};

// Typography scale
export const getResponsiveTypography = () => {
  const baseScale = isTablet ? 1.1 : 1;
  return {
    h1: 32 * baseScale,
    h2: 28 * baseScale,
    h3: 24 * baseScale,
    h4: 20 * baseScale,
    h5: 18 * baseScale,
    h6: 16 * baseScale,
    body: 16 * baseScale,
    caption: 14 * baseScale,
    small: 12 * baseScale,
  };
};

// Animation durations
export const getAnimationDuration = (baseDuration: number = 300) => {
  return isTablet ? baseDuration * 1.2 : baseDuration;
};

// Touch target sizes (accessibility)
export const getTouchTargetSize = () => {
  return isTablet ? 48 : 44; // Minimum touch target size
};

// Grid gap
export const getGridGap = () => {
  if (isDesktop) return 24;
  if (isTablet) return 16;
  return 12;
};

// Screen dimensions
export const SCREEN = {
  width: screenWidth,
  height: screenHeight,
  isTablet,
  isDesktop,
  isLandscape,
  isSmallScreen,
};

export default {
  BREAKPOINTS,
  isTablet,
  isDesktop,
  isLandscape,
  isSmallScreen,
  getResponsiveWidth,
  getResponsiveHeight,
  getResponsiveFontSize,
  getResponsiveSpacing,
  getGridColumns,
  getCardWidth,
  getContainerMaxWidth,
  getImageDimensions,
  getSafeAreaPadding,
  getResponsiveTypography,
  getAnimationDuration,
  getTouchTargetSize,
  getGridGap,
  SCREEN,
};
