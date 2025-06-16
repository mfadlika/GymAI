import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { callGeminiAPI } from "../api/api";
import * as FileSystem from "expo-file-system";
import { useTheme } from "../ThemeContext";
import { useLanguage } from "../LanguageContext";

export default function ChatScreen() {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingDots, setTypingDots] = useState("");
  const scrollViewRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = React.useState(true);

  useEffect(() => {
    let interval;
    if (isTyping) {
      let dots = "";
      interval = setInterval(() => {
        dots += ".";
        if (dots.length > 3) {
          dots = "";
        }
        setTypingDots(dots);
      }, 500);
    } else {
      setTypingDots("");
    }
    return () => clearInterval(interval);
  }, [isTyping]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    const prompt = input;
    setInput("");
    setIsTyping(true);

    try {
      const geminiResponse = await callGeminiAPI(prompt);

      if (
        typeof geminiResponse === "string" &&
        geminiResponse.startsWith("PROFILE_UPDATE_REQUIRED:")
      ) {
        const updateMessage = geminiResponse.split(":")[1];
        setMessages((prev) => [
          ...prev,
          { text: updateMessage, sender: "bot" },
        ]);
      } else if (
        typeof geminiResponse === "string" &&
        geminiResponse.startsWith("API_ERROR:")
      ) {
        const errorMessage = geminiResponse.split(":")[1];
        setMessages((prev) => [...prev, { text: errorMessage, sender: "bot" }]);
      } else if (geminiResponse?.filePath) {
        const filePath = geminiResponse.filePath;
        const csvContent = await FileSystem.readAsStringAsync(filePath);

        const formattedCSV = csvContent
          .split("\n")
          .map((line) => line.split(","))
          .map((row) => row.join(" | "))
          .join("\n");

        const successMessage = `Jadwal gym telah dibuat:\n${formattedCSV}`;
        setMessages((prev) => [
          ...prev,
          { text: successMessage, sender: "bot" },
        ]);
      } else {
        const botReply =
          geminiResponse?.candidates?.[0]?.content?.parts?.[0]?.text ??
          "Maaf, saya tidak dapat memberikan jawaban.";
        setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
      }
    } catch (error) {
      console.error("ChatScreen error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Terjadi kesalahan yang tidak terduga.", sender: "bot" },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderFormattedText = (text) => {
    const parts = text.split(/(\\*\\*.*?\\*\\*|\\*.*?\\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <Text
            key={index}
            style={{ fontWeight: "bold", color: styles.text.color }}
          >
            {part.slice(2, -2)}
          </Text>
        );
      } else if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <Text
            key={index}
            style={{ fontStyle: "italic", color: styles.text.color }}
          >
            {part.slice(1, -1)}
          </Text>
        );
      }
      return (
        <Text key={index} style={styles.text}>
          {part}
        </Text>
      );
    });
  };

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;

    const isBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    setIsAtBottom(isBottom);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isDarkMode ? "#181818" : "#f5f5f5" }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
        >
          <View style={{ flex: 1 }}>
            <ScrollView
              ref={scrollViewRef}
              style={{ flex: 1 }}
              contentContainerStyle={{ ...styles.messages }}
              keyboardShouldPersistTaps="handled"
              onScroll={handleScroll}
              scrollEventThrottle={16}
              onContentSizeChange={() => {
                if (isAtBottom || isTyping) {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }
              }}
            >
              {messages.map((msg, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.bubble,
                    msg.sender === "user"
                      ? isDarkMode
                        ? styles.userDark
                        : styles.user
                      : isDarkMode
                      ? styles.botDark
                      : styles.bot,
                  ]}
                >
                  <Text style={[styles.text, isDarkMode && { color: "#fff" }]}>
                    {/* ...renderFormattedText(msg.text) jika ada... */}
                    {msg.text}
                  </Text>
                </View>
              ))}
              {isTyping && (
                <View
                  style={[
                    styles.bubble,
                    isDarkMode ? styles.botTypingDark : styles.botTyping,
                  ]}
                >
                  <Text
                    style={[styles.typingText, isDarkMode && { color: "#bbb" }]}
                  >
                    {t("botTyping")}
                    {typingDots}
                  </Text>
                </View>
              )}
            </ScrollView>
            {/* Input */}
            <View
              style={[
                styles.inputContainer,
                isDarkMode && { backgroundColor: "transparent" },
              ]}
            >
              <TextInput
                style={[
                  styles.input,
                  isDarkMode && {
                    backgroundColor: "#232323",
                    color: "#fff",
                    borderColor: "#444",
                  },
                ]}
                value={input}
                onChangeText={setInput}
                placeholder={t("inputMessage")}
                placeholderTextColor={isDarkMode ? "#bbb" : "#888"}
              />
              <TouchableOpacity
                onPress={() => {
                  /* handleSend */
                }}
                style={[
                  styles.button,
                  isDarkMode && { backgroundColor: "#007aff" },
                ]}
              >
                <Ionicons name="send" size={22} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  messages: { padding: 10 },
  bubble: {
    maxWidth: "80%",
    padding: 10,
    marginVertical: 5,
    borderRadius: 12,
  },
  user: {
    alignSelf: "flex-end",
    backgroundColor: "#007aff",
  },
  bot: {
    alignSelf: "flex-start",
    backgroundColor: "gray",
  },
  botTyping: {
    alignSelf: "flex-start",
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  typingText: {
    color: "#505050",
    fontStyle: "italic",
  },
  text: { color: "white" },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 100 : 10,
    borderTopWidth: 0,
    backgroundColor: "transparent",
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "white",
    borderWidth: 0.3,
    borderColor: "#eee",
    borderRadius: 20,
    color: "#222",
  },
  button: {
    marginLeft: 10,
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userDark: {
    alignSelf: "flex-end",
    backgroundColor: "#007aff",
  },
  botDark: {
    alignSelf: "flex-start",
    backgroundColor: "#444",
  },
  botTypingDark: {
    alignSelf: "flex-start",
    backgroundColor: "#232323",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});
