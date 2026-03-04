import React from "react";

const Button = ({ children, type = "button", onClick }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full cursor-pointer inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-sm hover:bg-emerald-400"
    >
      {children}
    </button>
  );
};

export default Button;