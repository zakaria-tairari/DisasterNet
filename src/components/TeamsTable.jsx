import React, { useState, useEffect, useContext } from "react";
import {
  query,
  collection,
  doc,
  where,
  runTransaction,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import Button from "./Button";
import { AlertContext } from "../contexts/AlertContext";
import { getFirebaseErrorMessage } from "../lib/firebaseErrors";

const TYPE_MAP = {
  fire: "Firefighting Unit",
  flood: "Civil Protection Unit",
  medical: "Medical Unit",
  traffic: "Traffic Police Unit",
  infrastructure: "Public Works Unit",
  other: "General Response Unit",
};

const TeamsTable = ({ report }) => {
  const { setAlert } = useContext(AlertContext);
  const [teams, setTeams] = useState([]);
  const [resolvedIncidents, setResolvedIncidents] = useState({});
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      where("role", "==", "team"),
      where("region", "==", report.region),
    );

    const unsubscribe = onSnapshot(
      q,
      async (snap) => {
        const teamList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setTeams(teamList);
        setLoading(false);

        // Resolve assignedIncident references for busy teams
        const busyTeams = teamList.filter((t) => !!t.assignedIncident);
        const resolved = {};

        await Promise.all(
          busyTeams.map(async (team) => {
            try {
              const incidentSnap = await getDoc(team.assignedIncident);
              if (incidentSnap.exists()) {
                resolved[team.id] = incidentSnap.data();
              }
            } catch {
              // reference broken or permission denied — skip silently
            }
          }),
        );

        setResolvedIncidents(resolved);
      },
      (error) => {
        setAlert({
          type: "error",
          message: getFirebaseErrorMessage(error.code),
        });
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const handleAssign = async () => {
    if (!selectedTeamId) {
      setAlert({ type: "error", message: "No team selected." });
      return;
    }

    try {
      const incidentRef = doc(db, "reports", report.id);
      const teamRef = doc(db, "users", selectedTeamId);

      await runTransaction(db, async (transaction) => {
        const teamSnap = await transaction.get(teamRef);

        if (!teamSnap.exists()) {
          setAlert({type: "error", message:"Team no longer exists."});
          return;
        }

        if (teamSnap.data().assignedIncident) {
          setAlert({type: "error", message:"Team was just assigned to another incident."});
          return;
        }

        transaction.update(teamRef, { assignedIncident: incidentRef });
        transaction.update(incidentRef, { assignedTeam: teamRef, status: "dispatched" });
      });

      setAlert({ type: "success", message: "Team assigned successfully!" });
      setSelectedTeamId(null);
    } catch (err) {
      console.error("Error assigning team:", err);
      setAlert({ type: "error", message: err.code ?? "Failed to assign team." });
    }
  };

  if (loading)
    return (
      <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
    );


  const availableTypes = [
    ...new Set(teams.map((t) => t.type).filter(Boolean)),
  ];

  const teamsToShow = filter ? teams.filter(team => team.type === filter) : teams;

  return (
    <>
      {teams.length === 0 ? (
        <p className="text-slate-500">No teams available in this region.</p>
      ) : (
        <>
          <div className="mb-6">
            <select
              defaultValue=""
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="">All Types</option>
              {availableTypes
                .map((type) => (
                  <option key={type} value={type}>
                    {TYPE_MAP[type] ?? type}
                  </option>
                ))}
            </select>
          </div>
          <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
            {teamsToShow.map((team) => {
              const isBusy = !!team.assignedIncident;
              const isSelected = selectedTeamId === team.id;
              const incident = resolvedIncidents[team.id];

              return (
                <div
                  key={team.id}
                  onClick={() => {
                    if (isBusy) return;
                    setSelectedTeamId((prev) =>
                      prev === team.id ? null : team.id,
                    );
                  }}
                  className={`
                  p-4 border rounded-lg transition relative
                  ${isSelected ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30" : "border-slate-200 dark:border-slate-700"}
                  ${isBusy ? "opacity-70 cursor-not-allowed bg-slate-100 dark:bg-slate-800" : "cursor-pointer hover:border-emerald-400"}
                `}
                >
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                    {team.displayName} - {team.email}
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400">
                    {TYPE_MAP[team.type]}
                  </p>

                  {isBusy ? (
                    <div className="mt-2 space-y-1">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                        <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                        Busy
                      </span>
                      {incident ? (
                        <div className="text-sm text-slate-500 dark:text-slate-400 space-y-0.5">
                          <p>
                            →{" "}
                            <span className="capitalize font-medium">
                              {incident.type}
                            </span>
                          </p>
                          <p className="truncate text-slate-400">
                            {incident.description}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">
                          Loading incident...
                        </p>
                      )}
                    </div>
                  ) : (
                    isSelected && (
                      <span className="absolute top-2 right-2 text-sm font-semibold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-1 rounded">
                        Selected
                      </span>
                    )
                  )}
                </div>
              );
            })}
          </div>
        </>
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
