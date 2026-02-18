import { Colors } from '@/constants/theme';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { isWeb } from '@/hooks/use-responsive';
import { injectWebStyles } from '@/utils/web-styles';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Platform, StatusBar, Text, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

// Inject global web CSS on load
injectWebStyles();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Shorter splash on web
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, isWeb ? 2000 : 4000);
    return () => clearTimeout(timer);
  }, []);

  // Inject viewport meta tag for mobile web responsiveness
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      // Ensure viewport meta exists
      let viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
        document.head.appendChild(viewport);
      }
      viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');

      // Set body/html styles for proper mobile web display
      document.documentElement.style.height = '100%';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.height = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.backgroundColor = colors.background;

      // Add theme-color meta
      let themeColor = document.querySelector('meta[name="theme-color"]');
      if (!themeColor) {
        themeColor = document.createElement('meta');
        themeColor.setAttribute('name', 'theme-color');
        document.head.appendChild(themeColor);
      }
      themeColor.setAttribute('content', colors.background);

      // Add web app capable meta tags
      let appleMeta = document.querySelector('meta[name="apple-mobile-web-app-capable"]');
      if (!appleMeta) {
        appleMeta = document.createElement('meta');
        appleMeta.setAttribute('name', 'apple-mobile-web-app-capable');
        appleMeta.setAttribute('content', 'yes');
        document.head.appendChild(appleMeta);
      }

      let statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
      if (!statusBarMeta) {
        statusBarMeta = document.createElement('meta');
        statusBarMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
        statusBarMeta.setAttribute('content', 'default');
        document.head.appendChild(statusBarMeta);
      }
    }
  }, [isDark, colors.background]);

  // Show splash screen
  if (showSplash) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('./assets/app_logo.png')} resizeMode="contain" style={{ width: 120, height: 120, marginBottom: 16 }} />
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: isDark ? '#FFFFFF' : '#1A1A1A', marginTop: 16 }}>RuhTrack</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <LanguageProvider>
      <View style={{
        flex: 1,
        backgroundColor: colors.background,
        ...(isWeb ? {
          maxWidth: 500,
          width: '100%',
          alignSelf: 'center',
          // Use boxShadow on web for subtle frame effect
          boxShadow: '0 0 20px rgba(0,0,0,0.1)',
        } as any : {}),
      }}>
        <Stack initialRouteName="(tabs)">
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </View>
      <StatusBar barStyle="default" />
    </LanguageProvider>
  );
}
