import React from "react";

// Small reusable metric card used on dashboards
// to display key numbers and a short description.
const MetricCard = ({ title, value, description }) => {
  // All metric cards share the same emerald accent
  // to keep the visual language consistent.
  const borderClass = "border-emerald-500/40";
  const titleColor = "text-emerald-400";

  return (
    <div className={`rounded-xl border ${borderClass} bg-slate-900/80 p-4`}>
      <p
        className={`text-xs uppercase tracking-[0.25em] mb-1 ${titleColor}`}
      >
        {title}
      </p>
      <p className="text-3xl font-semibold text-slate-50">{value}</p>
      {description && (
        <p className="text-[11px] text-slate-400 mt-1">{description}</p>
      )}
    </div>
  );
};

export default MetricCard;

