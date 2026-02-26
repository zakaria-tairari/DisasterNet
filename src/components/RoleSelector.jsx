import React from 'react'

const RoleSelector = ({ onChange, role }) => {
  return (
    <div className="grid grid-cols-3 gap-2 text-xs font-medium bg-slate-800/80 rounded-xl p-1">
          {[
            { id: "admin", label: "Admin" },
            { id: "operator", label: "Operator" },
            { id: "team", label: "Field Team" },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`px-3 py-2 rounded-lg transition text-center ${
                role === option.id
                  ? "bg-emerald-400 text-slate-900 shadow-sm"
                  : "text-slate-400 hover:bg-slate-700/70"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
  )
}

export default RoleSelector