import axios from "axios";
import { GEMINI_API } from "@env";
import { getLatestUserData } from "../database/UserDB";
import * as FileSystem from "expo-file-system";
import { createGymScheduleTable, saveGymScheduleFromCSV } from "../database/UserDB";

const GEMINI_URL = GEMINI_API;

const generateDefaultGymSchedule = (weight, height) => {
  const schedule = [
    { day: "Monday", muscleGroup: "Chest", exercise: "Bench Press" },
    { day: "Tuesday", muscleGroup: "Back", exercise: "Pull-Ups" },
    { day: "Wednesday", muscleGroup: "Legs", exercise: "Squats" },
    { day: "Thursday", muscleGroup: "Shoulders", exercise: "Overhead Press" },
    { day: "Friday", muscleGroup: "Arms", exercise: "Bicep Curls" },
  ];

  let csvContent = "Day,Muscle Group,Exercise\n";
  schedule.forEach((entry) => {
    csvContent += `${entry.day},${entry.muscleGroup},${entry.exercise}\n`;
  });

  return csvContent;
};

export const callGeminiAPI = async (prompt) => {
  try {
    const userData = await getLatestUserData();

    if (
      !userData ||
      typeof userData.weight === "undefined" ||
      typeof userData.height === "undefined"
    ) {
      return "PROFILE_UPDATE_REQUIRED:Silakan update data berat badan dan tinggi badan Anda di profil terlebih dahulu.";
    }

    const enrichedPrompt = `Data pengguna saat ini hanya jika pengguna meminta dibuatkan jadwal Gym: Berat badan ${userData.weight} kg, Tinggi badan ${userData.height} cm. Pertanyaan pengguna: ${prompt}`;

    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [
          {
            parts: [{ text: enrichedPrompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (prompt.toLowerCase().includes("jadwal gym")) {
      const csvContent = generateDefaultGymSchedule(
        userData.weight,
        userData.height
      );
      const filePath = `${FileSystem.documentDirectory}gym_schedule.csv`;

      await FileSystem.writeAsStringAsync(filePath, csvContent);

      await createGymScheduleTable();
      await saveGymScheduleFromCSV(csvContent);

      return {
        message: "CSV file created successfully.",
        filePath,
        response: response.data,
      };
    }

    return response.data;
  } catch (error) {
    console.error(
      "API error:",
      error.response ? error.response.data : error.message
    );

    if (error.response && error.response.data && error.response.data.error) {
      return `API Error: ${error.response.data.error.message}`;
    }
    return "API_ERROR:Terjadi kesalahan saat menghubungi server API.";
  }
};
