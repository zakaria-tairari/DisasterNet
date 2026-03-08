import React, { useState, useEffect, useContext } from "react";
import ReportMap from "../../components/map/ReportMap";
import { AuthContext } from "../../contexts/AuthContext";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import Loading from "../../components/Loading";

const RegionMap = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.region) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "reports"),
      where("region", "==", user.region)
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        // Only map active reports
        setReports(data.filter(i => i.status !== "Resolved" && i.position));
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching map reports:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (loading) return <Loading />;

  // Default fallback position to Morocco center if no reports or generic region
  const defaultPosition = reports.length > 0 && reports[0].position 
    ? reports[0].position 
    : [31.7917, -7.0926];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50 transition-colors">
          Regional Report Map
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          Live GIS visualization of pending and active situations.
        </p>
        {reports.length === 0 && (
           <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/40 inline-block px-2 py-1 rounded">No active reports detected in {user?.region}.</p>
        )}
      </div>

      <ReportMap center={defaultPosition} zoom={reports.length > 0 ? 12 : 6} reports={reports} />
    </>
  );
};

export default RegionMap;
