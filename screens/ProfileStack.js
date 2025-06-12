import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "./ProfileScreen";
import SettingScreen from "./SettingScreen";
import { useTheme } from "../ThemeContext";

const Stack = createStackNavigator();

export default function ProfileStack() {
  const { isDarkMode } = useTheme();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profil"
        component={ProfileScreen}
        options={{
          title: "Profil",
          headerShown: true,
          headerStyle: {
            backgroundColor: isDarkMode ? "#232323" : "#fff",
          },
          headerTintColor: isDarkMode ? "#fff" : "#222",
        }}
      />
      <Stack.Screen
        name="Pengaturan"
        component={SettingScreen}
        options={{
          title: "Pengaturan",
          headerStyle: {
            backgroundColor: isDarkMode ? "#232323" : "#fff",
          },
          headerTintColor: isDarkMode ? "#fff" : "#222",
        }}
      />
    </Stack.Navigator>
  );
}
