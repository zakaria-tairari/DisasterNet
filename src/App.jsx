import { Routes, Route } from "react-router-dom";
import Report from "./pages/Report";
import Login from "./pages/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import OperatorDashboard from "./pages/OperatorDashboard";
import TeamDashboard from "./pages/TeamDashboard";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Report />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/operator" element={<OperatorDashboard />} />
          <Route path="/team" element={<TeamDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
