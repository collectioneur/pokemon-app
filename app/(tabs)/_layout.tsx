import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { Camera, House, Map } from "lucide-react-native";
import React from "react";

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#000000",
        tabBarInactiveTintColor: "#555",
        tabBarStyle: {
          height: 60,
          paddingBottom: 0,
          paddingTop: 5,
          backgroundColor: "transparent",
          borderTopWidth: 0,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={["#FFFD9C", "#D6BBFF"]}
            style={{ flex: 1 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
        ),
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <House
                width={size}
                height={size}
                color={focused ? "#000000ff" : "#00000077"}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Camera",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Camera
                width={size}
                height={size}
                color={focused ? "#000000ff" : "#00000077"}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Map
                width={size}
                height={size}
                color={focused ? "#000000ff" : "#00000077"}
              />
            );
          },
        }}
      />
    </Tabs>
  );
};

export default _layout;
