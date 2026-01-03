import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { meditationContent } from "./";
import { main } from "@/models/common/util";

export const deleteMeditationContent = async (id: string): Promise<void> => {
  const collectionRef = await meditationContent();
  const docRef = doc(collectionRef, id);

  // ドキュメントが存在するか確認
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    console.error(`MeditationContent with id ${id} not found.`);
    throw new Error(`MeditationContent with id ${id} not found.`);
  }

  // ドキュメントを削除
  await deleteDoc(docRef);
};

/*
 * delete test data meditation content
 *
 * npm run exec-trial-ts-file src/models/meditation_content/delete.ts
 */
main(deleteMeditationContent, "rvnCsTHo6ijt9cRuznb2");
