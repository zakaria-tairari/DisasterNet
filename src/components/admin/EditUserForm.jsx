import React, { useContext, useState } from "react";
import { AlertContext } from "../../contexts/AlertContext";
import Input from "../Input";
import Button from "../Button";
import { getFirebaseErrorMessage } from "../../lib/firebaseErrors";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase/config";

const EditUserForm = ({ user, refresh }) => {
    const { setAlert } = useContext(AlertContext);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [email, setEmail] = useState(user.email);
  const [region, setRegion] = useState(user.region || "");
  const [teamType, setTeamType] = useState(user.type || "");

  const handleEditUser = async (e) => {
    e.preventDefault();

    if (!displayName || !email) {
      setAlert({
        type: "error",
        message: "Missing fields.",
      });
      return;
    }

    if (user.role !== "admin" && !region) {
      setAlert({ type: "error", message: "Region is required for this role." });
      return;
    }

    if (user.role === "team" && !teamType) {
      setAlert({ type: "error", message: "Type is required for this role." });
      return;
    }

    const editUser = httpsCallable(functions, "editUser");

    try {
      await editUser({ uid: user.id, displayName, email, region, teamType });
      setAlert({ type: "success", message: "User updated successfully." });
      refresh();
    } catch (error) {
      setAlert({ type: "error", message: getFirebaseErrorMessage(error.code) });
    }
  };

  return (
    <>
      <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-4 transition-colors">
        Edit account
      </h2>
      <form className="space-y-4" onSubmit={handleEditUser}>
        <Input
          onChange={(e) => setDisplayName(e.target.value)}
          value={displayName}
          label="Username"
        />
        <Input
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        {user.role !== "admin" && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-100 transition-colors duration-300">Region
          <select
            defaultValue=""
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={`w-full px-4 py-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors shadow-sm`}
          >
            <option value="">Select region</option>
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
          </label>
        )}
        {
          user.role === "team" &&
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-100 transition-colors duration-300">Type
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
        </label>
        }

        <Button type="submit">Submit changes</Button>
      </form>
    </>
  );
};

export default EditUserForm;
