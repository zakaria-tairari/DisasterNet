import React, { useState, useEffect } from "react";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import Loading from "../../components/Loading";

const AdminTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "teams"),
      (snap) => {
        setTeams(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching teams:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) return <Loading />;
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50 transition-colors">
            Team Registry
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage field response units and check global availability.
          </p>
        </div>
        <Button>+ Register Team</Button>
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
                  <span className="text-slate-500 dark:text-slate-400">Region</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{team.region}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500 dark:text-slate-400">Crew Size</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{team.members?.length || 0}</span>
                </div>
              </div>

              <button className="w-full mt-5 py-2 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Manage Unit
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-slate-500 dark:text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            No response teams registered yet.
          </div>
        )}
      </div>
    </>
  );
};

export default AdminTeams;
