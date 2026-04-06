import { db } from "./src/firebase/config.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const testReports = [
  {
    fullName: "Ahmed El Mansouri",
    cin: "AA123456",
    phone: "+212 6 12 34 56 78",
    region: "marrakech",
    type: "fire",
    description: "Fire in The Medina or Safi.",
    location: { address: "The Medina, Safi", lat: 32.2994, lng: -9.2372 },
    status: "pending",
    createdAt: serverTimestamp(),
  },
];

const seed = async () => {
  for (const report of testReports) {
    const doc = await addDoc(collection(db, "reports"), report);
    console.log(`Added: ${report.type} — ${report.fullName} (${doc.id})`);
  }
  console.log("Seeding complete.");
};

seed();