import React, { useState, useEffect, useContext } from "react";
import StatusBadge from "../../components/StatusBadge";
import { getDate } from "../../lib/firebaseGetDate";
import { AuthContext } from "../../contexts/AuthContext";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import Loading from "../../components/Loading";

const MissionHistory = () => {
  const { user } = useContext(AuthContext);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.teamId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "reports"),
      where("assignedTeam", "==", user.teamId),
      where("status", "==", "resolved"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMissions(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching mission history:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (loading) return <Loading />;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50 transition-colors">
          Mission History
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Archive of your past interventions and resolutions.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/90 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4">Report ID</th>
              <th className="px-6 py-4">Context</th>
              <th className="px-6 py-4">Date Resolved</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Time on Site</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {missions.length > 0 ? (
              missions.map((mission) => (
                <tr key={mission.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{mission.id}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{mission.type}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {mission.createdAt ? getDate(mission.createdAt) : "Unknown Date"}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge variant="success">{mission.status}</StatusBadge>
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300 text-right font-medium">
                    {/* Placeholder for actual duration math if added to schema later */}
                    --
                  </td>
                </tr>
              ))
            ) : (
               <tr>
                <td colSpan="5" className="text-center py-8 text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  No resolved missions archived for this team yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MissionHistory;
