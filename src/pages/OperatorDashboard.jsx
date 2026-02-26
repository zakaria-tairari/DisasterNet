import React from "react";
import DashboardShell from "../components/DashboardShell";
import MetricCard from "../components/MetricCard";
import StatusBadge from "../components/StatusBadge";

// Mock regional incident list for the operator view.
// Later this can be a Firestore query filtered by region
// + real-time updates using onSnapshot.
const MOCK_REGIONAL_REPORTS = [
  {
    id: "R-2026-010",
    citizen: "Ahmed El Mansouri",
    type: "Traffic accident",
    location: "Ain Sebaâ, Casablanca",
    severity: "High",
    status: "Pending validation",
  },
  {
    id: "R-2026-011",
    citizen: "Salma Idrissi",
    type: "Flood",
    location: "Hay Hassani, Casablanca",
    severity: "Medium",
    status: "Validated",
  },
  {
    id: "R-2026-012",
    citizen: "Youssef Rahali",
    type: "Fire",
    location: "Derb Sultan, Casablanca",
    severity: "Critical",
    status: "Dispatched",
  },
  {
    id: "R-2026-013",
    citizen: "Amine Simali",
    type: "Traffic accident",
    location: "Maarif, Casablanca",
    severity: "Low",
    status: "Dispatched",
  },
];

const MOCK_TEAMS = [
  { id: "T-401", name: "Team Atlas 03", status: "Available" },
  { id: "T-402", name: "Casablanca Medics 02", status: "On mission" },
  { id: "T-403", name: "Fire Brigade South", status: "Available" },
];

const OperatorDashboard = () => {
  return (
    <DashboardShell
      title="Regional operator console"
    >
      {/* Operator summary */}
      <section className="grid md:grid-cols-3 gap-4">
        <MetricCard
          title="Pending validation"
          value="5"
          description="New citizen reports waiting for review."
        />
        <MetricCard
          title="Teams on mission"
          value="3"
          description="Active interventions in your region."
        />
        <MetricCard
          title="Average validation time"
          value="3 min"
          description="From report submission to operator validation."
        />
      </section>

      {/* Regional reports */}
      <section className="grid lg:grid-cols-[1.5fr,1fr] gap-5 pt-1">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">
              Incident queue – Casablanca‑Settat
            </h2>
            <div className="flex gap-2">
              <select className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <option>Sort by severity</option>
                <option>Sort by time</option>
                <option>Sort by status</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/90 text-xs uppercase tracking-[0.16em] text-slate-400">
                <tr>
                  <th className="px-4 py-3 text-left">Report</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Severity</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {MOCK_REGIONAL_REPORTS.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-800/60">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-100">
                        {report.id}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {report.citizen}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-200">{report.type}</td>
                    <td className="px-4 py-3 text-slate-300">
                      {report.location}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge variant={report.severity === "Critical" ? "danger" : report.severity === "High" ? "serious" : report.severity === "Medium" ? "warning" : "safe"}>
                        {report.severity}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-3 text-slate-200">{report.status}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <button className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-200 hover:bg-emerald-500/20">
                          Validate
                        </button>
                        <button className="rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-200 hover:bg-emerald-500/20">
                          Assign team
                        </button>
                        <button className="rounded-lg border border-slate-700 px-2.5 py-1 text-[11px] text-slate-200 hover:bg-slate-800">
                          Details
                        </button>
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
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-100">
                Field teams in region
              </h2>
              <button className="text-[11px] text-emerald-300 hover:text-emerald-200">
                Add team
              </button>
            </div>

            <div className="space-y-2">
              {MOCK_TEAMS.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-100">
                      {team.name}
                    </p>
                    <p className="text-[11px] text-slate-500">{team.id}</p>
                  </div>
                  <StatusBadge
                    variant={team.status === "Available" ? "success" : "info"}
                  >
                    {team.status}
                  </StatusBadge>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2 text-[11px] text-slate-400">
            <p className="font-semibold text-slate-200">
              Workflow guidance (for your implementation)
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                When the operator clicks <span className="text-emerald-300">Validate</span>,
                update the report status in Firestore.
              </li>
              <li>
                <span className="text-emerald-300">Assign team</span> should open a
                modal listing teams (from a `teams` collection) filtered by
                region and availability.
              </li>
              <li>
                Use Firestore listeners to push updates in real time to both
                the operator and the assigned team&apos;s dashboard.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
};

export default OperatorDashboard;

