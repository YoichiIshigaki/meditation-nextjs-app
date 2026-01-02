import { FIRESTORE_COLLECTION_NAME_PREFIX, getDB } from "@/lib/firebase";
import { collection } from "firebase/firestore";

export const USER_MEDAL_COLLECTION_NAME = `${FIRESTORE_COLLECTION_NAME_PREFIX}_user_medals`;

export const userMedal = async () =>
  collection(await getDB(), USER_MEDAL_COLLECTION_NAME);
