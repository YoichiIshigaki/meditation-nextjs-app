import { doc, getDoc } from "firebase/firestore";
import { userMedal, toUserMedal, type UserMedal, type UserMedalDoc } from "./";
import { main } from "@/models/common/util";

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

/*
 * get test data user medal
 *
 * npm run exec-trial-ts-file src/models/user_medal/get.ts
 */
main(get, "id_0");
