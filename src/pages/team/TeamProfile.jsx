import React, { useState, useEffect, useContext } from "react";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";
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
    if (!user?.teamId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "teams", user.teamId),
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
    if (!teamData?.id) return;
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

  const removeMember = async (memberIndex) => {
    if (!teamData?.id || !teamData.members) return;
    const updatedMembers = [...teamData.members];
    updatedMembers.splice(memberIndex, 1);
    await handleUpdate("members", updatedMembers);
  };

  if (loading) return <Loading />;

  if (!teamData) {
    return (
      <div className="text-center py-12 bg-white dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 dark:text-slate-400">No team profile found. Ensure your account is assigned to a Team ID.</p>
      </div>
    );
  }
  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50 transition-colors">
            Team Profile
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your unit's status, members, and equipment.
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

      <div className="grid lg:grid-cols-[1.5fr,1fr] gap-6">
        <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm dark:shadow-none space-y-6 transition-colors">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Unit Details</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Unit Name" value={teamData.name || ""} disabled />
            <Input label="Registration ID" value={teamData.id || ""} disabled />
            <Input label="Assigned Region" value={teamData.region || ""} disabled />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1">Vehicle Type</label>
              <select 
                value={teamData.vehicleType || "Type A (Ambulance)"}
                onChange={(e) => handleUpdate("vehicleType", e.target.value)}
                disabled={saving}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
               >
                <option value="Type A (Ambulance)">Type A (Ambulance)</option>
                <option value="Type B (Fire Engine)">Type B (Fire Engine)</option>
                <option value="Type C (Heavy Rescue)">Type C (Heavy Rescue)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm dark:shadow-none transition-colors">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Crew Members</h2>
          
          <div className="space-y-3">
            {teamData.members && teamData.members.length > 0 ? (
              teamData.members.map((member, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{member}</span>
                  <button onClick={() => removeMember(idx)} disabled={saving} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 italic pb-2">No crew members assigned.</p>
            )}
            <button className="w-full py-2.5 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              + Add Crew Member
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamProfile;
