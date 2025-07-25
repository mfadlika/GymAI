import { createStackNavigator } from "@react-navigation/stack";
import { useLanguage } from "../LanguageContext";
import { useTheme } from "../ThemeContext";
import ProfileScreen from "./ProfileScreen";
import SettingScreen from "./SettingScreen";

const Stack = createStackNavigator();

export default function ProfileStack() {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: t("profile"),
          headerShown: true,
          headerStyle: {
            backgroundColor: isDarkMode ? "#232323" : "#fff",
          },
          headerTintColor: isDarkMode ? "#fff" : "#222",
        }}
      />
      <Stack.Screen
        name="Setting" // <-- ini nama screen
        component={SettingScreen}
        options={{
          title: t("settings"),
          headerStyle: {
            backgroundColor: isDarkMode ? "#232323" : "#fff",
          },
          headerTintColor: isDarkMode ? "#fff" : "#222",
        }}
      />
    </Stack.Navigator>
  );
}
