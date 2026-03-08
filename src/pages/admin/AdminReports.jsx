import React, { useState, useEffect } from "react";
import StatusBadge from "../../components/StatusBadge";
import AltButton from "../../components/AltButton";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/config";
import { getDate } from "../../lib/firebaseGetDate";
import Loading from "../../components/Loading";

const AdminReports = () => {
  const mockNationalReports = [
    { id: "INC-2024-001", type: "Medical Emergency", position: [33.5731, -7.5898] }, // Casa
    { id: "INC-2024-002", type: "Fire Hazard", position: [34.0208, -6.8416] }, // Rabat
    { id: "INC-2024-003", type: "Structural Collapse", position: [31.6295, -8.0360] }, // Marrakech
    { id: "INC-2024-004", type: "Flood Warning", position: [35.7595, -5.8340] }, // Tangier
  ];

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

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

    return () => unsubscribe();
  }, []);

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
            placeholder="Search ID or Region..."
            className="w-full md:w-auto px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/90 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4">ID / Citizen</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Region</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Timeline</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {reports.length > 0 ? (
              reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  <td className="px-6 py-4">
                    <p>{report.cin || "Anonymous"}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{report.type}</td>
                  <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{report.region}</td>
                  <td className="px-6 py-4">
                    <StatusBadge variant={report.status === 'resolved' ? 'success' : report.status === 'dispatched' ? 'safe' : 'warning'}>
                      {report.status}
                    </StatusBadge>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                    {report.createdAt ? getDate(report.createdAt) : "Just now"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <AltButton style="text-xs py-1.5">View Details</AltButton>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-500">No reports found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminReports;
