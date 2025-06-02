import axios from "axios";
import { GEMINI_API } from "@env";
import { getLatestUserData } from "../database/UserDB";

const GEMINI_URL = GEMINI_API;

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

    const enrichedPrompt = `Data pengguna saat ini: Berat badan ${userData.weight} kg, Tinggi badan ${userData.height} cm. Pertanyaan pengguna: ${prompt}`;

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
