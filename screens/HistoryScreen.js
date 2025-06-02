import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal } from "react-native";
import { getDBConnection } from "../database/UserDB";
import * as SQLite from "expo-sqlite";

export default function HistoryScreen() {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    const db = await getDBConnection();
    const result = await db.getAllAsync(
      `SELECT created_at, GROUP_CONCAT(day || '|' || muscle_group || '|' || exercise || '|' || sets || '|' || reps, ';') as details
       FROM gym_schedule
       GROUP BY created_at
       ORDER BY created_at DESC`
    );
    setSchedules(result);
  };

  const handlePress = (item) => {
    const details = item.details.split(";").map((row) => {
      const [day, muscle_group, exercise, sets, reps] = row.split("|");
      return { day, muscle_group, exercise, sets, reps };
    });
    setSelectedSchedule({ created_at: item.created_at, details });
    setModalVisible(true);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
      <Text style={styles.itemText}>Jadwal dibuat: {item.created_at}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {schedules.length === 0 ? (
        <Text style={styles.text}>Belum ada riwayat</Text>
      ) : (
        <FlatList
          data={schedules}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={renderItem}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Jadwal Gym ({selectedSchedule?.created_at})</Text>
            <FlatList
              data={selectedSchedule?.details || []}
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={({ item }) => (
                <View style={styles.scheduleRow}>
                  <Text style={styles.scheduleText}>
                    {item.day} - {item.muscle_group} - {item.exercise} ({item.sets} set x {item.reps} reps)
                  </Text>
                </View>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={{ color: "#fff" }}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  text: { fontSize: 16, color: "#555" },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
    width: 320,
    backgroundColor: "#f9f9f9",
    marginVertical: 4,
    borderRadius: 8,
  },
  itemText: { fontSize: 15, color: "#222" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: 340,
    maxHeight: "80%",
  },
  modalTitle: { fontWeight: "bold", fontSize: 17, marginBottom: 10 },
  scheduleRow: { marginBottom: 6 },
  scheduleText: { fontSize: 15, color: "#333" },
  closeButton: {
    marginTop: 18,
    backgroundColor: "#007aff",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
});