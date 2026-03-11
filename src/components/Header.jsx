import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import ThemeToggle from "./ThemeToggle";

// Top-level application header shared across public and
// authenticated views. It intentionally stays minimal and
// focuses on brand + primary actions (report, login).
const Header = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/", {replace: true});
  }


  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur z-50 sticky top-0 transition-colors duration-300">
      <div className="mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="leading-tight">
            <p className="font-semibold text-lg tracking-wide text-slate-800 dark:text-white transition-colors duration-300">
              Emergency<span className="text-emerald-500 dark:text-emerald-400">Net</span>
            </p>
          </div>
        </Link>

        {/* Auth entry point */}
        <div className="flex items-center gap-2">
          {!user ?
           <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-600 hover:shadow-emerald-500/40 dark:text-slate-950 dark:hover:bg-emerald-400 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
           >
            Operations Login
          </Link>
          :
          <button onClick={logout}
            className="inline-flex items-center justify-center rounded-lg border border-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 shadow-sm hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300 transition-all duration-300 cursor-pointer"
           >
            Logout
          </button>
          }
          
        </div>
      </div>
    </header>
  );
};

export default Header;