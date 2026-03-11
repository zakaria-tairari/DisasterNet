import React, { useState, useEffect, useContext } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import SocialButton from "../components/SocialButton";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Alert from "../components/Alert";
import { getFirebaseErrorMessage } from "../lib/firebaseErrors";
import { AlertContext } from "../contexts/AlertContext";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Login = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAlert } = useContext(AlertContext);

  useEffect(() => {
    if (!loading && user) {
      navigate(`/${user.role}`, { replace: true });
    }
  }, [user, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAlert({ type: "error", message: "All fields are required" });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAlert({ type: "error", message: getFirebaseErrorMessage(error.code) });
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-8rem)] bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-8 transition-colors duration-300">
        <div className="max-w-md w-full bg-white dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-700/60 shadow-2xl dark:shadow-none rounded-2xl p-8 space-y-7 transition-colors duration-300">
          <div className="space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400/80">
              Emergencynet • Morocco
            </p>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              Secure Operations Login
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300/80">
              Access your real-time report coordination dashboards.
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              id="email"
              label="Email"
              type="text"
              placeholder="operator@protectioncivile.ma"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between text-xs">
              <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-emerald-500 focus:ring-emerald-500 cursor-pointer transition-colors"
                />
                Remember this device
              </label>
            </div>

            <Button type="submit">Sign In to Dashboard</Button>
          </form>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>

            <div className="flex gap-4">
              <SocialButton>
                <span className="mr-2">🌐</span>
                Sign in with Google
              </SocialButton>
            </div>
          </div>

          <p className="text-[11px] text-slate-400/80 text-center leading-relaxed">
            Access is restricted to authorized personnel only. All actions are
            logged for audit and traceability during reports.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
