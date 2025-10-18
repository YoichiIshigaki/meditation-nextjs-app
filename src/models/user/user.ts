import { FIRESTORE_COLLECTION_NAME_PREFIX, getDB } from "@/lib/firebase"
import { collection } from 'firebase/firestore'

export const USER_COLLECTION_NAME = `${FIRESTORE_COLLECTION_NAME_PREFIX}_users`

export const user = async () => collection(await getDB(), USER_COLLECTION_NAME)