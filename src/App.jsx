import { Routes, Route } from "react-router-dom";
import Report from "./pages/Report";
import Login from "./pages/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import TeamDashboard from "./pages/TeamDashboard";
import AuthMiddleware from "./middlewares/AuthMiddleware";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Report />} />
          <Route path="/login" element={<Login />} />

          <Route element={<AuthMiddleware role="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route element={<AuthMiddleware role="operator" />}>
            <Route path="/operator" element={<OperatorDashboard />} />
          </Route>

          <Route element={<AuthMiddleware role="team" />}>
            <Route path="/team" element={<TeamDashboard />} />
          </Route>
            
          
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
