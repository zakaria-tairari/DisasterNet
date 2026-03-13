import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyD6181Lq1Uw3vLOFu4cZGBTt0Mfr13_zfY",
  authDomain: "disasternet-f2a43.firebaseapp.com",
  projectId: "disasternet-f2a43",
  storageBucket: "disasternet-f2a43.firebasestorage.app",
  messagingSenderId: "613286604605",
  appId: "1:613286604605:web:d9eb29e7a90b9bd1d75f54",
  measurementId: "G-PMEM77ZXM4",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);

if (true) {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
  connectFunctionsEmulator(functions, "localhost", 5001);
}