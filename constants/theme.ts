/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#5F6D4E',
    background: '#F4F1EC',
    tint: '#7F8F6A',
    icon: '#7F8F6A',
    tabIconDefault: '#9EAD8A',
    tabIconSelected: '#7F8F6A',
    primary: '#7F8F6A',
    secondary: '#9EAD8A',
    accent: '#E8E2D8',
    card: '#FFFFFF',
    hadith: '#7F8F6A',
    hadithText: '#F4F1EC',
    eventTypes: {
      religious: '#7F8F6A', // Main olive sage
      historic: '#6B7F5A',  // Darker olive
      birth: '#8FA67A',     // Lighter olive
      wafat: '#5A6B4A',     // Darkest olive
    },
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: '#7F8F6A',
    secondary: '#9EAD8A',
    accent: '#E8E2D8',
    card: '#1E1E1E',
    hadith: '#1E3A5F',
    hadithText: '#FFFFFF',
    eventTypes: {
      religious: '#7F8F6A', // Main olive sage
      historic: '#6B7F5A',  // Darker olive
      birth: '#8FA67A',     // Lighter olive
      wafat: '#5A6B4A',     // Darkest olive
    },
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
