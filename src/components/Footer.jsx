import React from "react";

// Application footer with a focus on operational
// contact details and a short tagline.
const Footer = () => {
  return (
    <footer className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm">
        <div className="leading-tight">
            <p className="font-semibold text-lg tracking-wide text-slate-800 dark:text-white transition-colors duration-300">
              Emergency<span className="text-emerald-500 dark:text-emerald-400">Net</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              National Emergency Platform
            </p>
          </div>

        <div className="text-[12px] text-slate-500 dark:text-slate-400 space-y-1">
          <p>
            Operational contact:{" "}
            <span className="text-emerald-600 dark:text-emerald-300 font-medium">ops@disasternet.ma</span>
          </p>
          <p>
            For immediate emergencies, always call the national emergency
            numbers first.
          </p>
        </div>

        <div className="text-[12px] text-slate-400 dark:text-slate-500">
          © {new Date().getFullYear()} Emergencynet. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;