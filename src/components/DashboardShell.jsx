import React, { useState } from "react";
import SideBar from "./SideBar";
import { useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/config";
import ThemeToggle from "./ThemeToggle";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

const DashboardShell = ({ navItems, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fullWidth = location.pathname.includes("/map");
  
    const logout = async () => {
      const uid = auth.currentUser.uid;

      const docRef = doc(db, "users", uid);
      await updateDoc(docRef, {
        active: false,
        lastSeen: serverTimestamp()
      });

      await signOut(auth);
      navigate("/", {replace: true});
    }

  return (


    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex transition-colors duration-300">
      
      {/* Sidebar */}
      <SideBar items={navItems} collapsed={collapsed} />

      {/* Main content */}
      <section
        className={`flex-1 flex flex-col transition-all duration-300 ${
          collapsed ? "md:ml-16.5" : "md:ml-65"
        }`}
      >
        {/* Top bar with burger */}
        <div className="flex sticky top-0 z-50 items-center justify-between w-full p-2 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
          <div>
            <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-full text-sm text-slate-400 dark:text-slate-600 hover:text-emerald-500 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu-icon lucide-menu"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>
          </button>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={logout}
            className="inline-flex items-center justify-center rounded-lg border border-emerald-500 px-4 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 shadow-sm hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300 transition-all duration-300 cursor-pointer"
           >
            Logout
          </button>
          </div>
        </div>

        <div className={`flex-1 overflow-y-auto ${fullWidth || "px-10 py-5"} bg-slate-50 dark:bg-slate-950 transition-colors duration-300`}>
          <div className="mx-auto space-y-6">{children}</div>
        </div>
      </section>
    </div>
  );
};

export default DashboardShell;