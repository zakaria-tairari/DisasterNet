import React from "react";
import Input from "../components/Input";
import Button from "../components/Button";

// Public incident report page used by citizens.
// This is kept frontend-only for now, but the form
// structure and state are ready for you to connect
// to Firebase (Firestore + Cloud Functions).
const Report = () => {
  const handleSubmit = (event) => {
    event.preventDefault();

    // TODO: Replace with Firestore write (addDoc)
    // and optionally a Cloud Function to fan out
    // notifications to the right regional operator.
    // You can access form values via FormData or
    // controlled inputs.
  };

  return (
    <div className="bg-slate-950 min-h-[calc(100vh-8rem)] text-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-10 md:py-14">
        <div className="mb-8 space-y-3">
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-emerald-400">
            Citizen Incident Report
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-50">
            Report an emergency
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl">
            Your report is sent in real time to the appropriate regional
            operations center. Please provide accurate details to help teams
            respond quickly and safely.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 md:p-7 space-y-6 shadow-xl"
        >
          <div className="grid md:grid-cols-2 gap-5">
            <Input
              id="fullName"
              label="Full name"
              placeholder="e.g. Ahmed El Mansouri"
            />
            <Input
              id="cin"
              label="CIN (National ID)"
              placeholder="e.g. AA123456"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <Input
                id="phone"
                label="Phone number"
                placeholder="+212 6 12 34 56 78"
              />
              <p className="mt-1.5 text-[11px] text-slate-400">
                Used only for emergency follow‑up.
              </p>
            </div>

            <div>
              <label
                htmlFor="region"
                className="block text-sm font-medium text-slate-100 mb-1.5"
              >
                Region
              </label>
              <select
                id="region"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="" disabled >Select your region</option>
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
                htmlFor="incidentType"
                className="block text-sm font-medium text-slate-100 mb-1.5"
              >
                Incident type
              </label>
              <select
                id="incidentType"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Choose a category</option>
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
                className="block text-sm font-medium text-slate-100 mb-1.5"
              >
                What happened?
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Describe the incident, number of people impacted, visible risks, etc."
                className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              />
              <p className="mt-1.5 text-[11px] text-slate-400">
                Do not include passwords or sensitive banking information.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-100">
                Location details
              </label>
              <input
                id="location"
                placeholder="Street, city, nearest landmark"
                className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <div className="text-[11px] text-slate-400 space-y-1">
                <p>
                  In a real deployment, this section can include a map picker
                  using GPS coordinates or Google Maps / OpenStreetMap.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="flex items-start gap-2 text-[11px] text-slate-400">
              <span className="mt-1 h-4 w-4 rounded-full border border-emerald-400 text-[10px] flex items-center justify-center text-emerald-300">
                i
              </span>
              <p>
                By submitting, you confirm that the information is accurate to
                the best of your knowledge and understand it may be shared with
                emergency services.
              </p>
            </div>
            <div className="w-full md:w-auto md:min-w-55">
              <Button type="submit">Submit incident report</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Report;
