import React from "react";
import { Link, useLocation } from "react-router-dom";

// Reusable dashboard layout shared by Admin, Operator and Team.
// It gives you a consistent sidebar + top bar so each role page
// only focuses on the actual content (tables, cards, actions).
// No auth logic is included here so you can plug in your own
// routing / protection later.
const DashboardShell = ({ title, description, children }) => {
  const location = useLocation();

  const navItems = [
    { to: "/admin", label: "Admin", role: "admin" },
    { to: "/operator", label: "Operator", role: "operator" },
    { to: "/team", label: "Field Teams", role: "team" },
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-950 text-slate-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950/90">
        <div className="px-6 py-5 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide text-white">
              Disaster<span className="text-emerald-400">Net</span>
            </p>
            <p className="text-[11px] text-slate-400">
              National Emergency Platform
            </p>
          </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                location.pathname === item.to
                  ? "bg-slate-800 text-emerald-300"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-emerald-200"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <section className="flex-1 flex flex-col">
        <header className="border-b border-slate-800 bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 px-5 md:px-8 py-4">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-50">
                {title}
              </h1>
              {description && (
                <p className="text-xs md:text-sm text-slate-400 mt-1">
                  {description}
                </p>
              )}
            </div> 
        </header>

        <div className="flex-1 overflow-y-auto px-5 md:px-8 py-5 bg-slate-950">
          <div className="max-w-6xl mx-auto space-y-6">{children}</div>
        </div>
      </section>
    </div>
  );
};

export default DashboardShell;

