import React from "react";

// Application footer with a focus on operational
// contact details and a short tagline.
const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm">
        <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide text-white">
              Disaster<span className="text-emerald-400">Net</span>
            </p>
            <p className="text-[11px] text-slate-400">
              National Emergency Platform
            </p>
          </div>

        <div className="text-[12px] text-slate-400 space-y-1">
          <p>
            Operational contact:{" "}
            <span className="text-emerald-300">ops@disasternet.ma</span>
          </p>
          <p>
            For immediate emergencies, always call the national emergency
            numbers first.
          </p>
        </div>

        <div className="text-[12px] text-slate-500">
          © {new Date().getFullYear()} Disasternet. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;