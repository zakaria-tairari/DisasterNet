import React, { useState, useEffect, useContext } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { getFirebaseErrorMessage } from "../lib/firebaseErrors";
import { AlertContext } from "../contexts/AlertContext";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { updateDoc, doc } from "firebase/firestore";

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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setAlert({ type: "error", message: "All fields are required" });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const uid = userCredential.user.uid;

      const docRef = doc(db, "users", uid);
      await updateDoc(docRef, {
        active: true,
      });
    } catch (error) {
      console.log(error);
  console.log(error.code);
  console.log(error.message);
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
          <form className="space-y-4" onSubmit={handleLogin}>
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

            <Button type="submit">Sign In to Dashboard</Button>
          </form>

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
