import React from "react";

const Button = ({ children, type = "button", onClick }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full cursor-pointer inline-flex items-center justify-center rounded-lg bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 dark:text-slate-950 dark:hover:bg-emerald-400 transition-all duration-300 transform hover:-translate-y-0.5"
    >
      {children}
    </button>
  );
};

export default Button;