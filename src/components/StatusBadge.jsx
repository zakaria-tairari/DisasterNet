import React from "react";

// Generic status badge used for incident status, severity,
// team availability, etc. All non-danger states share the
// same emerald accent to keep the palette focused.
const StatusBadge = ({ children, variant = "success" }) => {
  const classes =
    variant === "danger"
      ? "bg-red-500/15 text-red-300 border border-red-500/40" :
      variant === "serious"
      ? "bg-orange-500/15 text-orange-300 border border-orange-500/40" :
      variant === "warning" 
      ? "bg-yellow-500/15 text-yellow-300 border border-yellow-500/40" :
      variant === "safe"
      ? "bg-blue-500/15 text-blue-300 border border-blue-500/40" :
      variant === "info"
      ? "bg-slate-500/15 text-slate-300 border border-slate-500/40" :

      "bg-emerald-500/15 text-emerald-300 border border-emerald-500/40";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${classes}`}
    >
      {children}
    </span>
  );
};

export default StatusBadge;

