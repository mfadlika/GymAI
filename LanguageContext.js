import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

const translations = {
  id: {
    settings: "Pengaturan",
    darkMode: "Mode Gelap",
    language: "Bahasa",
    profile: "Profil",
    chat: "Chat",
    history: "Riwayat",
    save: "Simpan Data",
    name: "Nama",
    weight: "Berat Badan (kg)",
    height: "Tinggi Badan (cm)",
    inputName: "Masukkan nama",
    inputWeight: "Masukkan berat badan",
    inputHeight: "Masukkan tinggi badan",
    trainingDays: "Preferensi Hari Latihan",
    noHistory: "Belum ada riwayat",
    scheduleHistory: "Riwayat Jadwal Gym",
    inputMessage: "Ketik pesan...",
    botTyping: "Bot sedang mengetik",
    senin: "Sen",
    selasa: "Sel",
    rabu: "Rab",
    kamis: "Kam",
    jumat: "Jum",
    sabtu: "Sab",
    minggu: "Min",
  },
  en: {
    settings: "Settings",
    darkMode: "Dark Mode",
    language: "Language",
    profile: "Profile",
    chat: "Chat",
    history: "History",
    save: "Save Data",
    name: "Name",
    weight: "Weight (kg)",
    height: "Height (cm)",
    inputName: "Enter name",
    inputWeight: "Enter weight",
    inputHeight: "Enter height",
    trainingDays: "Training Days Preference",
    noHistory: "No history yet",
    scheduleHistory: "Gym Schedule History",
    inputMessage: "Type a message...",
    botTyping: "Bot is typing",
    senin: "Mon",
    selasa: "Tue",
    rabu: "Wed",
    kamis: "Thu",
    jumat: "Fri",
    sabtu: "Sat",
    minggu: "Sun",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("id");
  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
