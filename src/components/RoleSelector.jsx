import React from 'react'

const RoleSelector = ({ onChange, role }) => {
  return (
    <div className="grid grid-cols-3 gap-2 text-xs font-medium bg-slate-100 dark:bg-slate-800/80 rounded-xl p-1 transition-colors">
          {[
            { id: "admin", label: "Admin" },
            { id: "operator", label: "Operator" },
            { id: "team", label: "Field Team" },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`px-3 py-2 rounded-lg transition-colors text-center ${
                role === option.id
                  ? "bg-emerald-500 dark:bg-emerald-400 text-white dark:text-slate-900 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700/70"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
  )
}

export default RoleSelector