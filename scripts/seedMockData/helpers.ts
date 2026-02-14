import * as admin from "firebase-admin";
import { FIRESTORE_COLLECTION_NAME_PREFIX } from "../../src/lib/firebase";
import config from "../../src/config";
import { type SeedContext } from "./types";

// ============================================================
// 定数
// ============================================================

export const now = new Date();

// ============================================================
// コレクション名ヘルパー
// ============================================================

export const getCollectionName = (name: string) =>
  `${FIRESTORE_COLLECTION_NAME_PREFIX}_${name}`;

// ============================================================
// 日付ヘルパー
// ============================================================

export const daysAgo = (days: number): string => {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0] as string;
};

// ============================================================
// Firebase Admin初期化
// ============================================================

export const initAdmin = async (): Promise<{
  admin: typeof admin;
  storageBucket: string;
}> => {
  if (admin.apps.length === 0) {
    const serviceAccountModule = await import(
      `config-submodule/${config.FIREBASE_ADMIN_CREDENTIALS}`
    );
    const serviceAccount = serviceAccountModule.default || serviceAccountModule;
    const projectId = serviceAccount.project_id;
    const storageBucket = `${projectId}.appspot.com`;

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      storageBucket,
    });

    return { admin, storageBucket };
  }

  const app = admin.app();
  const storageBucket = app.options.storageBucket || "";
  return { admin, storageBucket };
};

// ============================================================
// 存在チェック関数
// ============================================================

/**
 * Authユーザーがメールで存在するかチェック
 */
export const getExistingAuthUser = async (
  ctx: SeedContext,
  email: string,
): Promise<admin.auth.UserRecord | null> => {
  try {
    return await ctx.auth.getUserByEmail(email);
  } catch {
    return null;
  }
};

/**
 * ユーザーメダルが存在するかチェック
 */
export const findExistingUserMedal = async (
  ctx: SeedContext,
  userId: string,
  medalId: string,
): Promise<string | null> => {
  const snapshot = await ctx.db
    .collection(getCollectionName("user_medals"))
    .where("user_id", "==", userId)
    .where("medal_id", "==", medalId)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0].id;
};

/**
 * 瞑想履歴が存在するかチェック
 */
export const findExistingHistory = async (
  ctx: SeedContext,
  userId: string,
  meditationId: string,
  date: string,
): Promise<string | null> => {
  const snapshot = await ctx.db
    .collection(getCollectionName("meditation_history"))
    .where("user_id", "==", userId)
    .where("meditation_id", "==", meditationId)
    .where("date", "==", date)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return snapshot.docs[0].id;
};

// ============================================================
// 画像アップロード関数
// ============================================================

export const downloadImage = async (url: string): Promise<Buffer> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `画像のダウンロードに失敗: ${response.status} ${response.statusText}`,
    );
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

export const uploadImageToStorage = async (
  ctx: SeedContext,
  imageBuffer: Buffer,
  destinationPath: string,
  contentType: string = "image/jpeg",
): Promise<string> => {
  const bucket = ctx.storage.bucket();
  const file = bucket.file(destinationPath);

  await file.save(imageBuffer, {
    metadata: {
      contentType,
      cacheControl: "public, max-age=31536000",
    },
  });

  await file.makePublic();

  const publicUrl = `https://storage.googleapis.com/${ctx.storageBucket}/${destinationPath}`;
  return publicUrl;
};

export const uploadUserThumbnail = async (
  ctx: SeedContext,
  userId: string,
  imageUrl: string,
): Promise<string | null> => {
  try {
    console.log(`    📷 画像をダウンロード中: ${imageUrl}`);
    const imageBuffer = await downloadImage(imageUrl);

    const destinationPath = `users/${userId}/thumbnail.jpg`;
    console.log(`    📤 GCSにアップロード中: ${destinationPath}`);

    const publicUrl = await uploadImageToStorage(
      ctx,
      imageBuffer,
      destinationPath,
    );

    console.log(`    ✓ アップロード成功: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(
      `    ✗ 画像アップロード失敗:`,
      error instanceof Error ? error.message : error,
    );
    return null;
  }
};
