import * as SQLite from "expo-sqlite";

const dbPromise = SQLite.openDatabaseAsync("gymAI.db");

export const getDBConnection = async () => {
  return await dbPromise;
};

export const createTable = async () => {
  const db = await getDBConnection();
  await db.execAsync(`DROP TABLE IF EXISTS user_info;`);
  await db.execAsync(`DROP TABLE IF EXISTS gym_schedule;`);

  // Recreate tables
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS user_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      weight REAL,
      height REAL,
      senin INTEGER DEFAULT 1,
      selasa INTEGER DEFAULT 1,
      rabu INTEGER DEFAULT 1,
      kamis INTEGER DEFAULT 1,
      jumat INTEGER DEFAULT 1,
      sabtu INTEGER DEFAULT 0,
      minggu INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS gym_schedule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day TEXT,
      muscle_group TEXT,
      exercise TEXT,
      sets INTEGER,
      reps INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const createGymScheduleTable = async () => {
  const db = await getDBConnection();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS gym_schedule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day TEXT,
      muscle_group TEXT,
      exercise TEXT,
      sets INTEGER,
      reps INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const saveUserData = async (name, weight, height) => {
  const db = await getDBConnection();
  await db.runAsync(
    `INSERT INTO user_info (name, weight, height) VALUES (?, ?, ?);`,
    [name, parseFloat(weight), parseFloat(height)]
  );
};

export const saveGymScheduleFromCSV = async (csvContent) => {
  const db = await getDBConnection();
  const lines = csvContent.trim().split("\n");
  for (let i = 1; i < lines.length; i++) {
    const [day, muscleGroup, exercise, sets, reps] = lines[i]
      .split(",")
      .map((s) => s.trim());
    if (day && muscleGroup && exercise && sets && reps) {
      await db.runAsync(
        `INSERT INTO gym_schedule (day, muscle_group, exercise, sets, reps) VALUES (?, ?, ?, ?, ?);`,
        [day, muscleGroup, exercise, parseInt(sets), parseInt(reps)]
      );
    }
  }
};

export const getLatestUserData = async () => {
  const db = await getDBConnection();
  const result = await db.getFirstAsync(
    `SELECT * FROM user_info ORDER BY created_at DESC LIMIT 1;`
  );
  return result ?? null;
};

export const clearGymSchedule = async () => {
  const db = await getDBConnection();
  await db.execAsync(`DELETE FROM gym_schedule;`);
};

// Fungsi untuk update preferensi hari
export const updateUserDaysPreference = async (id, days) => {
  const db = await getDBConnection();
  await db.runAsync(
    `UPDATE user_info SET 
      senin = ?, selasa = ?, rabu = ?, kamis = ?, jumat = ?, sabtu = ?, minggu = ?
     WHERE id = ?`,
    [
      days.senin ? 1 : 0,
      days.selasa ? 1 : 0,
      days.rabu ? 1 : 0,
      days.kamis ? 1 : 0,
      days.jumat ? 1 : 0,
      days.sabtu ? 1 : 0,
      days.minggu ? 1 : 0,
      id,
    ]
  );
};

// Fungsi untuk mendapatkan preferensi hari user terbaru
export const getLatestUserDaysPreference = async () => {
  const db = await getDBConnection();
  const result = await db.getFirstAsync(
    `SELECT senin, selasa, rabu, kamis, jumat, sabtu, minggu FROM user_info ORDER BY created_at DESC LIMIT 1;`
  );
  return (
    result ?? {
      senin: 1,
      selasa: 1,
      rabu: 1,
      kamis: 1,
      jumat: 1,
      sabtu: 0,
      minggu: 0,
    }
  );
};

import React, { useEffect, useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

export default function ProfileScreen() {
  const [days, setDays] = useState({
    senin: true,
    selasa: true,
    rabu: true,
    kamis: true,
    jumat: true,
    sabtu: false,
    minggu: false,
  });
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    (async () => {
      const user = await getLatestUserData();
      if (user) setUserId(user.id);
      const pref = await getLatestUserDaysPreference();
      setDays({
        senin: !!pref.senin,
        selasa: !!pref.selasa,
        rabu: !!pref.rabu,
        kamis: !!pref.kamis,
        jumat: !!pref.jumat,
        sabtu: !!pref.sabtu,
        minggu: !!pref.minggu,
      });
    })();
  }, []);

  const toggleDay = async (day) => {
    const newDays = { ...days, [day]: !days[day] };
    setDays(newDays);
    if (userId) await updateUserDaysPreference(userId, newDays);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Preferensi Hari Latihan</Text>
      {Object.entries(days).map(([day, value]) => (
        <View key={day} style={styles.row}>
          <Text style={styles.label}>
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </Text>
          <Switch value={value} onValueChange={() => toggleDay(day)} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  title: { fontWeight: "bold", fontSize: 18, marginBottom: 16 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  label: { fontSize: 16 },
});
