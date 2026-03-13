import React, { useEffect, useState } from "react";
import { getDoc } from "firebase/firestore";
import StatusBadge from "./StatusBadge";

const TeamProgressView = ({ report }) => {
  const [team, setTeam] = useState(null);
  const status = report?.status?.toLowerCase();

  const TYPE_MAP = {
  fire: "Firefighting Unit",
  flood: "Civil Protection Unit",
  medical: "Medical Unit",
  traffic: "Traffic Police Unit",
  infrastructure: "Public Works Unit",
  other: "General Response Unit",
};

const TYPE_ICONS = {
    flood: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-waves-icon lucide-waves">
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
      <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
      <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
      </svg>),
    fire: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flame-icon lucide-flame">
      <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>
      </svg>),
    medical: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-pulse-icon lucide-heart-pulse"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/><path d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>),
    traffic: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-traffic-cone-icon lucide-traffic-cone">
      <path d="M16.05 10.966a5 2.5 0 0 1-8.1 0"/>
      <path d="m16.923 14.049 4.48 2.04a1 1 0 0 1 .001 1.831l-8.574 3.9a2 2 0 0 1-1.66 0l-8.574-3.91a1 1 0 0 1 0-1.83l4.484-2.04"/>
      <path d="M16.949 14.14a5 2.5 0 1 1-9.9 0L10.063 3.5a2 2 0 0 1 3.874 0z"/><path d="M9.194 6.57a5 2.5 0 0 0 5.61 0"/>
      </svg>),
    infrastructure: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building2-icon lucide-building-2"><path d="M10 12h4"/><path d="M10 8h4"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"/><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/></svg>),
    other: (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert-icon lucide-triangle-alert">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
      <path d="M12 9v4"/><path d="M12 17h.01"/>
      </svg>),
  };

  const STATUS_BG = {
  dispatched: "bg-yellow-50 dark:bg-yellow-900/20",
  on_site:    "bg-blue-50 dark:bg-blue-900/20",
  resolved:   "bg-emerald-50 dark:bg-emerald-900/20",
};

const STATUS_DOT = {
  dispatched: "bg-yellow-500 dark:bg-yellow-400 animate-pulse",
  on_site:    "bg-blue-500 dark:bg-blue-400 animate-pulse",
  resolved:   "bg-emerald-500 dark:bg-emerald-400",
};

const STATUS_TEXT = {
  dispatched: "text-yellow-700 dark:text-yellow-400",
  on_site:    "text-blue-700 dark:text-blue-400",
  resolved:   "text-emerald-700 dark:text-emerald-400",
};

  useEffect(() => {
    if (!report?.assignedTeam) return;

    const fetchTeam = async () => {
      try {
        const teamSnap = await getDoc(report.assignedTeam);
        if (teamSnap.exists()) {
          setTeam(teamSnap.data());
        }
      } catch (error) {
        console.error("Error loading team:", error);
      }
    };

    fetchTeam();
  }, [report]);

  if (!report) return null;

 return (
  <div className="flex flex-col h-full text-sm text-slate-700 dark:text-slate-300 overflow-y-auto">

    {/* Status — full-bleed header strip */}
    <div className={`px-6 py-4 flex items-center rounded-full gap-4 ${STATUS_BG[status]}`}>
      <span className={`w-3 h-3 rounded-full shrink-0 ${STATUS_DOT[status]}`} />
      <span className={`text-sm font-bold uppercase tracking-widest ${STATUS_TEXT[status]}`}>
        {report.status}
      </span>
    </div>

    {/* Incident Info */}
    <div className="px-6 py-5 space-y-4 border-b border-slate-200 dark:border-slate-800">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        Incident Details
      </p>

      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Type</p>
          <p className="text-slate-800 dark:text-slate-100 font-medium">{report.type}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Region</p>
          <p className="text-slate-800 dark:text-slate-100 font-medium">{report.region}</p>
        </div>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Description</p>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{report.description}</p>
      </div>
    </div>

    {/* Team Info */}
<div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800">
  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
    Assigned Team
  </p>
  {team ? (
    <div className="flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-500/20 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-500/30">
        {TYPE_ICONS[team.type] ?? TYPE_ICONS.other}
      </div>
      <div className="min-w-0">
        <p className="text-slate-800 dark:text-slate-100 font-semibold truncate">
          {team.displayName} - {team.email}
        </p>
        <p className="text-slate-600 dark:text-slate-300 truncate">
          {TYPE_MAP[team.type]}
        </p>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
      <svg className="w-4 h-4 animate-spin shrink-0" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>
      <span className="text-sm">Loading team information…</span>
    </div>
  )}
</div>

    {/* Progress */}
    <div className="px-6 py-5">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
        Progress
      </p>
      {status === "dispatched" && (
        <div className="rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-500/20 px-4 py-4 flex gap-3 items-start">
          <span className="text-xl text-yellow-500 leading-none mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-route-icon lucide-route"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/></svg>
          </span>
          <div>
            <p className="text-yellow-700 dark:text-yellow-400 font-semibold mb-1">En Route</p>
            <p className="text-slate-500 dark:text-slate-500 text-xs leading-400axed">Team is heading to the incident location.</p>
          </div>
        </div>
      )}
      {status === "on_site" && (
        <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/20 px-4 py-4 flex gap-3 items-start">
          <span className="text-xl text-blue-500 leading-none mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin-check-inside-icon lucide-map-pin-check-inside"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><path d="m9 10 2 2 4-4"/></svg>
          </span>
          <div>
            <p className="text-blue-700 dark:text-blue-400 font-semibold mb-1">On Site</p>
            <p className="text-slate-500 dark:text-slate-500 text-xs leading-400axed">Team is actively handling the incident on location.</p>
          </div>
        </div>
      )}
      {status === "resolved" && (
        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-500/20 px-4 py-4 flex gap-3 items-start">
          <span className="text-xl leading-none mt-0.5">✅</span>
          <div>
            <p className="text-emerald-700 dark:text-emerald-400 font-semibold mb-1">Resolved</p>
            <p className="text-slate-500 dark:text-slate-500 text-xs leading-400axed">This incident has been closed successfully.</p>
          </div>
        </div>
      )}
    </div>

  </div>
);
};

export default TeamProgressView;