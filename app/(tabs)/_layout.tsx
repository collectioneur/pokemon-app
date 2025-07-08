import { icons } from '@/constants/icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React from 'react';


const _layout = () => {
  return (
    <Tabs screenOptions={{
    tabBarActiveTintColor: '#000000',  
    tabBarInactiveTintColor: '#555',   
    tabBarStyle: {
    height: 60,
    paddingBottom: 0,
    paddingTop: 5,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
  },
  tabBarBackground: () => (
      <LinearGradient
        colors={['#FFFD9C', '#D6BBFF']}
        style={{ flex: 1 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      />
    ),
    tabBarShowLabel: false,
  }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            const Icon = icons.home;
            return <Icon width={24} height={24} fill={color} />;
          },
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: 'Camera',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            const Icon = icons.camera;
            return <Icon width={size} height={size} fill={focused ? color : '#555'} />;
          },
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            const Icon = icons.map;
            return <Icon width={size} height={size} fill={focused ? color : '#555'} />;
          },
        }}
      />
    </Tabs>
  );
};

export default _layout