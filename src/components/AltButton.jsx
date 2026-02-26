import React from "react"

const AltButton = ({ children, type = "button", variant = "success" }) => {
    const classes =
    variant === "danger"
      ? "text-red-300 border border-red-500/40 hover:bg-red-600/10" :
      variant === "info"
      ? "text-slate-300 border border-slate-500/40 hover:bg-slate-600/10" :

      "text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/10";

  return (
    <button
    type="button"
    className={`text-[11px] px-2 py-1 rounded-lg border cursor-pointer ${classes}`}>
        {children}
    </button>
  )
}

export default AltButton