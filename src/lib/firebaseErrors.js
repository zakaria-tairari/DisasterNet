export const getFirebaseErrorMessage = (code) => {
  switch (code) {
    // Auth login errors
    case "auth/invalid-email":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password.";

    case "auth/too-many-requests":
      return "Too many failed attempts. Try again later.";

    case "auth/network-request-failed":
      return "Network error. Please check your connection.";

    // Cloud Function errors
    case "functions/already-exists":
      return "Email or display name is already in use.";

    case "functions/invalid-argument":
      return "Missing required fields or invalid input.";

    case "functions/permission-denied":
      return "You do not have permission to perform this action.";

    case "fucntions/unauthenticated":
      return "You must be logged in to perform this action.";

    case "internal":
      return "An unexpected server error occurred. Please try again.";

    default:
      return "Something went wrong. Please try again.";
  }
};