import React from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { useTheme } from "../ThemeContext";

export default function SettingScreen() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <View
      style={[styles.container, isDarkMode && { backgroundColor: "#181818" }]}
    >
      <View style={styles.list}>
        <View style={[styles.item, isDarkMode && styles.itemDark]}>
          <Text style={[styles.itemText, isDarkMode && { color: "#fff" }]}>
            Mode Gelap
          </Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            thumbColor={isDarkMode ? "#fff" : "#222"}
            trackColor={{ false: "#bbb", true: "#444" }}
          />
        </View>
        <TouchableOpacity style={[styles.item, isDarkMode && styles.itemDark]}>
          <Text style={[styles.itemText, isDarkMode && { color: "#fff" }]}>
            Notifikasi
          </Text>
          <Text style={[styles.itemValue, isDarkMode && { color: "#bbb" }]}>
            Aktif
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.item, isDarkMode && styles.itemDark]}>
          <Text style={[styles.itemText, isDarkMode && { color: "#fff" }]}>
            Tentang Aplikasi
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f7",
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    alignSelf: "center",
    marginBottom: 16,
  },
  list: {
    backgroundColor: "transparent",
    marginHorizontal: 0,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  itemDark: {
    backgroundColor: "#232323",
    borderColor: "#333",
  },
  itemText: {
    fontSize: 16,
    color: "#222",
  },
  itemValue: {
    fontSize: 15,
    color: "#888",
  },
});
