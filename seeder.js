import { db } from "./src/firebase/config.js";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const testReports = [
  {
    fullName: "Ahmed El Mansouri",
    cin: "AA123456",
    phone: "+212 6 12 34 56 78",
    region: "marrakech",
    type: "flood",
    description: "Flooding near Jemaa el-Fna, water level rising fast.",
    location: { address: "Jemaa el-Fna, Marrakech", lat: 31.6258, lng: -7.9892 },
    status: "pending",
    createdAt: serverTimestamp(),
  },
  {
    fullName: "Fatima Zahra Benali",
    cin: "BE987654",
    phone: "+212 6 98 76 54 32",
    region: "casablanca",
    type: "fire",
    description: "Building fire on Boulevard Zerktouni, 3rd floor.",
    location: { address: "Boulevard Zerktouni, Casablanca", lat: 33.5892, lng: -7.6036 },
    status: "pending",
    createdAt: serverTimestamp(),
  },
  {
    fullName: "Youssef Amrani",
    cin: "CD456789",
    phone: "+212 6 45 67 89 01",
    region: "rabat",
    type: "medical",
    description: "Elderly person collapsed near Hassan Tower.",
    location: { address: "Hassan Tower, Rabat", lat: 34.0242, lng: -6.8222 },
    status: "resolved",
    createdAt: serverTimestamp(),
  },
  {
    fullName: "Karim Tazi",
    cin: "EF112233",
    phone: "+212 6 11 22 33 44",
    region: "tangier",
    type: "traffic",
    description: "Major accident on highway A1, 2 vehicles involved.",
    location: { address: "Highway A1, Tangier", lat: 35.7595, lng: -5.8340 },
    status: "pending",
    createdAt: serverTimestamp(),
  },
  {
    fullName: "Sara Idrissi",
    cin: "GH334455",
    phone: "+212 6 33 44 55 66",
    region: "fes",
    type: "infrastructure",
    description: "Bridge crack spotted on Route Nationale 6.",
    location: { address: "Route Nationale 6, Fès", lat: 34.0181, lng: -5.0078 },
    status: "pending",
    createdAt: serverTimestamp(),
  },
  {
    fullName: "Omar Benjelloun",
    cin: "IJ556677",
    phone: "+212 6 55 66 77 88",
    region: "souss",
    type: "flood",
    description: "Oued flooding near Agadir city center.",
    location: { address: "Agadir City Center", lat: 30.4278, lng: -9.5981 },
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