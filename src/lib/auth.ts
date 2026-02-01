import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import type { UserCredential } from "firebase/auth";
import { getAuth } from "./firebase";
import { User } from "next-auth";
import { getNotThrow } from "../models/user";

export const signInWithEmail = async (
  email: string,
  password: string,
): Promise<User | null> => {
  try {
    const firebaseAuth = await getAuth();
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password,
    );

    console.dir(userCredential.user.providerData, { depth: null });

    // 仮のユーザー名
    const temporaryUserName =
      userCredential.user.displayName ||
      userCredential.user.email?.split("@")[0];
    const userData = await getNotThrow(userCredential.user.uid);
    const userName = userData
      ? `${userData.first_name} ${userData.last_name}`
      : temporaryUserName;

    return {
      id: userCredential.user.uid,
      name: userName,
      email: userCredential.user.email,
      image:
        userData?.thumbnail_url ?? userCredential.user.photoURL ?? "",
    };
  } catch (error) {
    console.error("Firebase authentication error:");
    console.dir(error, { depth: null });
    return null;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    const firebaseAuth = await getAuth();
    await firebaseSignOut(firebaseAuth);
  } catch (error) {
    console.error("Firebase sign out error:");
    console.dir(error, { depth: null });
    throw error;
  }
};

export const forgetPassword = async (
  email: string,
): Promise<{ success: boolean; error?: unknown }> => {
  try {
    const firebaseAuth = await getAuth();
    const result = await sendPasswordResetEmail(firebaseAuth, email);
    console.dir(result, { depth: null });
    return { success: true };
  } catch (error) {
    console.error("Firebase password reset error:");
    console.dir(error, { depth: null });
    return { success: false, error };
  }
};
