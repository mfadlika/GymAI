# GymAI 🏋️‍♂️

A mobile personal trainer app powered by Google's Gemini API. Built with React Native and Expo.

## 📱 Features

- Chatbot AI untuk panduan gym menggunakan Gemini API
- UI responsif berbasis React Native
- Penyimpanan data pengguna lokal dengan SQLite
- .env untuk keamanan API key

## 📦 Tech Stack

- React Native + Expo
- Gemini API (Google Generative Language API)
- SQLite (local database)

## 🚀 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/mfadlika/GymAI.git
cd GymAI/MobileApp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Buat file .env di root folder dan masukkan API Gemini 2.0 Flash
```bash
GEMINI_API=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=your_actual_api_key_here
```

### 4. Run App
```bash
npx expo start
```

## Project Structure

```
MobileApp/
├── api/               # API call to Gemini
├── assets/            # Images, fonts, etc
├── database/          # SQLite config
├── dokumentasi/       # Documentation
├── screens/           # App screens
├── .env               # Environment variables
├── App.js             # Entry point
├── app.json
├── babel.config.js
├── index.js           # Index file
├── package.json
└── README.md
```

## 👨‍💻 Author

- [Fadli M](https://github.com/mfadlika)
- [Yudha R A](https://github.com/YudhaRizkyAbdullah)
- [Rifqi A G](https://github.com/rifqialghani2)
