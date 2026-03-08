import React from "react";
import { Link, useLocation } from "react-router-dom";
import SideBar from "./SideBar";

const DashboardShell = ({ navItems, children }) => {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex transition-colors duration-300">
      {/* Sidebar */}
      <SideBar items={navItems} />

      {/* Main content */}
      <section className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto px-5 md:px-8 py-5 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
          <div className="max-w-6xl mx-auto space-y-6">
            {children}
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardShell;

