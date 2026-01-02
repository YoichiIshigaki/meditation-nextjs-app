import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { meditationMedal } from ".";

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
    await deleteMeditationMedal(id)
      .then(() => {
        console.log("Deleted successfully");
      })
      .catch((error) => {
        console.error("Delete failed:", error);
      });
    process.exit(0);
  }
})();
