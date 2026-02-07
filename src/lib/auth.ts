import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword as firebaseCreateUserWithEmailAndPassword,
} from "firebase/auth";
import type { UserCredential } from "firebase/auth";
import { getAuth } from "./firebase";
import { User } from "next-auth";
import { getNotThrow } from "../models/user";
import type { Auth } from "firebase/auth";
import type { Auth as AdminAuth } from "firebase-admin/auth";

const isClientAuth = (auth: Auth | AdminAuth): auth is Auth => {
  return "currentUser" in auth;
};

export const signInWithEmail = async (
  auth: Auth,
  email: string,
  password: string,
): Promise<User | null> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
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
      role: userData?.role ?? "user",
    };
  } catch (error) {
    console.error("Firebase authentication error:");
    console.dir(error, { depth: null });
    return null;
  }
};

export const signOut = async (
  auth: Auth | AdminAuth,
): Promise<void> => {
  try {
    const firebaseAuth = await getAuth();
    await firebaseSignOut(firebaseAuth);
  } catch (error) {
    console.error("Firebase sign out error:");
    console.dir(error, { depth: null });
    throw error;
  }
};

type ForgetPasswordResult = { success: true } | { success: true; link: string } | { success: false; error: unknown };

export const forgetPassword = async (
  auth: Auth | AdminAuth,
  email: string,
): Promise<ForgetPasswordResult> => {
  try {
    if (isClientAuth(auth)) {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    }
    const link = await auth.generatePasswordResetLink(email);
    console.dir(link, { depth: null });
    return { success: true, link };
  } catch (error) {
    console.error("Firebase password reset error:");
    console.dir(error, { depth: null });
    return { success: false, error };
  }
};

export const createUserWithEmailAndPassword = async (
  auth: Auth | AdminAuth,
  email: string,
  password: string,
): Promise<User | null> => {
  try {
    const { uid, email: userEmail } = await (async () => {
      if (isClientAuth(auth)) {
        const userCredential = await firebaseCreateUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        if (!userCredential?.user?.email) {
          throw new Error("Failed to create user");
        }
        return {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
        };
      } else {
        const userRecord = await auth.createUser({
          email,
          password,
        });
        return {
          uid: userRecord.uid,
          email: userRecord.email || null,
        };
      }
    })();

    return {
      id: uid,
      name: "",
      email: userEmail ?? "",
      image: "",
    };
  } catch (error) {
    console.error("Firebase sign up error:");
    console.dir(error, { depth: null });
    return null;
  }
};  
