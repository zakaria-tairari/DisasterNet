import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase/config";
import Loading from "../../components/Loading";

const TeamProfile = () => {
  const { user } = useContext(AuthContext);
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  const TYPE_MAP = {
  fire: "Firefighting Unit",
  flood: "Civil Protection Unit",
  medical: "Medical Unit",
  traffic: "Traffic Police Unit",
  infrastructure: "Public Works Unit",
  other: "General Response Unit",
};

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-50">
          Team Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          View your team information and status.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <h2 className=" font-semibold text-slate-800 dark:text-slate-100 mb-6">
          Team Details
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          
          <div>
            <p className="text-sm text-slate-500">Team Name</p>
            <p className=" font-semibold text-slate-800 dark:text-slate-100">
              {teamData.displayName}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Region</p>
            <p className=" font-semibold text-slate-800 dark:text-slate-100">
              {teamData.region}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Type</p>
            <p className=" font-semibold text-slate-800 dark:text-slate-100">
              {TYPE_MAP[teamData.type]}
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default TeamProfile;