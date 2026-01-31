import * as admin from "firebase-admin";
import { type SeedContext } from "./types";
import {
  getCollectionName,
  getExistingAuthUser,
  findExistingUserMedal,
  findExistingHistory,
  uploadUserThumbnail,
} from "./helpers";
import {
  mockUsers,
  mockMeditationContents,
  mockMedals,
  mockMeditationHistories,
} from "./mockData";

// ============================================================
// シード関数
// ============================================================

/**
 * ユーザーをシードする（既存チェック → 画像アップロード → Auth → Firestore）
 */
export const seedUsers = async (
  ctx: SeedContext
): Promise<{ ids: string[]; idMap: Record<string, string> }> => {
  console.log("🔐 Firebase Authユーザーを作成中...");

  const ids: string[] = [];
  const idMap: Record<string, string> = {};

  for (const user of mockUsers) {
    console.log(`\n  📝 ${user.email} を処理中...`);

    if (ctx.isDryRun) {
      const dryRunUid = `dryrun_${user.id}`;
      ids.push(dryRunUid);
      idMap[user.id] = dryRunUid;
      console.log(`    [DRY] 画像アップロード: users/${dryRunUid}/thumbnail.jpg`);
      console.log(`    [DRY] Auth: ${user.email} (UID: ${dryRunUid})`);
      console.log(`    [DRY] Firestore: ${user.first_name} ${user.last_name}`);
      continue;
    }

    try {
      // Step 1: 既存ユーザーチェック
      const existingAuthUser = await getExistingAuthUser(ctx, user.email);

      if (existingAuthUser) {
        ids.push(existingAuthUser.uid);
        idMap[user.id] = existingAuthUser.uid;
        console.log(`    ⏭ 既存ユーザー: ${user.email} (UID: ${existingAuthUser.uid})`);
        continue;
      }

      // Step 2: Firebase Authユーザー作成
      const authUser = await ctx.auth.createUser({
        email: user.email,
        password: user.password,
        displayName: `${user.first_name} ${user.last_name}`,
      });
      const uid = authUser.uid;
      console.log(`    ✓ Auth作成: ${user.email} (UID: ${uid})`);

      // Step 3: 画像をGCSにアップロード
      const thumbnailUrl = await uploadUserThumbnail(ctx, uid, user.thumbnail_url);

      if (thumbnailUrl === null) {
        console.log(`    ⚠ 画像アップロード失敗のため、Authユーザーを削除してスキップします`);
        await ctx.auth.deleteUser(uid);
        continue;
      }

      // Step 4: Firestoreにユーザードキュメント作成
      await ctx.db.collection(getCollectionName("user")).doc(uid).set({
        id: uid,
        first_name: user.first_name,
        last_name: user.last_name,
        thumbnail_url: thumbnailUrl,
        language: user.language,
        status: user.status,
        last_logged_in: admin.firestore.Timestamp.fromDate(new Date()),
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      });

      ids.push(uid);
      idMap[user.id] = uid;
      console.log(`    ✓ Firestore作成: ${user.first_name} ${user.last_name} (ID: ${uid})`);
    } catch (error: unknown) {
      console.error(`    ✗ エラー:`, error instanceof Error ? error.message : error);
    }
  }

  return { ids, idMap };
};

/**
 * 瞑想コンテンツをシードする（既存チェック付き）
 * ドキュメントIDを固定して作成
 */
