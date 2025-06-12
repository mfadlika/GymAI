import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import ChatScreen from "./screens/ChatScreen";
import HistoryScreen from "./screens/HistoryScreen";
import ProfileStack from "./screens/ProfileStack";

const { width } = Dimensions.get("window");
const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }) {
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
              {route.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Riwayat" component={HistoryScreen} />
        <Tab.Screen
          name="Profil"
          component={ProfileStack}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
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
