import { signInWithEmailAndPassword, signOut as firebaseSignOut, sendPasswordResetEmail } from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';
import { getAuth } from "./firebase"
import { User } from 'next-auth';
import { getNotThrow } from '../models/user';

export const signInWithEmail = async (email: string, password: string): Promise<User | null> => {
  try { 
    const firebaseAuth = await getAuth();
    const userCredential: UserCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    
    console.dir(userCredential.user.providerData, { depth: null })
    
    // 仮のユーザー名
    const temporaryUserName =  userCredential.user.displayName || userCredential.user.email?.split('@')[0]
    // const providerUser = userCredential.user.providerData; 
    const userData = await getNotThrow(userCredential.user.uid)
    const userName = userData ? `${userData.first_name} ${userData.last_name}` : temporaryUserName;
        
    console.log(userCredential.user.uid)
    const altImageUrl = "https://i.pinimg.com/736x/74/61/e4/7461e4ab734d81af34c7982910c2d20e.jpg"
    return { 
      id: userCredential.user.uid,
      name: userName,
      email: userCredential.user.email,
      image:  userData?.thumbnail_url ?? userCredential.user.photoURL ?? altImageUrl,
    };

  } catch (error) {
    console.error("Firebase authentication error:");
    console.dir(error, { depth: null })
    return null;
  }
}

export const signOut = () => {}

export const forgetPassword = () => {}
