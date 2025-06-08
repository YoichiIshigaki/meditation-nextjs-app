import { signInWithEmailAndPassword } from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';
import { getAuth } from "./firebase"
import { User } from 'next-auth';

// const errorCode = {}

export const signInWithEmail = async (email: string, password: string): Promise<User | null> => {
  try { 
    const firebaseAuth = await getAuth();
    const userCredential: UserCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    
    // console.dir(userCredential, { depth: null })
    console.log("user info")
    console.dir(userCredential.user.providerData, { depth: null })
    // const providerUser = userCredential.user.providerData; 

    return { 
      id: userCredential.user.uid,
      name: userCredential.user.displayName,
      email: userCredential.user.email,
      image: userCredential.user.photoURL
    };

  } catch (error) {
    console.error("Firebase authentication error:");
    console.dir(error, { depth: null })
    return null;
  }
}

export const signOut = () => {}

export const forgetPassword = () => {}
