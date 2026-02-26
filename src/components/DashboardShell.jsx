import React from "react";
import { Link, useLocation } from "react-router-dom";
import SideBar from "./SideBar";

const DashboardShell = ({ title, children }) => {

  const navItems = [
    { to: "/admin", label: "Admin", role: "admin" },
    { to: "/operator", label: "Operator", role: "operator" },
    { to: "/team", label: "Field Teams", role: "team" },
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-950 text-slate-50 flex">
      {/* Sidebar */}
      <SideBar items={navItems} />

      {/* Main content */}
      <section className="flex-1 flex flex-col">
        <header className="border-b border-slate-800 bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 px-5 md:px-8 py-4">
            <h1 className="text-xl md:text-2xl font-semibold text-slate-50">
              {title}
            </h1>
        </header>

        <div className="flex-1 overflow-y-auto px-5 md:px-8 py-5 bg-slate-950">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardShell;

