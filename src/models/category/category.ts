import { FIRESTORE_COLLECTION_NAME_PREFIX } from "@/lib/firebase";
import { getAdminFirestore } from "@/lib/firebaseAdmin";

export const CATEGORY_COLLECTION_NAME = `${FIRESTORE_COLLECTION_NAME_PREFIX}_categories`;

export const categoryCollection = async () => (await getAdminFirestore()).collection(CATEGORY_COLLECTION_NAME);
