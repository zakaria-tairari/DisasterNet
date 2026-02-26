import React from 'react'
import { Link } from 'react-router-dom'

const SideBar = ({ items }) => {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-950/90">
        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                location.pathname === item.to
                  ? "bg-slate-800/60 text-emerald-300"
                  : "text-slate-300 hover:bg-slate-800/40 hover:text-emerald-200"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
  )
}

export default SideBar