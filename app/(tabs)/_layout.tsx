import { Tabs } from 'expo-router';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#757575' : '#9E9E9E',
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
        }}
      />
      <Tabs.Screen
        name="dhikr"
        options={{
          title: 'Adhkar',
        }}
      />
      <Tabs.Screen
        name="khatam"
        options={{
          title: 'Khatam',
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          title: 'Prayer',
        }}
      />
      <Tabs.Screen
        name="faraid"
        options={{
          title: 'Faraid',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}
