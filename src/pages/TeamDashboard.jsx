import React from "react";
import DashboardShell from "../components/DashboardShell";
import StatusBadge from "../components/StatusBadge";

// Mock data for field team assignments.
// Later, you can query only reports where `assignedTeamId`
// matches the logged-in team, and listen for updates.
const MOCK_ASSIGNED_INCIDENTS = [
  {
    id: "R-2026-012",
    type: "Fire",
    location: "Derb Sultan, Casablanca",
    receivedAt: "10:18",
    status: "Dispatched",
  },
  {
    id: "R-2026-009",
    type: "Traffic accident",
    location: "Ain Diab, Casablanca",
    receivedAt: "09:54",
    status: "On site",
  },
];

const TeamDashboard = () => {
  return (
    <DashboardShell
      title="Field team missions"
    >
      <section className="grid md:grid-cols-[1.5fr,1fr] gap-5">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">
              Assigned incidents
            </h2>
            <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-200">
              Live updates enabled
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80">
            <table className="w-full text-sm">
              <thead className="bg-slate-900/90 text-xs uppercase tracking-[0.16em] text-slate-400">
                <tr>
                  <th className="px-4 py-3 text-left">Report</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">Received</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {MOCK_ASSIGNED_INCIDENTS.map((incident) => (
                  <tr key={incident.id} className="hover:bg-slate-800/60">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-100">
                        {incident.id}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-200">
                      {incident.type}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {incident.location}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {incident.receivedAt}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge variant="warning">
                        {incident.status}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        <button className="rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-200 hover:bg-emerald-500/20">
                          Mark as on site
                        </button>
                        <button className="rounded-lg border border-emerald-500/60 bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-200 hover:bg-emerald-500/20">
                          Mark as resolved
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-2 text-[11px] text-slate-400">
            <p className="font-semibold text-slate-200 text-sm">
              Status update workflow
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Team receives dispatch notification and acknowledges mission.</li>
              <li>When leaving the station, set status to &quot;Dispatched&quot;.</li>
              <li>Upon arrival, update to &quot;On site&quot; so operators can monitor.</li>
              <li>
                After helping victims and securing the area, mark the incident as
                &quot;Resolved&quot;.
              </li>
            </ol>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
            <p className="text-sm font-semibold text-slate-100">
              Mission notes (for your implementation)
            </p>
            <p className="text-[11px] text-slate-400">
              You can attach a lightweight mission report here: summary of the
              intervention, number of injured, photos, and GPS track. Store it
              in a `missions` collection related to the original report.
            </p>
            <textarea
              rows={4}
              placeholder="Add quick notes, plate numbers, victim condition, etc."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-[13px] text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              className="w-full rounded-lg bg-emerald-500 text-slate-950 text-sm font-semibold py-2.5 hover:bg-emerald-400 transition"
            >
              Save mission notes
            </button>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
};

export default TeamDashboard;

