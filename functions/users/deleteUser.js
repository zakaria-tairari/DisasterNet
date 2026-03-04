import { onCall, HttpsError } from "firebase-functions/https";
import admin from "firebase-admin";

export const deleteUser = onCall(async (request) => {
  if (!request.auth)
    throw new HttpsError("unauthenticated", "User must be authenticated.");

  const callerUid = request.auth.uid;
  const caller = await admin.auth().getUser(callerUid);

  if (!caller.customClaims || caller.customClaims.role !== "admin")
    throw new HttpsError("permission-denied", "Only admins can delete users.");

  const { uid } = request.data;

  try {
    await admin.auth().deleteUser(uid);
    await admin.firestore().collection("users").doc(uid).delete();

    let selfDeleted = false;
    if (callerUid === uid) selfDeleted = true;

    return { success: true, uid, selfDeleted };
  } catch (error) {
    console.error("Error creating user:", error);

    // Re-throw HttpsError if already exists
    if (error instanceof HttpsError) throw error;

    // Throw generic internal error for any other failures
    throw new HttpsError("internal", "Failed to create user.");
  }
});
