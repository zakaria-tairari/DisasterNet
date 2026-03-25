import { onDocumentCreated } from "firebase-functions/v2/firestore";
import admin from "firebase-admin";

export const notifyNewIncident = onDocumentCreated(
  "reports/{reportId}",
  async (event) => {

    const incident = event.data.data();
    const reportId = event.params.reportId;

    await admin.firestore().collection("notifications").add({
      type: "new_incident",
      title: "New Emergency",
      message: `New incident reported in ${incident.region}`,
      incidentId: reportId,
      targetRole: "operator",
      targetRegion: incident.region,
      readBy: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
);