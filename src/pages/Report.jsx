import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Alert from "../components/Alert";
import { getFirebaseErrorMessage } from "../lib/firebaseErrors";

const Report = () => {
  const [fullName, setFullName] = useState("");
  const [cin, setCin] = useState("");
  const [phone, setPhone] = useState("");
  const [region, setRegion] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [geoLocation, setGeoLocation] = useState("");
  const [alert, setAlert] = useState({ type: "success", message: "" });
  const [locating, setLocating] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setAlert({
        type: "error",
        message: "Geolocation is not supported by your browser.",
      });
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          );
          const data = await res.json();
          setGeoLocation(data.display_name ?? `${latitude}, ${longitude}`);
        } catch {
          setGeoLocation(`${latitude}, ${longitude}`);
        } finally {
          setLocating(false);
        }
      },
      () => {
        setAlert({
          type: "error",
          message: "Unable to retrieve your location.",
        });
        setLocating(false);
      },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !cin || !phone || !region || !type || !geoLocation) {
      setAlert({ type: "error", message: "(*) fields are required" });
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "reports"), {
        fullName,
        cin,
        phone,
        region,
        type,
        description,
        location: {
          address: geoLocation,
          lat: coordinates.lat,
          lng: coordinates.lng,
        },
        status: "pending",
        createdAt: serverTimestamp(),
      });
      setAlert({ type: "success", message: "Report report submitted." });
      console.log("Document added : ID - " + docRef.id);
    } catch (error) {
      setAlert({
        type: "error",
        message: getFirebaseErrorMessage(message.code),
      });
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-[calc(100vh-8rem)] text-slate-800 dark:text-slate-50 transition-colors duration-300">
      <Alert
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert((prev) => ({ ...prev, message: "" }))}
      />
      <div className="max-w-4xl mx-auto px-4 py-10 md:py-14">
        <div className="mb-8 space-y-3">
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-emerald-400">
            Citizen Report Report
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 transition-colors">
            Report an emergency
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl transition-colors">
            Your report is sent in real time to the appropriate regional
            operations center. Please provide accurate details to help teams
            respond quickly and safely.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-7 space-y-6 shadow-xl dark:shadow-none transition-colors duration-300"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <Input
              id="fullName"
              label="Full name*"
              placeholder="e.g. Ahmed El Mansouri"
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
            />
            <Input
              id="cin"
              label="CIN (National ID)*"
              placeholder="e.g. AA123456"
              onChange={(e) => setCin(e.target.value)}
              value={cin}
            />
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <Input
                id="phone"
                label="Phone number*"
                placeholder="+212 6 12 34 56 78"
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
              />
              <p className="mt-1.5 text-[11px] text-slate-400">
                Used only for emergency follow‑up.
              </p>
            </div>

            <div>
              <label
                htmlFor="region"
                className="block text-sm font-medium text-slate-700 dark:text-slate-100 mb-1.5 transition-colors"
              >
                Region*
              </label>
              <select
                id="region"
                className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors shadow-sm"
                onChange={(e) => setRegion(e.target.value)}
                value={region}
              >
                <option value="" disabled>
                  Select your region
                </option>
                <option value="casablanca">Casablanca‑Settat</option>
                <option value="rabat">Rabat‑Salé‑Kénitra</option>
                <option value="marrakech">Marrakech‑Safi</option>
                <option value="tangier">Tanger‑Tétouan‑Al Hoceïma</option>
                <option value="oriental">L&apos;Oriental</option>
                <option value="fes">Fès‑Meknès</option>
                <option value="beni-mellal">Béni Mellal‑Khénifra</option>
                <option value="souss">Souss‑Massa</option>
                <option value="guelmim">Guelmim‑Oued Noun</option>
                <option value="laayoune">Laâyoune‑Sakia El Hamra</option>
                <option value="dakhla">Dakhla‑Oued Ed Dahab</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="reportType"
                className="block text-sm font-medium text-slate-700 dark:text-slate-100 mb-1.5 transition-colors"
              >
                Report type*
              </label>
              <select
                id="reportType"
                className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors shadow-sm"
                onChange={(e) => setType(e.target.value)}
                value={type}
              >
                <option value="" disabled>
                  Choose a category
                </option>
                <option value="flood">Flood</option>
                <option value="fire">Fire</option>
                <option value="traffic">Traffic accident</option>
                <option value="medical">Medical emergency</option>
                <option value="infrastructure">Infrastructure damage</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-[2fr,1fr] gap-5">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700 dark:text-slate-100 mb-1.5 transition-colors"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
              >
                What happened?
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Describe the report, number of people impacted, visible risks, etc."
                className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none transition-colors shadow-sm"
              />
              <p className="mt-1.5 text-[11px] text-slate-400">
                Do not include passwords or sensitive banking information.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-100 transition-colors">
                Location*
              </label>
              <input
                id="location"
                placeholder="Street, city, nearest landmark"
                className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors shadow-sm"
                onChange={(e) => setGeoLocation(e.target.value)}
                value={geoLocation}
              />
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={locating}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-emerald-500 text-emerald-400 text-sm font-medium hover:bg-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {locating ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Locating…
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
                      <path d="M12 8a4 4 0 100 8 4 4 0 000-8z" />
                    </svg>
                    Use my location
                  </>
                )}
              </button>
              <p className="text-[11px] text-slate-400">
                Click to auto-fill your GPS position, or type it manually.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 transition-colors">
            <div className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="mt-1 h-6 w-8 rounded-full border border-emerald-400 text-[12px] flex items-center justify-center text-emerald-300">
                i
              </span>
              <p>
                By submitting, you confirm that the information is accurate to
                the best of your knowledge and understand it may be shared with
                emergency services.
              </p>
            </div>
            <div className="w-full md:w-auto md:min-w-55">
              <Button type="submit">Submit report report</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Report;
