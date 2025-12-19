import { FIRESTORE_COLLECTION_NAME_PREFIX, getDB } from "@/lib/firebase";
import { collection } from "firebase/firestore";

export const MEDITATION_HISTORY_COLLECTION_NAME = `${FIRESTORE_COLLECTION_NAME_PREFIX}_meditation_histories`;

export const meditationHistory = async () =>
  collection(await getDB(), MEDITATION_HISTORY_COLLECTION_NAME);
