import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import admin from "firebase-admin";

export const notifyTeamAssignment = onDocumentUpdated(
  "reports/{reportId}",
  async (event) => {
    const before = event.data.before.data();
    const after = event.data.after.data();
    const reportId = event.params.reportId;

    const beforeTeamId = before.assignedTeam?.id || null;
    const afterTeamId = after.assignedTeam?.id || null;

    // Only trigger if assignedTeam was added or changed
    if (beforeTeamId === afterTeamId || !after.assignedTeam) return;

    const notification = {
      type: "team_assignment",
      title: "Incident Assigned to Your Team",
      message: `An incident has been assigned to your team.`,
      incidentId: reportId,
      targetRole: "team",
      targetRegion: after.region,
      targetTeam: after.assignedTeam,
      readBy: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await admin.firestore().collection("notifications").add(notification);
  }
);