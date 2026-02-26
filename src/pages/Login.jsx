import React, { useState, useEffect } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import SocialButton from "../components/SocialButton";
import RoleSelector from "../components/RoleSelector";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import ErrorMessage from "../components/ErrorMessage";
import { getFirebaseErrorMessage } from "../lib/firebaseErrors";

const Login = () => {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);
  const [role, setRole] = useState("operator");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!loading && user) {
      navigate(`/${user.role}`, { replace: true });
    }
  }, [user, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage("All fields are required");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const message = getFirebaseErrorMessage(error.code);
      console.log(error.code);
      setErrorMessage(message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)]  bg-slate-950 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full  bg-slate-900/70 backdrop-blur-xl border  border-slate-700/60 shadow-2xl rounded-2xl p-8 space-y-7">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-400/80">
            Disasternet • Morocco
          </p>
          <h2 className="text-3xl font-bold  text-white">
            Secure Operations Login
          </h2>
          <p className="text-sm  text-slate-300/80">
            Access your real-time incident coordination dashboards.
          </p>
        </div>

        <RoleSelector onChange={setRole} role={role} />

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            id="email"
            label="Email"
            type="text"
            placeholder="operator@protectioncivile.ma"
            value={email}
            onChange={e => {setEmail(e.target.value); setErrorMessage("");}}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => {setPassword(e.target.value); setErrorMessage("")}}
          />

          <div className="flex items-center justify-between text-xs">
            <label className="inline-flex items-center gap-2  text-slate-300">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-slate-600  bg-slate-900 text-emerald-400 focus:ring-emerald-500"
              />
              Remember this device
            </label>
          </div>
          <ErrorMessage message={errorMessage} />

          <Button type="submit">Sign In to Dashboard</Button>
        </form>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-700" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-slate-700" />
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
          logged for audit and traceability during incidents.
        </p>
      </div>
    </div>
  );
};

export default Login;