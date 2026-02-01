import { userCollection, toUser, type User, type UserDoc } from "./";
import { main } from "@/models/common/util";

export const get = async (id: string): Promise<User> => {
  const collectionRef = await userCollection();
  const userDocSnap = await collectionRef.doc(id).get();

  if (userDocSnap.exists) {
    // ドキュメントデータを取得し、idを付与して返す
    return toUser(userDocSnap.id, userDocSnap.data() as UserDoc);
  }
  // ドキュメントが存在しない場合
  console.error(`User with id ${id} not found.`);
  throw new Error(`User with id ${id} not found.`);
};

export const getNotThrow = async (id: string): Promise<User | null> => {
  const collectionRef = await userCollection();
  const userDocSnap = await collectionRef.doc(id).get();

  if (userDocSnap.exists) {
    // ドキュメントデータを取得し、idを付与して返す
    return toUser(userDocSnap.id, userDocSnap.data() as UserDoc);
  }
  // ドキュメントが存在しない場合
  console.error(`User with id ${id} not found.`);
  return null;
};

/*
 * get test data user
 *
 * npm run exec-trial-ts-file src/models/user/get.ts
 */
main(get, "Tl4vOZQ803RtenBbmvkg");
