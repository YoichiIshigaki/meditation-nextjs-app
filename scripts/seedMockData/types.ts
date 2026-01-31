import * as admin from "firebase-admin";
import { type User } from "../../src/models/user";

// ============================================================
// 型定義
// ============================================================

export type MockAuthUser = User & {
  email: string;
  password: string;
  localImagePath?: string;
};

export type SeedContext = {
  auth: admin.auth.Auth;
  db: admin.firestore.Firestore;
  storage: admin.storage.Storage;
  storageBucket: string;
  isDryRun: boolean;
};

export type SeedResult = {
  userIds: string[];
  contentIds: string[];
  medalIds: string[];
  historyIds: string[];
  userMedalIds: string[];
};
