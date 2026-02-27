import React from "react";
import RoleSelector from "../RoleSelector";
import Input from "../Input";
import Button from "../Button";
import { useState } from "react";

const CreateUserForm = () => {

    const [role, setrole] = useState("operator");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [region, setRegion] = useState("");

  return (
    <div className="rounded-xl border border-emerald-500/40 bg-slate-900/80 p-4 space-y-3">
      <h2 className="text-sm font-semibold text-slate-100">
        Create new account
      </h2>
      <p className="text-[11px] text-slate-400">
        In your Firebase implementation, this form should create a user in Auth
        and store role / region in Firestore or custom claims.
      </p>
      <form className="space-y-3">
        <RoleSelector onChange={setrole} role={role} />
        <Input placeholder="Username" onChange={e => setUsername(e.target.value)} value={username} />
        <Input placeholder="Email" onChange={e => setEmail(e.target.value)} value={email} />
        <select 
        value={region}
        onChange={e => setRegion(e.target.value)}
        disabled={role === "admin"}
        className={`w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 
        ${role === "admin" ? "text-slate-700" : "text-slate-50"}`
        }>
          <option value="">
            {role === "admin" ? "Region not required for admin" : "Select region"}
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
    </div>
  );
};

export default CreateUserForm;
