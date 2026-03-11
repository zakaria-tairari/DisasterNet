import React from "react";
import { Link, useLocation } from "react-router-dom";

const SideBar = ({ items, collapsed }) => {
  const location = useLocation();

  return (
    <aside
      className={`
        hidden md:flex fixed left-0 h-screen flex-col
        border-r border-slate-200 dark:border-slate-800
        bg-white/90 dark:bg-slate-950/90
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-16.5" : "w-65"}
      `}
    >
      {/* Logo */}
      <div className={`my-4 ${collapsed ? "mx-auto text-lg" : "ml-7 text-xl"}`}>
        <Link to="/" className="flex items-center gap-2">
          <div className="leading-tight">
            <p className="font-semibold tracking-wide text-slate-800 dark:text-white transition-colors duration-300">
              {collapsed ? "E" : "Emergency"}
              <span className="text-emerald-500 dark:text-emerald-400">Net</span>
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-3 text-sm">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`
              flex items-center rounded-lg transition-colors
              ${collapsed ? "p-2 justify-center" : "px-3 py-2"}
              ${
                location.pathname === item.to
                  ? "bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-medium"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }
            `}
          >
            {/* Icon */}
            <div
              className={`shrink-0 transition-all duration-300 ${
                collapsed ? "mx-auto" : ""
              }`}
            >
              {item.icon}
            </div>

            {/* Label */}
            <span
              className={`
                transition-all duration-300 overflow-hidden whitespace-nowrap
                ${collapsed ? "opacity-0 w-0 ml-0" : "opacity-100 w-auto ml-3"}
              `}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default SideBar;