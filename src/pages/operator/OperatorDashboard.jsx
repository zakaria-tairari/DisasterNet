import React, { useState, useEffect, useContext } from "react";
import MetricCard from "../../components/MetricCard";
import StatusBadge from "../../components/StatusBadge";
import AltButton from "../../components/AltButton";
import Button from "../../components/Button";
import { AuthContext } from "../../contexts/AuthContext";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import Loading from "../../components/Loading";

const OperatorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dispatch Modal State
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [isDispatching, setIsDispatching] = useState(false);

  useEffect(() => {
    if (!user?.region) {
      setLoading(false);
      return;
    }

    // Listen to Regional Reports
    const qReports = query(
      collection(db, "reports"),
      where("region", "==", user.region)
    );

    const unsubReports = onSnapshot(qReports, (snap) => {
      setReports(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Listen to Regional Teams
    const qTeams = query(
      collection(db, "teams"),
      where("region", "==", user.region)
    );

    const unsubTeams = onSnapshot(qTeams, (snap) => {
      setTeams(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    setLoading(false);
    return () => {
      unsubReports();
      unsubTeams();
    };
  }, [user]);

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

  const openDispatchModal = (reportId) => {
    setSelectedReportId(reportId);
    setShowDispatchModal(true);
  };

  const closeDispatchModal = () => {
    setShowDispatchModal(false);
    setSelectedReportId(null);
    setSelectedTeamId("");
  };

  const handleDispatch = async (e) => {
    e.preventDefault();
    if (!selectedReportId || !selectedTeamId) return;

    setIsDispatching(true);
    try {
      // 1. Update the report: Mark as "Dispatched" and assign the team ID
      await updateDoc(doc(db, "reports", selectedReportId), {
        status: "Dispatched",
        assignedTeam: selectedTeamId
      });

      // 2. Update the team: Mark as "On Mission"
      await updateDoc(doc(db, "teams", selectedTeamId), {
        status: "On Mission"
      });

      closeDispatchModal();
    } catch (error) {
      console.error("Error dispatching team:", error);
      alert("Failed to assign team.");
    } finally {
      setIsDispatching(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50 transition-colors">
            Regional operator console
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Triage reports and manage dispatch vectors in your assigned region.
          </p>
        </div>
      </div>

      {/* Operator summary */}
      <section className="grid md:grid-cols-3 gap-4">
        <MetricCard
          title="Pending validation"
          value={reports.filter(r => r.status === "pending").length}
          description="New citizen reports waiting for review."
        />
        <MetricCard
          title="Teams on mission"
          value={teams.filter(t => t.status === "On Mission").length}
          description="Active interventions in your region."
        />
        <MetricCard
          title="Total local teams"
          value={teams.length}
          description="Disaster response units registered."
        />
      </section>

      {/* Regional reports */}
      <section className="grid lg:grid-cols-[1.5fr,1fr] gap-5 pt-1">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">
              Report queue – {user?.region || "Loading..."}
            </h2>
            <div className="flex gap-2">
              <select className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-[11px] text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition-colors">
                <option>Sort by severity</option>
                <option>Sort by time</option>
                <option>Sort by status</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 transition-colors shadow-sm dark:shadow-none">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/90 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 text-left">Report</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Severity</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {reports.filter(r => r.status !== "Resolved").map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 bg-white dark:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {report.cin || report.id}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-200">{report.type}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {report.region}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-500 italic text-xs">--</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge variant={
                        report.status === "Validated" ? "success" : 
                        report.status === "Dispatched" ? "safe" : 
                        report.status === "pending" ? "warning" : "info"
                      }>
                        {report.status}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {report.status === "pending" && (
                          <AltButton onClick={() => handleValidate(report.id)}>Validate</AltButton>
                        )}
                        {report.status === "Validated" && (
                          <AltButton onClick={() => openDispatchModal(report.id)} variant="info">Assign team</AltButton>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Team management */}
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-3 shadow-sm dark:shadow-none transition-colors">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Field teams in region
              </h2>
              <button className="text-[11px] text-emerald-600 dark:text-emerald-300 hover:text-emerald-700 dark:hover:text-emerald-200 font-medium">
                Add team
              </button>
            </div>

            <div className="space-y-2">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {team.name}
                    </p>
                    <p className="text-[11px] text-slate-500">{team.id}</p>
                  </div>
                  <StatusBadge
                    variant={team.status === "Available" ? "success" : team.status === "Offline" ? "danger" : "warning"}
                  >
                    {team.status || "Available"}
                  </StatusBadge>
                </div>
              ))}
              {teams.length === 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center">No local teams registered.</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 space-y-2 text-[11px] text-slate-500 dark:text-slate-400 shadow-sm dark:shadow-none transition-colors">
            <p className="font-semibold text-slate-700 dark:text-slate-200">
              Workflow guidance
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                When the operator clicks <span className="text-emerald-300">Validate</span>,
                update the report status in Firestore to Validated.
              </li>
              <li>
                <span className="text-emerald-300">Assign team</span> opens a
                modal listing teams from this region. Selecting one sets internal statuses.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Dispatch Modal */}
      {showDispatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Assign Team to Report</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Select an available team in your region to dispatch.
            </p>
            
            <form onSubmit={handleDispatch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Select Unit
                </label>
                <select
                  required
                  value={selectedTeamId}
                  onChange={(e) => setSelectedTeamId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
                >
                  <option value="" disabled>-- Choose a team --</option>
                  {teams.filter(t => t.status !== "Offline").map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.status || "Available"})
                    </option>
                  ))}
                </select>
                {teams.filter(t => t.status !== "Offline").length === 0 && (
                   <p className="text-xs text-red-500 mt-2">No online teams available in your region.</p>
                )}
              </div>

              <div className="flex gap-3 justify-end mt-6">
                <AltButton type="button" onClick={closeDispatchModal}>Cancel</AltButton>
                <Button type="submit" disabled={!selectedTeamId || isDispatching}>
                  {isDispatching ? "Dispatching..." : "Confirm Dispatch"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default OperatorDashboard;
