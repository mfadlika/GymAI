import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import ChatScreen from "./screens/ChatScreen";
import HistoryScreen from "./screens/HistoryScreen";
import ProfileStack from "./screens/ProfileStack";
import { ThemeProvider, useTheme } from "./ThemeContext";

const { width } = Dimensions.get("window");
const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
  const { t } = useLanguage();
  const currentRoute = state.routes[state.index];
  const nestedRoutes = currentRoute.state?.routes;
  const nestedIndex = currentRoute.state?.index;
  const nestedRouteName =
    nestedRoutes && typeof nestedIndex === "number"
      ? nestedRoutes[nestedIndex].name
      : null;

  if (currentRoute.name === "Profil" && nestedRouteName === "Setting") {
    return null;
  }

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const iconName = {
          Chat: "chatbubbles-outline",
          Riwayat: "time-outline",
          Profil: "person-outline",
        }[route.name];

        const label = {
          Chat: t("chat"),
          Riwayat: t("history"),
          Profil: t("profile"),
        }[route.name];

        const onPress = () => {
          if (!isFocused) navigation.navigate(route.name);
        };

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            onPress={onPress}
            style={styles.tab}
          >
            <Ionicons
              name={iconName}
              size={24}
              color={isFocused ? "#007aff" : "#888"}
            />
            <Text
              style={{ color: isFocused ? "#007aff" : "#888", fontSize: 12 }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function AppContainer() {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();

  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: isDarkMode ? "#232323" : "#fff",
          },
          headerTintColor: isDarkMode ? "#fff" : "#222",
        }}
      >
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{ title: t("chat") }}
        />
        <Tab.Screen
          name="Riwayat"
          component={HistoryScreen}
          options={{ title: t("history") }}
        />
        <Tab.Screen
          name="Profil"
          component={ProfileStack}
          options={{ headerShown: false, title: t("profile") }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContainer />
      </LanguageProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 40,
    left: width * 0.15,
    right: width * 0.15,
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 30,
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 15,
    elevation: 10,
  },
  tab: {
    alignItems: "center",
    flex: 1,
  },
});
