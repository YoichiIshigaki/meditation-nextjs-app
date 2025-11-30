import { FIRESTORE_COLLECTION_NAME_PREFIX, getDB } from "@/lib/firebase"
import { collection } from 'firebase/firestore'

export const MEDITATION_CONTENT_COLLECTION_NAME = `${FIRESTORE_COLLECTION_NAME_PREFIX}_meditation_contents`

export const meditationContent = async () => collection(await getDB(), MEDITATION_CONTENT_COLLECTION_NAME)