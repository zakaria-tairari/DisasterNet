import React from "react";

// Reusable input used mainly on authenticated screens.
// Styled to match the dark slate / emerald theme.
const Input = ({ id, label, type = "text", placeholder = "", onChange, value }) => {
  return (
    <div className="w-full text-left">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-100 mb-1.5"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition"
      />
    </div>
  );
};

export default Input;