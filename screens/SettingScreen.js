import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { useTheme } from "../ThemeContext";

const LANGUAGES = [
  { code: "id", label: "Bahasa Indonesia" },
  { code: "en", label: "English" },
];

export default function SettingScreen() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [language, setLanguage] = useState("id");

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
        <View
          style={[
            styles.item,
            isDarkMode && styles.itemDark,
            { flexDirection: "column", alignItems: "flex-start" },
          ]}
        >
          <Text style={[styles.itemText, isDarkMode && { color: "#fff" }]}>
            Bahasa
          </Text>
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langButton,
                  language === lang.code &&
                    (isDarkMode
                      ? styles.langButtonActiveDark
                      : styles.langButtonActive),
                ]}
                onPress={() => setLanguage(lang.code)}
              >
                <Text
                  style={[
                    styles.langButtonText,
                    language === lang.code && { color: "#fff" },
                    isDarkMode && {
                      color: language === lang.code ? "#fff" : "#bbb",
                    },
                  ]}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
  langButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#bbb",
    marginRight: 10,
    backgroundColor: "#f0f4f7",
  },
  langButtonActive: {
    backgroundColor: "#007aff",
    borderColor: "#007aff",
  },
  langButtonActiveDark: {
    backgroundColor: "#444",
    borderColor: "#fff",
  },
  langButtonText: {
    fontSize: 15,
    color: "#222",
  },
});
