import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SplashScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }] }>
      <Text style={[styles.basmala, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>بسم الله الرحمن الرحيم</Text>
      <Text style={[styles.title, { color: isDark ? '#FFFFFF' : '#1A1A1A' }]}>RuhTrack</Text>
      <Text style={[styles.subtitle, { color: isDark ? '#B0BEC5' : '#757575' }]}>Connecting Faith & Community</Text>
      <TouchableOpacity style={styles.continueButton} onPress={() => router.replace('/(tabs)')}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  basmala: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '500',
  },
  continueButton: {
    marginTop: 40,
    backgroundColor: '#7F8F6A',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
