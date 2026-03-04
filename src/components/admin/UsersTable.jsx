import React, { useContext } from "react";
import AltButton from "../AltButton";
import { Link } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { auth, functions } from "../../firebase/config";
import Alert from "../Alert";
import { getFirebaseErrorMessage } from "../../lib/firebaseErrors";
import { signOut } from "firebase/auth";
import { AlertContext } from "../../contexts/AlertContext";
import PopupButton from "../PopupButton";
import EditUserForm from "./EditUserForm";

const UsersTable = ({ users, link, refresh }) => {
  const { setAlert } = useContext(AlertContext);

  const handleDeleteUser = async (e) => {
    const uid = e.currentTarget.value;

    const deleteUser = httpsCallable(functions, "deleteUser");

    try {
      const result = await deleteUser({ uid });
      if (result.data.selfDeleted) await signOut(auth);

      await refresh();
      setAlert({ type: "success", message: "User deleted." });
    } catch (error) {
      setAlert({
        type: "error",
        message: getFirebaseErrorMessage(error.code),
      });
    }
  };

  return (
    <div className="rounded-xl border  border-slate-800  bg-slate-900/80 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-100">
          Manage accounts
        </h2>
        {link && (
          <Link
            to={"/admin/users"}
            className="text-[11px] text-emerald-300 hover:text-emerald-200"
          >
            {link}
          </Link>
        )}
      </div>
      <div className="space-y-2">
        {users.map((account) => (
          <div
            key={account.id}
            className="flex items-center justify-between rounded-lg border  border-slate-800  bg-slate-900 px-3 py-2.5"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-slate-100">
                {account.displayName}
              </p>
              <p className="text-[11px] text-slate-400">
                {account.role} {account.region ? "• " + account.region : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <PopupButton
                buttonText="Edit"
                style="text-[11px] px-2 py-1 rounded-lg cursor-pointer text-slate-300 border border-slate-500/40 hover:bg-slate-600/10"
              >
                <EditUserForm
                  user={account}
                  refresh={refresh}
                />
              </PopupButton>
              <AltButton
                variant="danger"
                value={account.id}
                onClick={handleDeleteUser}
              >
                Delete
              </AltButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersTable;
