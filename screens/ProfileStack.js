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
        name="Profil"
        component={ProfileScreen}
        options={({ title: "Profil" }, { headerShown: true })}
      />
      <Stack.Screen
        name="Pengaturan"
        component={SettingScreen}
        options={({ title: "Pengaturan" }, { headerShown: true })}
      />
    </Stack.Navigator>
  );
}
