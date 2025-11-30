import { doc, getDoc } from 'firebase/firestore';
import { user, toUser, type User, type UserDoc } from './';

export const get = async (id: string): Promise<User> => {
  const userDocRef = doc((await user()), id);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    // ドキュメントデータを取得し、idを付与して返す
    return toUser(userDocSnap.id, userDocSnap.data() as UserDoc);
  }
    // ドキュメントが存在しない場合
  console.error(`User with id ${id} not found.`);
  throw new Error(`User with id ${id} not found.`);
}


export const getNotThrow = async (id: string): Promise<User | null> => {
  const userDocRef = doc((await user()), id);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    // ドキュメントデータを取得し、idを付与して返す
    return toUser(userDocSnap.id, userDocSnap.data() as UserDoc);
  }
    // ドキュメントが存在しない場合
  console.error(`User with id ${id} not found.`);
  return null
}

// npm run exec-trial-ts-file src/models/user/get.ts
(async () => {
  if (require.main === module) {
    const id = "Tl4vOZQ803RtenBbmvkg";
    await get(id).then((user) => { console.log(user) })
    process.exit(0)
  }
})();
