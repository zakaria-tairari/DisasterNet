import React, { useState, useEffect, useRef } from "react";

export default function PopupButton({ buttonText, children, style = "cursor-pointer w-fit inline-flex items-center justify-center text-sm rounded-full bg-emerald-500 px-4 py-2 font-semibold text-white dark:text-slate-950 shadow-sm hover:bg-emerald-400 transition" }) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef();

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closePopup();
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="flex items-center justify-end">
      {/* Trigger Button */}
      <button
        className={`${style}`}
        onClick={openPopup}
      >
        {buttonText}
      </button>

      {/* Popup Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 flex justify-center items-center z-100 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Modal Content */}
        <div
          ref={modalRef}
          className={`rounded-xl border min-w-3xl border-emerald-500/30 dark:border-emerald-500/40 bg-white dark:bg-slate-900 p-5 space-y-3 shadow-lg transition-colors ${
            isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 text-slate-500 hover:text-rose-600 font-bold cursor-pointer"
            aria-label="Dismiss"
            onClick={closePopup}
          >
            <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>

          {/* Render children (your modal content) */}
          {children}
        </div>
      </div>
    </div>
  );
}