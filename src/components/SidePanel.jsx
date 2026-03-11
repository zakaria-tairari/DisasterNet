import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function SidePanel({
  title = "",
  children,
  onClose,
  isOpen,
}) {
  const panelRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return createPortal(
    <>
      {/* Side Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-full max-w-md z-1000 flex flex-col
          border-l border-emerald-500/30 dark:border-emerald-500/40
          bg-white dark:bg-slate-900 shadow
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-emerald-500/20 dark:border-emerald-500/30">
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 tracking-wide uppercase">
            {title}
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
            aria-label="Close panel"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">{children}</div>
      </div>
    </>, document.body
  );
}
