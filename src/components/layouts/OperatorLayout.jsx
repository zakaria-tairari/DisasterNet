import React from "react";
import DashboardShell from "../DashboardShell";
import { Outlet } from "react-router-dom";

const OperatorLayout = () => {
  const navItems = [
    { to: "/operator", label: "Overview" },
    { to: "/operator/queue", label: "Report Queue" },
    { to: "/operator/teams", label: "Region Teams" },
    { to: "/operator/map", label: "GIS Map" },
  ];

  return (
    <DashboardShell navItems={navItems}>
      <Outlet />
    </DashboardShell>
  );
};

export default OperatorLayout;
