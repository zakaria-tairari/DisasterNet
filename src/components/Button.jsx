import React from "react";

const Button = ({ children, type = "button", onClick, variant = "default" }) => {
  const className = variant === "default" ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 hover:shadow-emerald-500/40 dark:hover:bg-emerald-400" : 
    variant === "danger" ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20 hover:shadow-rose-500/40 dark:hover:bg-rose-400" :
    "bg-slate-500 hover:bg-slate-600 shadow-slate-500/20 hover:shadow-slate-500/40 dark:hover:bg-slate-400"
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${className} w-full cursor-pointer inline-flex items-center justify-center rounded-lg  px-4 py-2.5 text-sm font-semibold text-white shadow-md  dark:text-slate-950  transition-all duration-300 transform hover:-translate-y-0.5`}
    >
      {children}
    </button>
  );
};

export default Button;