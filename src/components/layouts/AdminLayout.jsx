import React from "react";
import DashboardShell from "../DashboardShell";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const navItems = [
    { to: "/admin", label: "Overview" },
    { to: "/admin/reports", label: "All Reports" },
    { to: "/admin/users", label: "Manage Users" },
    { to: "/admin/teams", label: "Team Registry" },
  ];

  return (
    <DashboardShell navItems={navItems}>
      <Outlet />
    </DashboardShell>
  );
};

export default AdminLayout;
