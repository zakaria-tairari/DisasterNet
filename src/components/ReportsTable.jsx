import React from "react";
import StatusBadge from "./StatusBadge";
import AltButton from "./AltButton";
import { getDate } from "../lib/firebaseGetDate";
import PopupButton from "./PopupButton";
import ReportMap from "./map/ReportMap";
import TeamsTable from "./TeamsTable";

const ReportsTable = ({ reports }) => {
  return (
    <div className="bg-white dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none transition-colors overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 dark:bg-slate-900/90 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <tr>
            <th className="px-6 py-4">Citizen</th>
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
              <tr
                key={report.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
              >
                <td className="px-6 py-4">
                  <p>{report.cin || "Anonymous"}</p>
                </td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {report.type}
                </td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300">
                  {report.region}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge
                    variant={
                      report.status === "resolved"
                        ? "success"
                        : report.status === "dispatched"
                          ? "safe"
                          : "warning"
                    }
                  >
                    {report.status}
                  </StatusBadge>
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                  {report.createdAt ? getDate(report.createdAt) : "Just now"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <PopupButton
                      buttonText="Assign team"
                      style="text-[11px] px-2 py-1 rounded-lg cursor-pointer transition-colors duration-200 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40 hover:bg-emerald-50 dark:hover:bg-emerald-600/10"
                    >
                      <TeamsTable report={ report } />
                    </PopupButton>
                  <PopupButton
                    buttonText="View details"
                    style="text-[11px] px-2 py-1 rounded-lg cursor-pointer transition-colors duration-200 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-500/40 hover:bg-slate-50 dark:hover:bg-slate-600/10"
                    >
                    <div>
                      <span className="text-sm text-slate-600 dark:text-slate-400 block mb-2">
                        <strong className="text-slate-900 dark:text-white block mb-1">Reporter : </strong> {report.cin} - {report.fullName}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400 block mb-2">
                        <strong className="text-slate-900 dark:text-white block mb-1">Type : </strong> {report.type}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400 block mb-2">
                        <strong className="text-slate-900 dark:text-white block mb-1">Description : </strong> {report.description}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400 block mb-2">
                        <strong className="text-slate-900 dark:text-white block mb-1">Location : </strong> {report.location.address}
                      </span>
                    </div>
                    <div className="h-100 w-full rounded-xl shadow-sm overflow-hidden">
                      <ReportMap reports={[report]} zoom={8} center={[report.location.lat, report.location.lng]} />
                    </div>
                  </PopupButton>
                    </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-8 text-slate-500">
                No reports found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsTable;
