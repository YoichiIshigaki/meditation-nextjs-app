import {
  getDocs,
  query,
  orderBy,
  limit,
  type QueryConstraint,
} from "firebase/firestore";
import { user, toUser, type User, type UserDoc } from "./";
import { main } from "@/models/common/util";

export type ListOptions = {
  limitCount?: number;
  orderByField?: keyof User;
  orderDirection?: "asc" | "desc";
};

export const list = async (options?: ListOptions): Promise<User[]> => {
  const collectionRef = await user();

  const constraints: QueryConstraint[] = [];

  // Sort
  const orderField = options?.orderByField || "created_at";
  const orderDir = options?.orderDirection || "desc";
  constraints.push(orderBy(orderField, orderDir));

  // Limit
  if (options?.limitCount) {
    constraints.push(limit(options.limitCount));
  }

  const q = query(collectionRef, ...constraints);
  const querySnapshot = await getDocs(q);

  const users: User[] = [];
  querySnapshot.forEach((docSnap) => {
    if (docSnap.exists()) {
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
