import React from "react";

// Secondary button used for social / SSO actions.
// Kept more neutral but still aligned with the theme.
const SocialButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex-1 py-2.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-100 text-sm hover:cursor-pointer hover:bg-slate-800 hover:border-emerald-500/60 transition"
    >
      {children}
    </button>
  );
};

export default SocialButton;