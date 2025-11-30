import { initializeApp } from 'firebase/app';
import type { FirebaseOptions,  FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import {
  getAuth as getAuthFirebase,
  signInWithEmailAndPassword,
  type Auth,
  type UserCredential
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import config from '@/config';

class FirebaseService {
  private static instance: FirebaseService;
  private appPromise: Promise<FirebaseApp> | null = null;
  private dbPromise: Promise<Firestore> | null = null;
  private authPromise: Promise<Auth> | null = null;

  // private constructor to prevent direct instantiation.
  private constructor() {}

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  public getApp(): Promise<FirebaseApp> {
    if (!this.appPromise) {
      this.appPromise = (async () => {
        const firebaseClientConfig: FirebaseOptions = await import(`config-submodule/${config.FIREBASE_CLIENT_CREDENTIALS}`);
        return initializeApp(firebaseClientConfig);
      })();
    }
    return this.appPromise;
  }

  public getDB(): Promise<Firestore> {
    if (!this.dbPromise) {
      this.dbPromise = (async () => {
        const app = await this.getApp();
        return getFirestore(app);
      })();
    }
    return this.dbPromise;
  }

  public getAuth(): Promise<Auth> {
    if (!this.authPromise) {
      this.authPromise = (async () => {
        const app = await this.getApp();
        return getAuthFirebase(app);
      })();
    }
    return this.authPromise;
  }

  public async signInWithEmail(email: string, password: string): Promise<UserCredential | null> {
    try {
      const firebaseAuth = await this.getAuth();
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      return userCredential;
    } catch (error) {
      console.error("Firebase authentication error:", error);
      return null;
    }
  }
}

const firebaseService = FirebaseService.getInstance();

export const getApp = async () => firebaseService.getApp();
export const getDB = async () => firebaseService.getDB();
export const getAuth = async () => firebaseService.getAuth();

export const FIRESTORE_COLLECTION_NAME_PREFIX = 'meditation_app'