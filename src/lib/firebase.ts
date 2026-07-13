import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "semiotic-quote-c6ppv",
  appId: "1:925780309951:web:bb25cf3332fbe061ab930a",
  apiKey: "AIzaSyC3QmH6TxlBmQnd4za5Iop7BXqa2GWeZNw",
  authDomain: "semiotic-quote-c6ppv.firebaseapp.com",
  storageBucket: "semiotic-quote-c6ppv.firebasestorage.app",
  messagingSenderId: "925780309951",
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore using the designated custom database ID
export const db = getFirestore(app, "ai-studio-tooltea-35c26cb2-d562-40c6-b846-e93304e9abbc");
