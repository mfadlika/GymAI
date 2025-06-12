// filepath: /Users/fadlim/Downloads/FADLI/rifqi/screens/ProfileStack.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "./ProfileScreen";
import SettingScreen from "./SettingScreen";

const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={{ title: "Pengaturan" }}
      />
    </Stack.Navigator>
  );
}