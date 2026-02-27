import { Routes, Route, Navigate } from "react-router-dom";
import Report from "./pages/Report";
import Login from "./pages/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import TeamDashboard from "./pages/TeamDashboard";
import AuthMiddleware from "./middlewares/AuthMiddleware";
import GuestMiddleware from "./middlewares/GuestMiddleware";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import Loading from "./components/Loading";
import ManageUsers from "./pages/ManageUsers";

function App() {
  const { loading } = useContext(AuthContext);
  if (loading) return <Loading />

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />
      <main className="flex-1">
        <Routes>
          {/* Guest routes */}
          <Route element={<GuestMiddleware />}>
            <Route path="/" element={<Report />} />
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<AuthMiddleware role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
          </Route>

          {/* Operator routes */}
          <Route path="/operator" element={<AuthMiddleware role="operator" />}>
            <Route index element={<OperatorDashboard />} />
          </Route>

          {/* Team routes */}
          <Route path="team" element={<AuthMiddleware role="team" />}>
            <Route index element={<TeamDashboard />} />
          </Route>
            
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
