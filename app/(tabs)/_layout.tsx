import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#757575' : '#9E9E9E',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1E1E1E' : '#FFFFFF',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="🌙" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="📅" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="dhikr"
        options={{
          title: 'Adhkar',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="📿" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="khatam"
        options={{
          title: 'Khatam',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="📖" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          title: 'Prayer',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="🕌" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

import { Text } from 'react-native';

function TabBarIcon({ name, focused }: { name: string; color: string; focused: boolean }) {
  return (
    <Text style={{ fontSize: focused ? 26 : 22, opacity: focused ? 1 : 0.7 }}>
      {name}
    </Text>
  );
}
