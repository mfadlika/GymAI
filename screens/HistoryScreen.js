import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  getAllChatHistory,
  getDBConnection,
  getLatestUserData,
  updateUserDaysPreference,
} from "../database/UserDB";
import { useLanguage } from "../LanguageContext";
import { useTheme } from "../ThemeContext";

export default function HistoryScreen() {
  const { isDarkMode } = useTheme();
  const { t } = useLanguage();
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    fetchSchedules();
    fetchUserId();
    fetchChatHistory();
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

  const fetchUserId = async () => {
    const user = await getLatestUserData();
    if (user) setUserId(user.id);
  };

  const fetchChatHistory = async () => {
    const result = await getAllChatHistory();
    setChatHistory(result);
  };

  const handlePress = (item) => {
    const details = item.details.split(";").map((row) => {
      const [day, muscle_group, exercise, sets, reps] = row.split("|");
      return { day, muscle_group, exercise, sets, reps };
    });
    setSelectedSchedule({ created_at: item.created_at, details });
    setModalVisible(true);
  };

  const handleSavePreference = async () => {
    if (!selectedSchedule || !userId) return;
    const daysInSchedule = selectedSchedule.details.map((d) =>
      d.day.toLowerCase()
    );
    const hariPref = {
      senin: daysInSchedule.includes("monday") ? 1 : 0,
      selasa: daysInSchedule.includes("tuesday") ? 1 : 0,
      rabu: daysInSchedule.includes("wednesday") ? 1 : 0,
      kamis: daysInSchedule.includes("thursday") ? 1 : 0,
      jumat: daysInSchedule.includes("friday") ? 1 : 0,
      sabtu: daysInSchedule.includes("saturday") ? 1 : 0,
      minggu: daysInSchedule.includes("sunday") ? 1 : 0,
    };
    await updateUserDaysPreference(userId, hariPref);
    Alert.alert("Berhasil", "Preferensi hari berhasil disimpan ke profil!");
    setModalVisible(false);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
      <View style={styles.itemHeader}>
        <Ionicons
          name="calendar-outline"
          size={22}
          color="#007aff"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.itemText}>Jadwal dibuat: </Text>
        <Text style={styles.itemDate}>{item.created_at}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#888" />
    </TouchableOpacity>
  );

  return (
    <View
      style={{ flex: 1, backgroundColor: isDarkMode ? "#181818" : "#f5f5f5" }}
    >
      {schedules.length === 0 ? (
        <View style={styles.emptyBox}>
          <Ionicons name="time-outline" size={48} color="#bbb" />
          <Text style={styles.text}>{t("noHistory")}</Text>
        </View>
      ) : (
        <FlatList
          data={schedules}
          keyExtractor={(_, idx) => idx.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              <Ionicons name="barbell-outline" size={20} color="#007aff" />{" "}
              Jadwal Gym
            </Text>
            <Text style={styles.modalDate}>{selectedSchedule?.created_at}</Text>
            <ScrollView style={{ marginTop: 10, marginBottom: 10 }}>
              {selectedSchedule?.details?.map((item, idx) => (
                <View key={idx} style={styles.scheduleCard}>
                  <View style={styles.scheduleRow}>
                    <Ionicons
                      name="fitness-outline"
                      size={18}
                      color="#007aff"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.scheduleDay}>{item.day}</Text>
                    <Text style={styles.scheduleMuscle}>
                      {" "}
                      | {item.muscle_group}
                    </Text>
                  </View>
                  <Text style={styles.scheduleExercise}>
                    {item.exercise}{" "}
                    <Text style={styles.setReps}>
                      ({item.sets} set x {item.reps} reps)
                    </Text>
                  </Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSavePreference}
            >
              <Ionicons name="save-outline" size={18} color="#fff" />
              <Text
                style={{ color: "#fff", marginLeft: 6, fontWeight: "bold" }}
              >
                Jadikan Preferensi Hari
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={18} color="#fff" />
              <Text
                style={{ color: "#fff", marginLeft: 6, fontWeight: "bold" }}
              >
                Tutup
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa", paddingTop: 24 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    alignSelf: "center",
    marginBottom: 12,
    letterSpacing: 1,
  },
  emptyBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  text: { fontSize: 16, color: "#888", marginTop: 8 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  itemHeader: { flexDirection: "row", alignItems: "center" },
  itemText: { fontSize: 15, color: "#222", fontWeight: "500" },
  itemDate: { fontSize: 13, color: "#007aff", marginLeft: 4 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 16,
    width: 360,
    maxHeight: "80%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#007aff",
    marginBottom: 2,
    alignSelf: "center",
  },
  modalDate: {
    fontSize: 13,
    color: "#888",
    marginBottom: 10,
    alignSelf: "center",
  },
  scheduleCard: {
    backgroundColor: "#f1f7ff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#007aff",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  scheduleDay: {
    fontWeight: "bold",
    color: "#007aff",
    fontSize: 15,
  },
  scheduleMuscle: {
    fontSize: 14,
    color: "#444",
    marginLeft: 2,
  },
  scheduleExercise: {
    fontSize: 15,
    color: "#222",
    marginLeft: 26,
    marginTop: 2,
  },
  setReps: {
    color: "#888",
    fontSize: 13,
    fontStyle: "italic",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#007aff",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  saveButton: {
    marginTop: 6,
    backgroundColor: "#28b463",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
});
