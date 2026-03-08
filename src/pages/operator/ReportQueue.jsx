import React, { useState, useEffect, useContext } from "react";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";
import AltButton from "../../components/AltButton";
import { AuthContext } from "../../contexts/AuthContext";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import Loading from "../../components/Loading";
import { getDate } from "../../lib/firebaseGetDate";

const ReportQueue = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleValidate = async (reportId) => {
    try {
      await updateDoc(doc(db, "reports", reportId), {
        status: "Validated"
      });
    } catch (error) {
      console.error("Error validating report:", error);
      alert("Failed to validate report.");
    }
  };

  useEffect(() => {
    if (!user?.region) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, "reports"),
      where("region", "==", user.region),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        // Filter out resolved locally to avoid complex index requirements right now
        setReports(data.filter(i => i.status !== "Resolved"));
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching regional reports:", error);
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
            Report Triage Queue
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review and dispatch incoming regional reports.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div key={report.id} className="bg-white dark:bg-slate-900/80 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none flex flex-col md:flex-row gap-4 justify-between transition-colors hover:border-emerald-500/50 dark:hover:border-emerald-500/50">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <StatusBadge variant={report.status === 'Dispatched' ? 'safe' : 'warning'}>
                    {report.status || "Pending Review"}
                  </StatusBadge>
                  <span className="text-slate-500 text-xs font-medium">
                    {report.createdAt ? getDate(report.createdAt) : "Just now"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{report.type}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">ID: <span className="text-slate-800 dark:text-slate-300 font-medium">{report.id}</span></p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Reporter CIN: {report.cin || "Anonymous"}</p>
              </div>

              <div className="flex items-end gap-2 md:flex-col md:justify-center w-full md:w-auto mt-4 md:mt-0">
                {report.status === "pending" && (
                  <AltButton onClick={() => handleValidate(report.id)} style="w-full text-xs">Validate</AltButton>
                )}
                {report.status === "Validated" && (
                  <Button style="w-full text-xs bg-emerald-600 hover:bg-emerald-700">Assign Team</Button>
                )}
                <AltButton style="w-full text-xs">Verify Data</AltButton>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">No active reports in {user?.region || "your region"} right now.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ReportQueue;