export const seedMeditationContents = async (ctx: SeedContext): Promise<string[]> => {
  console.log("\n🧘 瞑想コンテンツを作成中...");

  const ids: string[] = [];

  for (const content of mockMeditationContents) {
    const docId = content.id;

    if (ctx.isDryRun) {
      ids.push(docId);
      console.log(`  [DRY] ${content.title} (ID: ${docId})`);
      continue;
    }

    // 既存チェック（ドキュメントIDで確認）
    const docRef = ctx.db.collection(getCollectionName("meditation_content")).doc(docId);
    const doc = await docRef.get();

    if (doc.exists) {
      ids.push(docId);
      console.log(`  ⏭ 既存: ${content.title} (ID: ${docId})`);
      continue;
    }

    await docRef.set({
      ...content,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    ids.push(docId);
    console.log(`  ✓ 作成: ${content.title} (ID: ${docId})`);
  }

  return ids;
};

/**
 * メダルをシードする（既存チェック付き）
 * ドキュメントIDを固定して作成
 */
export const seedMedals = async (ctx: SeedContext): Promise<string[]> => {
  console.log("\n🏅 メダルを作成中...");

  const ids: string[] = [];

  for (const medal of mockMedals) {
    const docId = medal.id;

    if (ctx.isDryRun) {
      ids.push(docId);
      console.log(`  [DRY] ${medal.medal_name} (ID: ${docId})`);
      continue;
    }

    // 既存チェック（ドキュメントIDで確認）
    const docRef = ctx.db.collection(getCollectionName("meditation_medal")).doc(docId);
    const doc = await docRef.get();

    if (doc.exists) {
      ids.push(docId);
      console.log(`  ⏭ 既存: ${medal.medal_name} (ID: ${docId})`);
      continue;
    }

    await docRef.set({
      ...medal,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    ids.push(docId);
    console.log(`  ✓ 作成: ${medal.medal_name} (ID: ${docId})`);
  }

  return ids;
};

/**
 * 瞑想履歴をシードする（既存チェック付き）
 */
export const seedMeditationHistories = async (
  ctx: SeedContext,
  userIdMap: Record<string, string>
): Promise<string[]> => {
  console.log("\n📊 瞑想履歴を作成中...");

  const ids: string[] = [];

  for (const history of mockMeditationHistories) {
    const actualUserId = userIdMap[history.user_id];

    if (!actualUserId) {
      console.log(`  ⚠ ユーザー ${history.user_id} が存在しないためスキップ`);
      continue;
    }

    if (ctx.isDryRun) {
      const dryRunId = `dryrun_${history.id}`;
      ids.push(dryRunId);
      console.log(`  [DRY] ${history.date} の履歴 (user: ${actualUserId})`);
      continue;
    }

    // 既存チェック（user_id + meditation_id + date）
    const existingId = await findExistingHistory(
      ctx,
      actualUserId,
      history.meditation_id,
      history.date
    );
    if (existingId) {
      ids.push(existingId);
      console.log(`  ⏭ 既存: ${history.date} の履歴 (ID: ${existingId})`);
      continue;
    }

    const docRef = await ctx.db
      .collection(getCollectionName("meditation_history"))
      .add({
        ...history,
        user_id: actualUserId,
        id: `${actualUserId}_${history.meditation_id}_${history.date}`,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      });
    ids.push(docRef.id);
    console.log(`  ✓ 作成: ${history.date} の履歴 (ID: ${docRef.id})`);
  }

  return ids;
};

/**
 * ユーザーメダルをシードする（既存チェック付き）
 */
export const seedUserMedals = async (
  ctx: SeedContext,
  userId: string | undefined,
  medalIds: string[]
): Promise<string[]> => {
  console.log("\n🎖️ ユーザーメダルを作成中...");

  const ids: string[] = [];

  if (!userId) {
    console.log("  ⚠ 有効なユーザーがいないためスキップ");
    return ids;
  }

  const medalIdsToAssign = medalIds.slice(0, 2);

  for (const medalId of medalIdsToAssign) {
    if (ctx.isDryRun) {
      ids.push(`dryrun_user_medal_${medalId}`);
      console.log(`  [DRY] メダル付与 (user: ${userId}, medal: ${medalId})`);
      continue;
    }

    // 既存チェック（user_id + medal_id）
    const existingId = await findExistingUserMedal(ctx, userId, medalId);
    if (existingId) {
      ids.push(existingId);
      console.log(`  ⏭ 既存: メダル付与 (ID: ${existingId})`);
      continue;
    }

    const docRef = await ctx.db.collection(getCollectionName("user_medal")).add({
      user_id: userId,
      medal_id: medalId,
      earned_at: admin.firestore.Timestamp.fromDate(new Date()),
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    ids.push(docRef.id);
    console.log(`  ✓ 作成: メダル付与 (ID: ${docRef.id})`);
  }

  return ids;
};
