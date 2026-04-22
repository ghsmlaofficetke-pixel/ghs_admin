// src/utils/firebase.ts

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBrVhziOGwTUMkYdHgHAGCoJRlkyPLa6Wo",
  authDomain: "ghs-frontend.firebaseapp.com",
  projectId: "ghs-frontend",
  storageBucket: "ghs-frontend.firebasestorage.app", // ✅ FIXED
  messagingSenderId: "187477774208",
  appId: "1:187477774208:web:0f7ca51c149a656e3ebb65",
};

const app = initializeApp(firebaseConfig);

// ✅ IMPORTANT
export const storage = getStorage(app);