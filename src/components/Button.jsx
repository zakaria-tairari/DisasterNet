import React from "react";

const Button = ({ children, type = "button", onClick }) => {
 
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 hover:shadow-emerald-500/40 dark:hover:bg-emerald-400 w-full cursor-pointer inline-flex items-center justify-center rounded-lg  px-4 py-2.5 text-sm font-semibold text-white shadow-md  dark:text-slate-950  transition-all duration-300 transform hover:-translate-y-0.5`}
    >
      {children}
    </button>
  );
};

export default Button;