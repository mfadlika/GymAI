import * as SQLite from "expo-sqlite";

const dbPromise = SQLite.openDatabaseAsync("gymAI.db");

export const getDBConnection = async () => {
  return await dbPromise;
};

export const createTable = async () => {
  const db = await getDBConnection();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS user_info (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      weight REAL,
      height REAL,
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
  const lines = csvContent.trim().split('\n');
  for (let i = 1; i < lines.length; i++) {
    const [day, muscleGroup, exercise] = lines[i].split(',').map(s => s.trim());
    if (day && muscleGroup && exercise) {
      await db.runAsync(
        `INSERT INTO gym_schedule (day, muscle_group, exercise) VALUES (?, ?, ?);`,
        [day, muscleGroup, exercise]
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
