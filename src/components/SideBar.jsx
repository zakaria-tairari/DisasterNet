import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const SideBar = ({ items }) => {
  const location = useLocation();
  return (
    <aside className="hidden md:flex w-60 sticky top-16 flex-col border-r border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 transition-colors duration-300">
        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === item.to
                  ? "bg-slate-100/80 dark:bg-slate-800/60 text-emerald-600 dark:text-emerald-300 font-medium shadow-sm dark:shadow-none"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-emerald-600 dark:hover:text-emerald-200"
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