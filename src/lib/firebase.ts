// lib/firebaseConfig.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// paste your config from Firebase console here 👇
const firebaseConfig = {
    apiKey: "AIzaSyA...",
    authDomain: "your-app.firebaseapp.com",
    databaseURL:
        "https://your-app-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "your-app",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456",
};

// prevent re-initialization on hot reloads
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getDatabase(app);
