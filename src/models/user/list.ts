import { userCollection, toUser, type User, type UserDoc } from "./";
import { main } from "@/models/common/util";

export type ListOptions = {
  limitCount?: number;
  orderByField?: keyof User;
  orderDirection?: "asc" | "desc";
};

export const list = async (options?: ListOptions): Promise<User[]> => {
  let collectionRef: FirebaseFirestore.Query = await userCollection();

  // Sort
  const orderField = options?.orderByField || "created_at";
  const orderDir = options?.orderDirection || "desc";
  collectionRef = collectionRef.orderBy(orderField, orderDir);

  // Limit
  if (options?.limitCount) {
    collectionRef = collectionRef.limit(options.limitCount);
  }

  const querySnapshot = await collectionRef.get();

  const users: User[] = [];
  querySnapshot.forEach((docSnap) => {
    if (docSnap.exists) {
      users.push(toUser(docSnap.id, docSnap.data() as UserDoc));
    }
  });

  return users;
};

/*
 * list test data user
 *
 * npm run exec-trial-ts-file src/models/user/list.ts
 */
main(list, {
  limitCount: 10,
});
