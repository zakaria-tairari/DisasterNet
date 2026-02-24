import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import SocialButton from "../components/SocialButton";

const Login = () => {
  const [role, setRole] = useState("operator");

  // Submit handler intentionally does not perform any auth
  // or navigation so you can plug in your own Firebase
  // logic later.
  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: Replace with Firebase Auth (signInWithEmailAndPassword,
    // signInWithPopup, etc.) and redirect based on the resolved role.
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-slate-950 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-slate-900/70 backdrop-blur-xl border border-slate-700/60 shadow-2xl rounded-2xl p-8 space-y-7">
        <div className="space-y-2 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-400/80">
            Disasternet • Morocco
          </p>
          <h2 className="text-3xl font-bold text-white">
            Secure Operations Login
          </h2>
          <p className="text-sm text-slate-300/80">
            Access your real-time incident coordination dashboards.
          </p>
        </div>

        {/* Role selector so one login screen works for all roles */}
        <div className="grid grid-cols-3 gap-2 text-xs font-medium bg-slate-800/80 rounded-xl p-1">
          {[
            { id: "admin", label: "Admin" },
            { id: "operator", label: "Operator" },
            { id: "team", label: "Field Team" },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setRole(option.id)}
              className={`px-3 py-2 rounded-lg transition text-center ${
                role === option.id
                  ? "bg-emerald-400 text-slate-900 shadow-sm"
                  : "text-slate-300 hover:bg-slate-700/70"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="operator@protectioncivile.ma"
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
          />

          <div className="flex items-center justify-between text-xs">
            <label className="inline-flex items-center gap-2 text-slate-300">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 rounded border-slate-600 bg-slate-900 text-emerald-400 focus:ring-emerald-500"
              />
              Remember this device
            </label>
            <button
              type="button"
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Forgot password?
            </button>
          </div>

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
            {/* Ideal place to plug in Firebase Google Auth */}
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