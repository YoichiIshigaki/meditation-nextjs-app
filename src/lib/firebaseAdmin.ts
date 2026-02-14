import * as admin from "firebase-admin";
import config from "@/config";

class FirebaseAdminService {
  private static instance: FirebaseAdminService;
  private initialized = false;

  private constructor() {}

  public static getInstance(): FirebaseAdminService {
    if (!FirebaseAdminService.instance) {
      FirebaseAdminService.instance = new FirebaseAdminService();
    }
    return FirebaseAdminService.instance;
  }

  private async initialize(): Promise<void> {
    if (this.initialized || admin.apps.length > 0) {
      this.initialized = true;
      return;
    }

    const serviceAccountModule = await import(
      `config-submodule/${config.FIREBASE_ADMIN_CREDENTIALS}`
    );
    const serviceAccount = serviceAccountModule.default || serviceAccountModule;
    const projectId = serviceAccount.project_id;
    const storageBucket = `${projectId}.appspot.com`;

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      storageBucket,
    });

    this.initialized = true;
  }

  public async getAuth(): Promise<admin.auth.Auth> {
    await this.initialize();
    return admin.auth();
  }

  public async getFirestore(): Promise<admin.firestore.Firestore> {
    await this.initialize();
    return admin.firestore();
  }

  public async getStorage(): Promise<admin.storage.Storage> {
    await this.initialize();
    return admin.storage();
  }
}

const firebaseAdminService = FirebaseAdminService.getInstance();

export const getAdminAuth = () => firebaseAdminService.getAuth();
export const getAdminFirestore = () => firebaseAdminService.getFirestore();
export const getAdminStorage = () => firebaseAdminService.getStorage();
