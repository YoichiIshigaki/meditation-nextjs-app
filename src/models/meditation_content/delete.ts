import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { meditationContent } from "./";

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

/**
 * @description
 * delete test data meditation contents
 * @example
 *
 * npm run exec-trial-ts-file src/models/meditation_content/delete.ts
 */
(async () => {
  if (require.main === module) {
    const id = "rvnCsTHo6ijt9cRuznb2"; // 削除するドキュメントのID
    await deleteMeditationContent(id)
      .then(() => {
        console.log("Deleted successfully");
      })
      .catch((error) => {
        console.error("Delete failed:", error);
      });
    process.exit(0);
  }
})();
