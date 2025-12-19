import type { Timestamp } from "firebase/firestore";
import type { MediMateDocType, MediMateType } from "../common/type";

export type UserDoc = MediMateDocType<{
  id: string;
  first_name: string;
  last_name: string;
  thumbnail_url: string;
  language: string;
  last_logged_in: Timestamp;
  status: string;
}>;

export type User = MediMateType<{
  id: string;
  first_name: string;
  last_name: string;
  thumbnail_url: string;
  language: string;
  last_logged_in: Date;
  status: string;
}>;

export const toUser = (id: string, userDoc: UserDoc): User => ({
  id,
  first_name: userDoc.first_name,
  last_name: userDoc.last_name,
  thumbnail_url: userDoc.thumbnail_url,
  language: userDoc.language,
  last_logged_in: userDoc.last_logged_in.toDate(),
  status: userDoc.status,
  created_at: userDoc.created_at.toDate(),
  updated_at: userDoc.updated_at.toDate(),
});
