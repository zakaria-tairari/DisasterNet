import React, { useState, useEffect } from "react";
import StatusBadge from "../../components/StatusBadge";
import AltButton from "../../components/AltButton";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/config";
import Loading from "../../components/Loading";
import ReportsTable from "../../components/ReportsTable";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const q = query(collection(db, "reports"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setReports(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching reports:", error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const handleFilter = (e) => {
    setFilter(e.target.value);
  }

  const reportsToShow = !filter ? reports 
  : reports.filter(report => report.type.toLowerCase().includes(filter.toLowerCase()) || report.region.toLowerCase().includes(filter.toLowerCase()));

  if (loading) return <Loading />;

  return (
    <>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50 transition-colors">
            All Reports
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Global overview of all reports across Morocco.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search Type or Region..."
            className="w-full md:w-auto px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors shadow-sm"
            onChange={handleFilter}
            value={filter}
          />
        </div>
      </div>

      <ReportsTable reports={reportsToShow} />
    </>
  );
};

export default AdminReports;
