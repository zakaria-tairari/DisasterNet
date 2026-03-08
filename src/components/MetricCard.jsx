import React from "react";

// Small reusable metric card used on dashboards
// to display key numbers and a short description.
const MetricCard = ({ title, value, description }) => {
  // All metric cards share the same emerald accent
  // to keep the visual language consistent.
  const borderClass = "border-slate-200 dark:border-emerald-500/40 border-l-4 border-l-emerald-500 dark:border-l-emerald-500/40";
  const titleColor = "text-emerald-600 dark:text-emerald-400";

  return (
    <div className={`rounded-xl border bg-white dark:bg-slate-900/80 p-5 shadow-sm dark:shadow-none transition-all duration-300 hover:shadow-md ${borderClass}`}>
      <p
        className={`text-xs font-semibold uppercase tracking-wider mb-2 ${titleColor}`}
      >
        {title}
      </p>
      <p className="text-3xl font-bold text-slate-800 dark:text-slate-50">{value}</p>
      {description && (
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">{description}</p>
      )}
    </div>
  );
};

export default MetricCard;

