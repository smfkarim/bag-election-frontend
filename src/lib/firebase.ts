// lib/firebaseConfig.ts
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// paste your config from Firebase console here 👇
const firebaseConfig = {
    apiKey: "AIzaSyAQuoHc3U9fS2alhhJlhUKctWSDh5DJTY8",
    authDomain: "bag-voting.firebaseapp.com",
    databaseURL: "https://bag-voting-default-rtdb.firebaseio.com",
    projectId: "bag-voting",
    storageBucket: "bag-voting.firebasestorage.app",
    messagingSenderId: "351917869479",
    appId: "1:351917869479:web:649c5c8054609c8051ce82",
    measurementId: "G-1BF1ZJ7ZGY",
};

// prevent re-initialization on hot reloads
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getDatabase(app);
