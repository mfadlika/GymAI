import axios from "axios";
import { GEMINI_API } from "@env";
import {
  getLatestUserData,
  getLatestUserDaysPreference,
} from "../database/UserDB";
import * as FileSystem from "expo-file-system";
import {
  createGymScheduleTable,
  saveGymScheduleFromCSV,
} from "../database/UserDB";

const GEMINI_URL = GEMINI_API;

const generateDefaultGymSchedule = (weight, height) => {
  const schedule = [
    {
      day: "Monday",
      details: [
        { muscleGroup: "Chest", exercise: "Bench Press", sets: 3, reps: 5 },
        {
          muscleGroup: "Chest",
          exercise: "Incline Dumbbell Press",
          sets: 3,
          reps: 8,
        },
        { muscleGroup: "Triceps", exercise: "Tricep Dips", sets: 3, reps: 10 },
      ],
    },
    {
      day: "Tuesday",
      details: [
        { muscleGroup: "Back", exercise: "Pull-Ups", sets: 3, reps: 8 },
        { muscleGroup: "Back", exercise: "Barbell Row", sets: 3, reps: 8 },
        { muscleGroup: "Biceps", exercise: "Barbell Curl", sets: 3, reps: 10 },
      ],
    },
    {
      day: "Wednesday",
      details: [
        { muscleGroup: "Legs", exercise: "Squats", sets: 4, reps: 6 },
        { muscleGroup: "Legs", exercise: "Leg Press", sets: 3, reps: 10 },
        { muscleGroup: "Calves", exercise: "Calf Raise", sets: 3, reps: 15 },
      ],
    },
    {
      day: "Thursday",
      details: [
        {
          muscleGroup: "Shoulders",
          exercise: "Overhead Press",
          sets: 3,
          reps: 8,
        },
        {
          muscleGroup: "Shoulders",
          exercise: "Lateral Raise",
          sets: 3,
          reps: 12,
        },
        { muscleGroup: "Traps", exercise: "Shrugs", sets: 3, reps: 12 },
      ],
    },
    {
      day: "Friday",
      details: [
        { muscleGroup: "Arms", exercise: "Bicep Curls", sets: 3, reps: 10 },
        { muscleGroup: "Arms", exercise: "Tricep Pushdown", sets: 3, reps: 10 },
        { muscleGroup: "Forearms", exercise: "Wrist Curl", sets: 3, reps: 15 },
      ],
    },
  ];

  let csvContent = "Day,Muscle Group,Exercise,Sets,Reps\n";
  schedule.forEach((entry) => {
    entry.details.forEach((detail) => {
      csvContent += `${entry.day},${detail.muscleGroup},${detail.exercise},${detail.sets},${detail.reps}\n`;
    });
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

    // Deteksi permintaan jadwal gym
    const isGymScheduleRequest =
      prompt.toLowerCase().includes("jadwal gym") ||
      prompt.toLowerCase().includes("gym schedule") ||
      prompt.toLowerCase().includes("buatkan jadwal");

    let enrichedPrompt = `Data pengguna saat ini: Berat badan ${userData.weight} kg, Tinggi badan ${userData.height} cm, Preferensi hari: Senin ${userData.senin}, Selasa ${userData.selasa}, Rabu ${userData.rabu}, Kamis ${userData.kamis}, Jumat ${userData.jumat}, Sabtu ${userData.sabtu}, Minggu ${userData.minggu}.`;
    if (isGymScheduleRequest) {
      enrichedPrompt +=
        "\n\nBalas dengan penjelasan singkat dan juga lampirkan jadwal gym dalam format CSV (header: Day,Muscle Group,Exercise,Sets,Reps).";
    }
    enrichedPrompt += `\n\nPertanyaan pengguna: ${prompt}`;

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

    if (isGymScheduleRequest) {

      let csvContent = null;
      let explanation = null;

      if (
        response.data &&
        response.data.candidates &&
        response.data.candidates[0] &&
        response.data.candidates[0].content &&
        response.data.candidates[0].content.parts &&
        response.data.candidates[0].content.parts[0] &&
        typeof response.data.candidates[0].content.parts[0].text === "string"
      ) {
        const aiText = response.data.candidates[0].content.parts[0].text;
        // Pisahkan penjelasan dan CSV jika ada
        const csvIndex = aiText.indexOf("Day,Muscle Group,Exercise,Sets,Reps");
        if (csvIndex !== -1) {
          explanation = aiText.substring(0, csvIndex).trim();
          csvContent = aiText.substring(csvIndex).trim();
        } else {
          explanation = aiText;
        }
      }

      if (!csvContent) {
        csvContent = generateDefaultGymSchedule(
          userData.weight,
          userData.height
        );
      }
      const filePath = `${FileSystem.documentDirectory}gym_schedule.csv`;
      await FileSystem.writeAsStringAsync(filePath, csvContent);
      await createGymScheduleTable();
      await saveGymScheduleFromCSV(csvContent);
      return {
        message: "CSV file created successfully.",
        filePath,
        explanation,
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
