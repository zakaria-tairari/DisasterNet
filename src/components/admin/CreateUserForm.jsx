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
  const [teamType, setTeamType] = useState("");
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

    if (role === "team" && !teamType) {
      setAlert({ type: "error", message: "Team type is required." });
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
        teamType,
      });
      setAlert({ type: "success", message: "User created successfuly." });
      refresh();
      setDisplayName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRegion("");
      setTeamType("");
    } catch (error) {
      setAlert({ type: "error", message: getFirebaseErrorMessage(error.code) });
      console.log(error.code);
    }
  };

  return (
    <>
      <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4 transition-colors">
        Create new account
      </h2>
      <form className="space-y-4" onSubmit={handleCreateUser}>
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
        {
          role !== "admin" && 
        <select
        defaultValue=""
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors shadow-sm text-slate-900 dark:text-slate-50"
        >
          <option disabled value="">
              Select region
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
        }
        {
          role === "team" &&
          <select
          defaultValue=""
          value={teamType}
          onChange={(e) => setTeamType(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors shadow-sm text-slate-900 dark:text-slate-50"
        >
          <option disabled value="">
              Type of the field team
          </option>
          <option value="fire">Firefighting Unit</option>
          <option value="flood">Civil Protection Unit</option>
          <option value="medical">Medical Unit</option>
          <option value="traffic">Traffic Police Unit</option>
          <option value="infrastructure">Public Works Unit</option>
          <option value="other">General Response Unit</option>
        </select>
        }
        <Button type="submit">Create Account</Button>
      </form>
    </>
  );
};

export default CreateUserForm;
