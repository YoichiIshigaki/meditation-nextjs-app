import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { meditationMedal } from ".";
import { main } from "@/models/common/util";

export const deleteMeditationMedal = async (id: string): Promise<void> => {
  const collectionRef = await meditationMedal();
  const docRef = doc(collectionRef, id);

  // ドキュメントが存在するか確認
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.error(`meditationMedal with id ${id} not found.`);
    throw new Error(`meditationMedal with id ${id} not found.`);
  }

  // ドキュメントを削除
  await deleteDoc(docRef);
};

/*
 * delete test data meditation_medal
 *
 * npm run exec-trial-ts-file src/models/meditation_medal/delete.ts
 */
main(deleteMeditationMedal, "rvnCsTHo6ijt9cRuznb2");
