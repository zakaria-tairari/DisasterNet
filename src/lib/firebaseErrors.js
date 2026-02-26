export const getFirebaseErrorMessage = (code) => {
  switch (code) {
    case "auth/invalid-email":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password.";

    case "auth/too-many-requests":
      return "Too many failed attempts. Try again later.";

    case "auth/network-request-failed":
      return "Network error. Please check your connection.";

    default:
      return "Something went wrong. Please try again.";
  }
};