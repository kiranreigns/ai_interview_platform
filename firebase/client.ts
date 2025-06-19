import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDlciZya56e8i-Z6Nd5duV0wQREZmKZy7U",
  authDomain: "prepwise-59573.firebaseapp.com",
  projectId: "prepwise-59573",
  storageBucket: "prepwise-59573.firebasestorage.app",
  messagingSenderId: "100081173229",
  appId: "1:100081173229:web:c9ec781d26471bed64c2e4",
  measurementId: "G-VBRT67FMPR",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
