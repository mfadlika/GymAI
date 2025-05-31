import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Button,
  Alert,
} from "react-native";
import photo from "../assets/yudha.jpeg";
import { createTable, saveUserData, getLatestUserData } from "../database/UserDB";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  useEffect(() => {
    (async () => {
      try {
        await createTable();
        await loadUserData();
      } catch (err) {
        console.error("DB Error:", err);
      }
    })();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await getLatestUserData();
      if (user && typeof user === "object") {
        setName(user.name?.toString() ?? "");
        setWeight(user.weight?.toString() ?? "");
        setHeight(user.height?.toString() ?? "");
      }
    } catch (err) {
      console.error("Gagal memuat data pengguna:", err);
    }
  };

  const handleSave = async () => {
    if (!name || !weight || !height) {
      Alert.alert("Error", "Semua field harus diisi.");
      return;
    }
    try {
      await saveUserData(name, weight, height);
      Alert.alert("Berhasil", "Data berhasil disimpan.");
    } catch (err) {
      console.error("Gagal menyimpan data:", err);
      Alert.alert("Error", "Gagal menyimpan data.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Image source={photo} style={styles.avatar} />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nama</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              placeholder="Masukkan nama"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Berat Badan (kg)</Text>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              style={styles.input}
              keyboardType="numeric"
              placeholder="Masukkan berat badan"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tinggi Badan (cm)</Text>
            <TextInput
              value={height}
              onChangeText={setHeight}
              style={styles.input}
              keyboardType="numeric"
              placeholder="Masukkan tinggi badan"
              placeholderTextColor="#999"
            />
          </View>

          <Button title="Simpan Data" onPress={handleSave} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f4f7",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 100 : 10,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#333",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#f8f8f8",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ccc",
  },
});