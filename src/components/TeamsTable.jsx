import React, { useState, useEffect, useContext } from "react";
import {
  query,
  collection,
  doc,
  where,
  runTransaction,
  onSnapshot,
  getDoc,
  serverTimestamp,
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

const TYPE_ICONS = {
  flood: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-waves-icon lucide-waves"
    >
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    </svg>
  ),
  fire: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-flame-icon lucide-flame"
    >
      <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />
    </svg>
  ),
  medical: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-heart-pulse-icon lucide-heart-pulse"
    >
      <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
      <path d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
    </svg>
  ),
  traffic: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-traffic-cone-icon lucide-traffic-cone"
    >
      <path d="M16.05 10.966a5 2.5 0 0 1-8.1 0" />
      <path d="m16.923 14.049 4.48 2.04a1 1 0 0 1 .001 1.831l-8.574 3.9a2 2 0 0 1-1.66 0l-8.574-3.91a1 1 0 0 1 0-1.83l4.484-2.04" />
      <path d="M16.949 14.14a5 2.5 0 1 1-9.9 0L10.063 3.5a2 2 0 0 1 3.874 0z" />
      <path d="M9.194 6.57a5 2.5 0 0 0 5.61 0" />
    </svg>
  ),
  infrastructure: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-building2-icon lucide-building-2"
    >
      <path d="M10 12h4" />
      <path d="M10 8h4" />
      <path d="M14 21v-3a2 2 0 0 0-4 0v3" />
      <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
      <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
    </svg>
  ),
  other: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-triangle-alert-icon lucide-triangle-alert"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  ),
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
          setAlert({ type: "error", message: "Team no longer exists." });
          return;
        }

        if (teamSnap.data().assignedIncident) {
          setAlert({
            type: "error",
            message: "Team was just assigned to another incident.",
          });
          return;
        }

        transaction.update(teamRef, { assignedIncident: incidentRef });
        transaction.update(incidentRef, {
          assignedTeam: teamRef,
          status: "dispatched",
          dispatchedAt: serverTimestamp(),
        });
      });

      setAlert({ type: "success", message: "Team assigned successfully!" });
      setSelectedTeamId(null);
    } catch (err) {
      console.error("Error assigning team:", err);
      setAlert({
        type: "error",
        message: err.code ?? "Failed to assign team.",
      });
    }
  };

  if (loading)
    return (
      <div className="h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
    );

  const availableTypes = [...new Set(teams.map((t) => t.type).filter(Boolean))];

  const teamsToShow = filter
    ? teams.filter((team) => team.type === filter)
    : teams;

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
              {availableTypes.map((type) => (
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
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-500/20 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-500/30">
                      {TYPE_ICONS[team.type] ?? TYPE_ICONS.other}
                    </div>
                    <div className="min-w-0">
                      <p className="text-slate-800 text-md dark:text-slate-100 font-semibold truncate">
                        {team.displayName} - {team.email}
                      </p>
                      <p className="text-slate-600 text-sm dark:text-slate-300 truncate">
                        {TYPE_MAP[team.type]}
                      </p>
                    </div>
                  </div>

                  {isBusy && (
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
