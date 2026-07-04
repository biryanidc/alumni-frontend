import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCgHF9UIMdJrBYMDBNhjKVQTOeAWqUH5k0",
  authDomain: "alumniconnect-fd4a5.firebaseapp.com",
  projectId: "alumniconnect-fd4a5",
  storageBucket: "alumniconnect-fd4a5.firebasestorage.app",
  messagingSenderId: "634554057798",
  appId: "1:634554057798:web:7337559e5b05e0a10cf647"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and Firestore so the rest of your app can use them
export const auth = getAuth(app);
export const db = getFirestore(app);