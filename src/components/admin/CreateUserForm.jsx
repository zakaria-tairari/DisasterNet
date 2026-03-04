import React, { useContext } from "react";
import RoleSelector from "../RoleSelector";
import Input from "../Input";
import Button from "../Button";
import { useState } from "react";
import Alert from "../Alert";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase/config";
import { getFirebaseErrorMessage } from "../../lib/firebaseErrors";
import { AlertContext } from "../../contexts/AlertContext";

const CreateUserForm = ({ refresh }) => {
  const [role, setRole] = useState("operator");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [region, setRegion] = useState("");
  const { setAlert } = useContext(AlertContext);

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!displayName || !email || !password || !confirmPassword || !role) {
      setAlert({ type: "error", message: "Missing fields." });
      return;
    }

    if (role !== "admin" && !region) {
      setAlert({ type: "error", message: "Region is required." });
      return;
    }

    if (password !== confirmPassword) {
      setAlert({ type: "error", message: "Failed password confirmation." });
      return;
    }

    const createUser = httpsCallable(functions, "createUser");
    try {
      await createUser({
        displayName,
        email,
        password,
        role,
        region,
      });
      setAlert({ type: "success", message: "User created successfuly." });
      refresh();
      setDisplayName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRegion("");
    } catch (error) {
      setAlert({ type: "error", message: getFirebaseErrorMessage(error.code) });
      console.log(error.code);
    }
  };

  return (
    <>
      <h2 className="text-sm font-semibold text-slate-100">
        Create new account
      </h2>
      <form className="space-y-3" onSubmit={handleCreateUser}>
        <RoleSelector onChange={setRole} role={role} />
        <Input
          placeholder="Username"
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName}
        />
        <Input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <Input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <Input
          placeholder="Confirm password"
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          disabled={role === "admin"}
          className={`w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 
        ${role === "admin" ? "text-slate-700" : "text-slate-50"}`}
        >
          <option value="">
            {role === "admin"
              ? "Region not required for admin"
              : "Select region"}
          </option>
          <option value="casablanca">Casablanca‑Settat</option>
          <option value="rabat">Rabat‑Salé‑Kénitra</option>
          <option value="marrakech">Marrakech‑Safi</option>
          <option value="tangier">Tanger‑Tétouan‑Al Hoceïma</option>
          <option value="oriental">L&apos;Oriental</option>
          <option value="fes">Fès‑Meknès</option>
          <option value="beni-mellal">Béni Mellal‑Khénifra</option>
          <option value="souss">Souss‑Massa</option>
          <option value="guelmim">Guelmim‑Oued Noun</option>
          <option value="laayoune">Laâyoune‑Sakia El Hamra</option>
          <option value="dakhla">Dakhla‑Oued Ed Dahab</option>
        </select>
        <Button type="submit">Create Account</Button>
      </form>
    </>
  );
};

export default CreateUserForm;
