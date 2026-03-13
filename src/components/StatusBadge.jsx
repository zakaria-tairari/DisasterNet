import React from "react";

// Generic status badge used for report status, severity,
// team availability, etc. All non-danger states share the
// same emerald accent to keep the palette focused.
const StatusBadge = ({ children, variant = "success" }) => {
  const classes =
    variant === "danger"
      ? "bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-500/40" :
      variant === "serious"
      ? "bg-orange-100 dark:bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-500/40" :
      variant === "warning" 
      ? "bg-yellow-100 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-500/40" :
      variant === "safe"
      ? "bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/40" :
      variant === "info"
      ? "bg-slate-100 dark:bg-slate-500/15 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-500/40" :
      "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40";

  return (
    <span
      className={`inline-flex uppercase items-center rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors duration-200 ${classes}`}
    >
      {children}
    </span>
  );
};

export default StatusBadge;

