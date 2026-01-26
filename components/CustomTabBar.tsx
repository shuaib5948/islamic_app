import { Ionicons } from '@expo/vector-icons';
import AnimatedTabBar, { BubbleTabBarItemConfig, TabsConfig } from '@gorhom/animated-tabbar';
import React from 'react';

const tabs: TabsConfig<BubbleTabBarItemConfig> = {
  index: {
    labelStyle: {
      color: '#2E7D32',
    },
    icon: {
      component: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
      activeColor: '#2E7D32',
      inactiveColor: '#9E9E9E',
    },
    background: {
      activeColor: 'rgba(46,125,50,0.1)',
      inactiveColor: 'rgba(46,125,50,0)',
    },
  },
  notifications: {
    labelStyle: {
      color: '#2E7D32',
    },
    icon: {
      component: ({ color, size }) => <Ionicons name="notifications" size={size} color={color} />,
      activeColor: '#2E7D32',
      inactiveColor: '#9E9E9E',
    },
    background: {
      activeColor: 'rgba(46,125,50,0.1)',
      inactiveColor: 'rgba(46,125,50,0)',
    },
  },
  settings: {
    labelStyle: {
      color: '#2E7D32',
    },
    icon: {
      component: ({ color, size }) => <Ionicons name="settings" size={size} color={color} />,
      activeColor: '#2E7D32',
      inactiveColor: '#9E9E9E',
    },
    background: {
      activeColor: 'rgba(46,125,50,0.1)',
      inactiveColor: 'rgba(46,125,50,0)',
    },
  },
};

const CustomTabBar = (props: any) => {
  return <AnimatedTabBar preset="bubble" tabs={tabs} {...props} />;
};

export default CustomTabBar;