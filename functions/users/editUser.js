import { onCall, HttpsError } from "firebase-functions/https";
import admin from "firebase-admin";

export const editUser = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }

  const callerUid = request.auth.uid;
  const caller = await admin.auth().getUser(callerUid);

  if (!caller.customClaims || caller.customClaims.role === "team") {
    throw new HttpsError("permission-denied", "Only admins and operators can edit users.");
  }

  const { uid, displayName, email, region, teamType } = request.data;

  if (!uid) {
    throw new HttpsError("invalid-argument", "User ID is required.");
  }

  if (!displayName || !email) {
    throw new HttpsError(
      "invalid-argument",
      "Missing fields.",
    );
  }

  try {
    const targetUser = await admin.auth().getUser(uid);
    const role = targetUser.customClaims.role;

    if (!targetUser) {
      throw new HttpsError("not-found", "User not found.");
    }

    if (role !== "admin" && !region) {
    throw new HttpsError(
      "invalid-argument",
      "Region is required for this role.",
    );
  }

    if (role === "team" && !teamType) {
    throw new HttpsError(
      "invalid-argument",
      "Type is required for this role.",
    );
  }

    // Prevent duplicate display names
    const existing = await admin
      .firestore()
      .collection("users")
      .where("displayName", "==", displayName)
      .get();

    const duplicate = existing.docs.find((doc) => doc.id !== uid);
    if (duplicate) {
      throw new HttpsError("already-exists", "Display name is already in use.");
    }

    // Prepare update object for Auth
    const updateAuthData = { displayName };
    if (email) updateAuthData.email = email;

    await admin.auth().updateUser(uid, updateAuthData);

    // Update Firestore
    const userData = { displayName };
    if (role !== "admin") {
      userData.region = region;
    } else {
      userData.region = admin.firestore.FieldValue.delete();
    }

    if (role === "team") {
      userData.type = teamType;
    } else {
      userData.type = admin.firestore.FieldValue.delete();
    }

    if (email) userData.email = email;

    await admin.firestore().collection("users").doc(uid).update(userData);

    return { success: true, uid };
  } catch (error) {
    console.error("Error editing user:", error);

    // Re-throw HttpsError if already exists
    if (error instanceof HttpsError) throw error;

    // Throw generic internal error for any other failures
    throw new HttpsError("internal", "Failed to create user.");
  }
});
