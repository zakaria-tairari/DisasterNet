import React, { useState, useEffect, useContext } from "react";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";
import { AuthContext } from "../../contexts/AuthContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import Loading from "../../components/Loading";

const RegionTeams = () => {
  const { user } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.region) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, "teams"), where("region", "==", user.region));

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setTeams(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching regional teams:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (loading) return <Loading />;
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50 transition-colors">
            Regional Teams
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Dispatch and coordinate available units in your sector.
          </p>
        </div>
        <Button>Request Backup</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.length > 0 ? (
          teams.map(team => (
            <div key={team.id} className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm dark:shadow-none transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">{team.name}</h3>
                  <span className="text-xs text-slate-500 font-medium tracking-wider">{team.id}</span>
                </div>
                <StatusBadge variant={team.status === "Available" ? "success" : team.status === "On Mission" ? "warning" : "danger"}>
                  {team.status || "Unknown"}
                </StatusBadge>
              </div>
              
              <div className="space-y-2 mt-4 text-sm">
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-slate-500 dark:text-slate-400">Vehicle</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{team.vehicleType || "Standard"}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500 dark:text-slate-400">Crew Size</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{team.members?.length || 0}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                 <button className="w-full py-2 rounded-lg text-sm font-medium border border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition-colors">
                   Ping Location
                 </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors p-8 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">No Regional Units Active</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              There are currently no response teams registered to {user?.region || "your region"} in the database.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default RegionTeams;
