/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#6F4B3A',
    background: '#F7F5F2',

    tint: '#90674E',
    icon: '#90674E',

    tabIconDefault: '#B9A79A',
    tabIconSelected: '#90674E',

    primary: '#90674E',
    secondary: '#B9A79A',
    accent: '#E1D7CF',

    // 🟤 All cards use brown combination
    card: '#FFFFFF',
    hadith: '#90674E',
    hadithText: '#F7F5F2',

    eventTypes: {
      religious: '#90674E',
      historic: '#B9A79A',
      birth: '#E1D7CF',
      wafat: '#6F4B3A',
    },
  },

  dark: {
    text: '#F7F5F2',
    background: '#1F1B18',

    tint: '#C4A792',
    icon: '#C4A792',

    tabIconDefault: '#8A7568',
    tabIconSelected: '#C4A792',

    primary: '#C4A792',
    secondary: '#A88D7B',
    accent: '#6F4B3A',

    // 🟤 Dark brown cards
    card: '#2D2D2D',
    hadith: '#90674E',
    hadithText: '#FFFFFF',

    eventTypes: {
      religious: '#90674E',
      historic: '#A88D7B',
      birth: '#E1D7CF',
      wafat: '#6F4B3A',
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
