import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

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
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur">
      <div className="mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="leading-tight">
            <p className="font-semibold tracking-wide text-white">
              Disaster<span className="text-emerald-400">Net</span>
            </p>
            <p className="text-[11px] text-slate-400">
              National Emergency Platform
            </p>
          </div>
        </Link>

        {/* Auth entry point */}
        <div className="flex items-center gap-2">
          {!user ?
           <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-slate-950 shadow-sm hover:bg-emerald-400 transition cursor-pointer"
           >
            Login
          </Link>
          :
          <button onClick={logout}
            className="inline-flex items-center justify-center rounded-lg border border-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-emerald-500 shadow-sm hover:bg-emerald-400 hover:text-slate-950 transition cursor-pointer"
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