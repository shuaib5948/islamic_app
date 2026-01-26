import { Colors } from '@/constants/theme';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // Show splash screen
  if (showSplash) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('./assets/app logo.png')} style={{ width: 120, height: 120, marginBottom: 16, resizeMode: 'contain' }} />
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: isDark ? '#FFFFFF' : '#1A1A1A', marginTop: 16 }}>RuhTrack</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <LanguageProvider>
      <Stack initialRouteName="(tabs)">
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar barStyle="default" />
    </LanguageProvider>
  );
}
