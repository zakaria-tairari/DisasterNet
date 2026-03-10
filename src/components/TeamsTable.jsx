import React, { useState, useEffect, useContext } from "react";
import {
  query,
  collection,
  getDocs,
  doc,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import Button from "./Button";
import Loading from "./Loading";
import { AlertContext } from "../contexts/AlertContext";
import { getFirebaseErrorMessage } from "../lib/firebaseErrors";

const TeamsTable = ({ report }) => {
  const { setAlert } = useContext(AlertContext);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch teams in the region
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("role", "==", "team"),
          where("region", "==", report.region),
        );
        const snapshot = await getDocs(q);
        const teamList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTeams(teamList);
      } catch (err) {
        setAlert({ type: "error", message: getFirebaseErrorMessage(err.code) });
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  // Assign the selected team
  const handleAssign = async () => {
    if (!selectedTeamId) {
      setAlert({ type: "error", message: "No team selected." });
      return;
    }

    try {
      const incidentRef = doc(db, "reports", report.id);
      await updateDoc(doc(db, "users", selectedTeamId), {
        assignedIncident: incidentRef,
      });
      setAlert({ type: "success", message: "Team assigned successfully!" });
    } catch (err) {
      console.error("Error assigning team:", err);
      setAlert({ type: "error", message: "Failed to assign team." });
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <h3 className="text-xl font-semibold mb-4">Assign Team to Incident</h3>
      {teams.length === 0 ? (
        <p className="text-slate-500">No teams available in this region.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {teams.map((team) => {
            const isBusy = !!team.assignedIncident;
            const isSelected = selectedTeamId === team.id;

            return (
              <div
                key={team.id}
                className={`
        p-4 border rounded-lg transition relative
        ${isSelected ? "border-emerald-500 bg-emerald-50" : "border-slate-200"}
        ${isBusy ? "opacity-60 cursor-not-allowed bg-slate-100" : "cursor-pointer hover:border-emerald-400"}
      `}
                onClick={() => {
                  if (isBusy) return;
                  setSelectedTeamId((prev) =>
                    prev === team.id ? null : team.id,
                  );
                }}
              >
                <h4 className="font-semibold text-lg text-slate-800">
                  {team.displayName}
                </h4>
                <p>{team.type}</p>

                {isBusy && (
                  <span className="absolute top-2 right-2 text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">
                    Busy
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-center items-center mt-6">
        <Button onClick={handleAssign} disabled={!selectedTeamId}>
          Assign Team
        </Button>
      </div>
    </>
  );
};

export default TeamsTable;
