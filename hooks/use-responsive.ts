import { useEffect, useState } from 'react';
import { Dimensions, Platform, ScaledSize } from 'react-native';

const BASE_WIDTH = 375; // iPhone SE / standard mobile width
const BASE_HEIGHT = 812;

/**
 * Get responsive dimensions that update on resize (important for web & tablets).
 */
export function useResponsiveDimensions() {
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));

  useEffect(() => {
    const handler = ({ window }: { window: ScaledSize }) => {
      setDimensions(window);
    };
    const subscription = Dimensions.addEventListener('change', handler);
    return () => subscription.remove();
  }, []);

  return dimensions;
}

/**
 * Returns breakpoint info for responsive layouts.
 */
export function useBreakpoint() {
  const { width } = useResponsiveDimensions();

  const isMobileSmall = width < 360;
  const isMobile = width < 480;
  const isTablet = width >= 480 && width < 768;
  const isDesktop = width >= 768;
  const isWideDesktop = width >= 1024;

  return {
    width,
    isMobileSmall,
    isMobile,
    isTablet,
    isDesktop,
    isWideDesktop,
    // For responsive scaling: scale factor relative to base width, clamped
    scaleFactor: Math.min(Math.max(width / BASE_WIDTH, 0.8), 1.4),
  };
}

/**
 * Scale a pixel value based on screen width (relative to 375px base).
 * Useful for font sizes, paddings, widths, etc.
 * Clamped between 0.8x and 1.4x so things don't get too small or too big.
 */
export function useScaledSize() {
  const { scaleFactor } = useBreakpoint();

  return (size: number): number => {
    return Math.round(size * scaleFactor);
  };
}

/**
 * Static helper (non-hook) for places where hooks can't be used (StyleSheet.create).
 * Uses the initial window dimensions.
 */
const initialWidth = Dimensions.get('window').width;
const initialScaleFactor = Math.min(Math.max(initialWidth / BASE_WIDTH, 0.8), 1.4);

export function scale(size: number): number {
  return Math.round(size * initialScaleFactor);
}

/**
 * Returns the maximum content width for web - centers content on wide screens.
 */
export function useMaxContentWidth() {
  const { width, isDesktop } = useBreakpoint();

  if (Platform.OS !== 'web') return undefined;
  if (!isDesktop) return undefined;
  // On desktop web, limit content width to mobile-like max
  return Math.min(width, 480);
}

/**
 * Returns container style for web to center content on wide screens.
 */
export function useWebContainerStyle() {
  const maxWidth = useMaxContentWidth();
  const { isDesktop } = useBreakpoint();

  if (Platform.OS !== 'web' || !isDesktop) {
    return {};
  }

  return {
    maxWidth: maxWidth || 480,
    width: '100%' as const,
    alignSelf: 'center' as const,
  };
}

/**
 * Check if running on web platform.
 */
export const isWeb = Platform.OS === 'web';
