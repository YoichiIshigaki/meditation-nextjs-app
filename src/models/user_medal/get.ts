import { doc, getDoc } from "firebase/firestore";
import { userMedal, toUserMedal, type UserMedal, type UserMedalDoc } from "./";

export const get = async (id: string): Promise<UserMedal> => {
  const userMedalDocRef = doc(await userMedal(), id);
  const userMedalDocSnap = await getDoc(userMedalDocRef);

  if (userMedalDocSnap.exists()) {
    return toUserMedal(
      userMedalDocSnap.id,
      userMedalDocSnap.data() as UserMedalDoc,
    );
  }
  console.error(`UserMedal with id ${id} not found.`);
  throw new Error(`UserMedal with id ${id} not found.`);
};

// npm run exec-trial-ts-file src/models/user_medal/get.ts
(async () => {
  if (require.main === module) {
    const id = "id_0";
    await get(id).then((userMedal) => {
      console.log(userMedal);
    });
    process.exit(0);
  }
})();
