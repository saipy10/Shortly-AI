// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "unite-b2c55.firebaseapp.com",
  databaseURL: "https://unite-b2c55-default-rtdb.firebaseio.com",
  projectId: "unite-b2c55",
  storageBucket: "unite-b2c55.firebasestorage.app",
  messagingSenderId: "652203000256",
  appId: "1:652203000256:web:f538bbcd167c1252a3c825",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
