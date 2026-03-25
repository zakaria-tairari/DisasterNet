import { Routes, Route, Navigate } from "react-router-dom";
import Report from "./pages/Report";
import Login from "./pages/Login";

// Layouts
import AdminLayout from "./components/layouts/AdminLayout";
import OperatorLayout from "./components/layouts/OperatorLayout";
import TeamLayout from "./components/layouts/TeamLayout";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import AdminReports from "./pages/admin/AdminReports";

// Operator Pages
import OperatorDashboard from "./pages/operator/OperatorDashboard";
import ReportQueue from "./pages/operator/ReportQueue";
import RegionTeams from "./pages/operator/RegionTeams";
import RegionMap from "./pages/operator/RegionMap";

// Team Pages
import MissionHistory from "./pages/team/MissionHistory";
import TeamProfile from "./pages/team/TeamProfile";

import AuthMiddleware from "./middlewares/AuthMiddleware";
import GuestMiddleware from "./middlewares/GuestMiddleware";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import Loading from "./components/Loading";
import { AlertContext } from "./contexts/AlertContext";
import Alert from "./components/Alert";
import AdminMap from "./pages/admin/AdminMap";
import TeamDashboard from "./pages/team/TeamDashboard";
import Notifications from "./components/Notifications";

function App() {
  const { user, loading } = useContext(AuthContext);
  const { alert } = useContext(AlertContext);

  if (loading) return <Loading />

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <main className="flex-1">
        <Alert 
          type={alert.type}
          message={alert.message}
          onClose={prev => ({...prev, message: ""})}
        />
        {user && <Notifications user={user} />}
        <Routes>
          {/* Guest routes */}
          <Route element={<GuestMiddleware />}>
            <Route path="/" element={<Report />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AuthMiddleware role="admin" />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="map" element={<AdminMap />} />
              <Route path="users" element={<ManageUsers />} />
            </Route>
          </Route>

          {/* Operator routes */}
          <Route path="/operator" element={<AuthMiddleware role="operator" />}>
            <Route element={<OperatorLayout />}>
              <Route index element={<OperatorDashboard />} />
              <Route path="queue" element={<ReportQueue />} />
              <Route path="teams" element={<RegionTeams />} />
              <Route path="map" element={<RegionMap />} />
            </Route>
          </Route>

          {/* Team routes */}
          <Route path="/team" element={<AuthMiddleware role="team" />}>
            <Route element={<TeamLayout />}>
              <Route index element={<TeamDashboard />} />
              <Route path="history" element={<MissionHistory />} />
              <Route path="profile" element={<TeamProfile />} />
            </Route>
          </Route>
            
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
