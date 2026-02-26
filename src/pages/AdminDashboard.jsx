import React, { useState } from "react";
import DashboardShell from "../components/DashboardShell";
import MetricCard from "../components/MetricCard";
import StatusBadge from "../components/StatusBadge";
import Button from "../components/Button";
import Input from "../components/Input";
import RoleSelector from "../components/RoleSelector";
import CreateUserForm from "../components/admin/CreateUserForm";
import AltButton from "../components/AltButton";

// Mock data so the UI looks alive.
// Replace these with Firestore collections later.
const MOCK_REPORTS = [
  {
    id: "R-2026-001",
    type: "Flood",
    region: "Casablanca‑Settat",
    status: "Validated",
    createdAt: "10:32",
    assignedTeam: "Team Atlas 03",
  },
  {
    id: "R-2026-002",
    type: "Traffic accident",
    region: "Rabat‑Salé‑Kénitra",
    status: "Dispatched",
    createdAt: "10:21",
    assignedTeam: "Highway North 02",
  },
  {
    id: "R-2026-003",
    type: "Fire",
    region: "Marrakech‑Safi",
    status: "Pending",
    createdAt: "10:18",
    assignedTeam: "-",
  },
];

const MOCK_ACCOUNTS = [
  { id: "A-001", name: "National Admin", role: "Admin", region: "All" },
  { id: "O-101", name: "Casablanca ROC", role: "Operator", region: "Casablanca‑Settat" },
  { id: "T-401", name: "Team Atlas 03", role: "Field Team", region: "Casablanca‑Settat" },
];


const AdminDashboard = () => {

  return (
    <DashboardShell
      title="National oversight dashboard"
    >
      {/* Top stats */}
      <section className="grid md:grid-cols-3 gap-4">
        <MetricCard
          title="Active incidents"
          value="32"
          description="Across all regions in the last 24h."
        />
        <MetricCard
          title="Avg response time"
          value="12 min"
          description="Based on dispatched incidents this week."
        />
        <MetricCard
          title="Accounts"
          value="84"
          description="Admin, operator and field teams nationwide."
        />
      </section>

      {/* Reports table */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100">
            Latest incident reports (all regions)
          </h2>
          <button className="text-[11px] text-emerald-300 hover:text-emerald-200">
            View analytics
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border  border-slate-800  bg-slate-900/80">
          <table className="w-full text-sm">
            <thead className=" bg-slate-900/90 text-xs uppercase tracking-[0.16em] text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left">Report ID</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Region</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Assigned team</th>
                <th className="px-4 py-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {MOCK_REPORTS.map((report) => (
                <tr key={report.id} className="hover:bg-slate-800/60 bg-slate-800/40">
                  <td className="px-4 py-3 font-medium text-slate-100">
                    {report.id}
                  </td>
                  <td className="px-4 py-3 text-slate-200">{report.type}</td>
                  <td className="px-4 py-3  text-slate-300">{report.region}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      variant={
                        report.status === "Validated"
                          ? "success"
                          : report.status === "Dispatched"
                            ? "safe"
                            : "warning"
                      }
                    >
                      {report.status}
                    </StatusBadge>
                  </td>
                  <td className="px-4 py-3 text-slate-200">
                    {report.assignedTeam}
                  </td>
                  <td className="px-4 py-3 text-slate-400">{report.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Account management */}
      <section className="grid md:grid-cols-[1.4fr,1fr] gap-5 pt-2">
        <div className="rounded-xl border  border-slate-800  bg-slate-900/80 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">
              Manage accounts
            </h2>
            <button className="text-[11px] text-emerald-300 hover:text-emerald-200">
              View all
            </button>
          </div>

          <div className="space-y-2">
            {MOCK_ACCOUNTS.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between rounded-lg border  border-slate-800  bg-slate-900 px-3 py-2.5"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-100">
                    {account.name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {account.role} • {account.region}
                  </p>
                </div>
                <div className="flex gap-2">
                  <AltButton variant="info">
                    Edit
                  </AltButton>
                  <AltButton variant="danger">
                    Delete
                  </AltButton>
                </div>
              </div>
            ))}
          </div>
        </div>
        <CreateUserForm />
      </section>
    </DashboardShell>
  );
};

export default AdminDashboard;

