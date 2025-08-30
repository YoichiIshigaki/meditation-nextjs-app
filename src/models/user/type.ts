import type { Timestamp } from 'firebase/firestore';

export type UserDoc = {
  id: string;
  first_name: string;
  last_name: string;
  language: string;
  last_logged_in: Timestamp;
  status: string;
}

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  language: string;
  last_logged_in: Date;
  status: string;
}

export const toUser = (id: string, userDoc: UserDoc): User => ({
  id,
  first_name: userDoc.first_name,
  last_name: userDoc.last_name,
  language: userDoc.language,
  last_logged_in: userDoc.last_logged_in.toDate(),
  status: userDoc.status,
});

