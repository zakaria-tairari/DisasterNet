import { onCall, HttpsError } from "firebase-functions/https";
import admin from "firebase-admin";

admin.initializeApp();

export const createUser = onCall(async (request) => {
  if (!request.auth)
    throw new HttpsError("unauthenticated", "User must be authenticated.");

  const callerUid = request.auth.uid;
  const caller = await admin.auth().getUser(callerUid);

  if (!caller.customClaims || caller.customClaims.role !== "admin")
    throw new HttpsError("permission-denied", "Only admins can create users.");

  const { displayName, email, password, role, region } = request.data;

  if (!displayName || !email || !password || !role)
    throw new HttpsError("invalid-argument", "Missing required fields.");

  if (role !== "admin" && !region)
    throw new HttpsError("invalid-argument", "Region is required for this role.");

  try {
    const existing = await admin
      .firestore()
      .collection("users")
      .where("displayName", "==", displayName)
      .get();

    if (!existing.empty) {
      throw new HttpsError(
        "already-exists",
        "Display name is already in use."
      );
    }

    const newUser = await admin.auth().createUser({
      displayName,
      email,
      password,
    });

    await admin.auth().setCustomUserClaims(newUser.uid, { role });

    const userData = { displayName, email, role };
    if (role !== "admin") userData.region = region;

    await admin.firestore().collection("users").add(userData);

    return { success: true, uid: newUser.uid };
  } catch (error) {
    console.error("Error creating user:", error);

    if (error.code === "auth/email-already-exists") {
      throw new HttpsError("already-exists", "Email is already in use.");
    }
    if (error.code === "auth/invalid-password") {
      throw new HttpsError(
        "invalid-argument",
        "Password is invalid (must be at least 6 characters)."
      );
    }

    if (error instanceof HttpsError) throw error;

    throw new HttpsError("internal", "An unexpected error occurred.");
  }
});