import React, { useState, useEffect, useContext } from "react";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";
import AltButton from "../../components/AltButton";
import { AuthContext } from "../../contexts/AuthContext";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import Loading from "../../components/Loading";
import { getDate } from "../../lib/firebaseGetDate";

const TeamDashboard = () => {
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
      where("assignedTeam", "==", user.teamId)
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Show only active missions
      setMissions(data.filter(m => m.status !== "Resolved"));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleUpdateStatus = async (reportId, newReportStatus, newTeamStatus) => {
    try {
      // 1. Update Report Status
      await updateDoc(doc(db, "reports", reportId), {
        status: newReportStatus
      });

      // 2. Update Team Status if provided
      if (newTeamStatus && user?.teamId) {
        await updateDoc(doc(db, "teams", user.teamId), {
          status: newTeamStatus
        });
      }
    } catch (error) {
      console.error("Error updating mission status:", error);
      alert("Failed to update status.");
    }
  };

  if (loading) return <Loading />;
  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50 transition-colors">
            Field team missions
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View active dispatches and update response statuses.
          </p>
        </div>
      </div>

      <section className="grid md:grid-cols-[1.5fr,1fr] gap-5">
        <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-100">
              Assigned reports
            </h2>

          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm dark:shadow-none transition-colors">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/90 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 text-left">Report</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Received</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {missions.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 bg-white dark:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {report.cin || report.id}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-200">
                      {report.type}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {report.region}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                      {report.createdAt ? getDate(report.createdAt) : "Just now"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge variant={report.status === 'On Site' ? 'info' : 'warning'}>
                        {report.status}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {report.status !== "On Site" && (
                          <AltButton onClick={() => handleUpdateStatus(report.id, "On Site", "On Mission")}>
                            Mark as on site
                          </AltButton>
                        )}
                        <AltButton onClick={() => handleUpdateStatus(report.id, "Resolved", "Available")}>
                          Mark as resolved
                        </AltButton>
                      </div>
                    </td>
                  </tr>
                ))}
                {missions.length === 0 && (
                   <tr>
                    <td colSpan="6" className="text-center py-6 text-slate-500 dark:text-slate-400">
                      No active missions assigned right now.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-2 text-[11px] text-slate-500 dark:text-slate-400 shadow-sm dark:shadow-none transition-colors">
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
              Status update workflow
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Team receives dispatch notification and acknowledges mission.</li>
              <li>When leaving the station, set status to &quot;Dispatched&quot;.</li>
              <li>Upon arrival, update to &quot;On site&quot; so operators can monitor.</li>
              <li>
                After helping victims and securing the area, mark the report as
                &quot;Resolved&quot;.
              </li>
            </ol>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-3 shadow-sm dark:shadow-none transition-colors">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Mission notes (for your implementation)
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              You can attach a lightweight mission report here: summary of the
              intervention, number of injured, photos, and GPS track. Store it
              in a `missions` collection related to the original report.
            </p>
            <textarea
              rows={4}
              placeholder="Add quick notes, plate numbers, victim condition, etc."
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-[13px] text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner dark:shadow-none transition-colors"
            />
            <Button>Save mission note</Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default TeamDashboard;

