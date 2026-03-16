import React from "react"

const AltButton = ({ children, type = "button", variant = "success", value, onClick }) => {
    const classes =
    variant === "danger"
      ? "text-red-600 dark:text-red-300 border border-red-200 dark:border-red-500/40 hover:bg-red-50 dark:hover:bg-red-600/10" :
      variant === "info"
      ? "text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-500/40 hover:bg-slate-50 dark:hover:bg-slate-600/10" :
      variant === "safe"
      ? "text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-500/40 hover:bg-blue-50 dark:hover:bg-blue-600/10" :
      "text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40 hover:bg-emerald-50 dark:hover:bg-emerald-600/10";

  return (
    <button
    type={type}
    className={`text-[11px] px-2 py-1 rounded-lg cursor-pointer transition-colors duration-200 ${classes}`}
    value={value}
    onClick={onClick}
    >
        {children}
    </button>
  )
}

export default AltButton