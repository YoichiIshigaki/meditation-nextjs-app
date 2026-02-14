import { FIRESTORE_COLLECTION_NAME_PREFIX } from "@/lib/firebase";
import { getAdminFirestore } from "@/lib/firebaseAdmin";

export const USER_COLLECTION_NAME = `${FIRESTORE_COLLECTION_NAME_PREFIX}_users`;

export const userCollection = async () =>
  (await getAdminFirestore()).collection(USER_COLLECTION_NAME);
