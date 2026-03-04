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

    const editUser = httpsCallable(functions, "editUser");

    try {
      await editUser({ uid: user.id, displayName, email, region });
      setAlert({ type: "success", message: "User updated successfully." });
      refresh();
    } catch (error) {
      setAlert({ type: "error", message: getFirebaseErrorMessage(error.code) });
    }
  };

  return (
    <>
      <h2 className="text-sm font-semibold text-slate-100">
        Edit account
      </h2>
      <form className="space-y-3" onSubmit={handleEditUser}>
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
        {user.role !== "admin" && (
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 `}
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
        )}

        <Button type="submit">Submit changes</Button>
      </form>
    </>
  );
};

export default EditUserForm;
