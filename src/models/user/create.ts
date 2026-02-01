import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { userCollection, type User } from "./";
import { main } from "@/models/common/util";

type UserCreateParam = Omit<User, "created_at" | "updated_at">;

export const create = async (param: UserCreateParam): Promise<string> => {
  const collectionRef = await userCollection();

  const { id, ...rest } = param;
  const docData = {
    ...rest,
    last_logged_in: Timestamp.fromDate(rest.last_logged_in),
    created_at: FieldValue.serverTimestamp(),
    updated_at: FieldValue.serverTimestamp(),
  };

  const docRef = collectionRef.doc(id);
  await docRef.set(docData);

  return docRef.id;
};

/*
 * create test data user
 *
 * npm run exec-trial-ts-file src/models/user/create.ts
 */
main(create, {
  id: "dummy_user_id",
  first_name: "John",
  last_name: "Doe",
  thumbnail_url: "",
  language: "en",
  last_logged_in: new Date(),
  status: "active",
});
