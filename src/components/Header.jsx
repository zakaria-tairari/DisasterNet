import React from "react";
import { Link } from "react-router-dom";

// Top-level application header shared across public and
// authenticated views. It intentionally stays minimal and
// focuses on brand + primary actions (report, login).
const Header = () => {

  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
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

        {/* Auth entry point */}
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 shadow-sm hover:bg-emerald-400 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;