import { onCall, HttpsError } from "firebase-functions/https";
import admin from "firebase-admin";

export const createUser = onCall(async (request) => {
  if (!request.auth)
    throw new HttpsError("unauthenticated", "User must be authenticated.");

  const callerUid = request.auth.uid;
  const caller = await admin.auth().getUser(callerUid);

  if (!caller.customClaims || caller.customClaims.role !== "admin")
    throw new HttpsError("permission-denied", "Only admins can create users.");

  const { displayName, email, password, role, region, teamType } = request.data;

  if (!displayName || !email || !password || !role)
    throw new HttpsError("invalid-argument", "Missing required fields.");

  if (role !== "admin" && !region)
    throw new HttpsError(
      "invalid-argument",
      "Region is required for this role.",
    );

    if (role === "team" && !teamType) {
    throw new HttpsError(
      "invalid-argument",
      "Type is required for this role.",
    );
  }

  try {
    const existing = await admin
      .firestore()
      .collection("users")
      .where("displayName", "==", displayName)
      .get();

    if (!existing.empty) {
      throw new HttpsError("already-exists", "Display name is already in use.");
    }

    const newUser = await admin.auth().createUser({
      displayName,
      email,
      password,
    });

    await admin.auth().setCustomUserClaims(newUser.uid, { role });

    const userData = { displayName, email, role };
    if (role !== "admin") userData.region = region;

    if (role === "team") userData.type = teamType;

    await admin.firestore().collection("users").doc(newUser.uid).set(userData);

    return { success: true, uid: newUser.uid };
  } catch (error) {
    console.error("Error creating user:", error);

    // Re-throw HttpsError if already exists
    if (error instanceof HttpsError) throw error;

    // Throw generic internal error for any other failures
    throw new HttpsError("internal", "Failed to create user.");
  }
});
