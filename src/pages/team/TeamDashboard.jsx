import React, { useState, useEffect, useContext } from "react";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";
import AltButton from "../../components/AltButton";
import { AuthContext } from "../../contexts/AuthContext";
import { collection, query, where, onSnapshot, doc, updateDoc, deleteField, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import Loading from "../../components/Loading";
import { getDate } from "../../lib/firebaseGetDate";
import TeamMap from "../../components/map/TeamMap";
import ReportMap from "../../components/map/ReportMap";

const TeamDashboard = () => {
  const { user } = useContext(AuthContext);
  const [incident, setIncident] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const teamRef = doc(db, "users", user.uid);

    const q = query(
  collection(db, "reports"),
  where("assignedTeam", "==", teamRef),
  where("status", "not-in", ["resolved"])
);


    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Show only active incident
      setIncident(data[0]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleUpdateStatus = async (reportId, newReportStatus, newTeamStatus) => {
    try {
      if (newReportStatus === "on_site") {
        await updateDoc(doc(db, "reports", reportId), {
          status: newReportStatus,
          onSiteAt: serverTimestamp()
        });
      } else if (newReportStatus === "resolved") {
        await updateDoc(doc(db, "reports", reportId), {
          status: newReportStatus,
          resolvedAt: serverTimestamp()
        });
      }

      if (newTeamStatus && user) {
        await updateDoc(doc(db, "users", user.uid), {
          status: newTeamStatus
        });
      }

      if (newTeamStatus === "available") {
        await updateDoc(doc(db, "users", user.uid), {
          assignedIncident: deleteField()
        });
      }

    } catch (error) {
      console.error("Error updating mission status:", error);
      alert("Failed to update status.");
    }
  };

  if (loading) return <Loading />;
  return (
        <div className="h-[calc(100vh-4rem)]">

          <TeamMap
            zoom={6}
            incident={incident}
            updateStatus={handleUpdateStatus}
          />
        </div>
  );
};

export default TeamDashboard;

