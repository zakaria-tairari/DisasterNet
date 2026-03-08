import React from "react";
import DashboardShell from "../DashboardShell";
import { Outlet } from "react-router-dom";

const TeamLayout = () => {
  const navItems = [
    { to: "/team", label: "Active Missions" },
    { to: "/team/history", label: "Mission History" },
    { to: "/team/profile", label: "Team Profile" },
  ];

  return (
    <DashboardShell navItems={navItems}>
      <Outlet />
    </DashboardShell>
  );
};

export default TeamLayout;
