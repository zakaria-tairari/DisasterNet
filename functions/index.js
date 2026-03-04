import admin from "firebase-admin";
import { createUser } from "./users/createUser.js";
import { deleteUser } from "./users/deleteUser.js";
import { editUser } from "./users/editUser.js";

admin.initializeApp();

export { createUser, editUser, deleteUser }



