import SQLite from 'expo-sqlite';

const dbPromise = SQLite.openDatabaseAsync('gymAI.db');

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

export const saveUserData = async (name, weight, height) => {
  const db = await getDBConnection();
  await db.runAsync(
    `INSERT INTO user_info (name, weight, height) VALUES (?, ?, ?);`,
    [name, parseFloat(weight), parseFloat(height)]
  );
};

export const getLatestUserData = async () => {
  const db = await getDBConnection();
  const result = await db.getFirstAsync(
    `SELECT * FROM user_info ORDER BY created_at DESC LIMIT 1;`
  );
  return result ?? null;
};