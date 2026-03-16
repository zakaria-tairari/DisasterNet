import React, { useState, useEffect, useContext } from "react";
import Input from "../../components/Input";
import { AuthContext } from "../../contexts/AuthContext";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import Loading from "../../components/Loading";

const TeamProfile = () => {
  const { user } = useContext(AuthContext);
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const teamRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(
      teamRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setTeamData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setTeamData(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching team profile:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleUpdate = async (field, value) => {
    if (!teamData) return;

    setSaving(true);
    try {
      await updateDoc(doc(db, "teams", teamData.id), {
        [field]: value
      });
    } catch (error) {
      console.error("Error updating team profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  if (!teamData) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 dark:text-slate-400">
          No team profile found.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50">
            Team Profile
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View your team information and status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 font-medium">Status:</span>

          <select
            value={teamData.status || "Available"}
            onChange={(e) => handleUpdate("status", e.target.value)}
            disabled={saving}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none"
          >
            <option value="Available">🟢 Available</option>
            <option value="On Mission">🟡 On Mission</option>
            <option value="Offline">🔴 Offline</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6">
          Team Details
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Team Name" value={teamData.name || ""} disabled />
          <Input label="Team ID" value={teamData.id || ""} disabled />
          <Input label="Region" value={teamData.region || ""} disabled />
        </div>
      </div>
    </>
  );
};

export default TeamProfile;
