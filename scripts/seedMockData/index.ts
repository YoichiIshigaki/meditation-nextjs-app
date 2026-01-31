/**
 * Firestoreにモックデータを投入するスクリプト
 *
 * 実行方法:
 * npm run add-mock-data:development
 *
 * ドライラン（実際にデータを作成しない）:
 * DRY_RUN=true npm run add-mock-data:development
 *
 * 特徴:
 * - 既存データは自動的にスキップされます
 * - 画像はGCSにアップロードされます
 */

import { type SeedContext, type SeedResult } from "./types";
import { initAdmin } from "./helpers";
import {
  seedUsers,
  seedMeditationContents,
  seedMedals,
  seedMeditationHistories,
  seedUserMedals,
} from "./seeders";

// ============================================================
// 設定
// ============================================================

const isDryRun = process.env.DRY_RUN === "true";

// ============================================================
// 結果表示
// ============================================================

const printResult = (result: SeedResult, isDryRun: boolean) => {
  const status = isDryRun ? "作成予定" : "処理済み";

  if (isDryRun) {
    console.log("\n🔍 ドライラン完了（データは作成されていません）");
  } else {
    console.log("\n✅ モックデータの投入が完了しました！");
  }

  console.log(`
  ${status}データ:
  - ユーザー: ${result.userIds.length}件
  - 瞑想コンテンツ: ${result.contentIds.length}件
  - メダル: ${result.medalIds.length}件
  - 瞑想履歴: ${result.historyIds.length}件
  - ユーザーメダル: ${result.userMedalIds.length}件
  `);
};

// ============================================================
// メイン処理
// ============================================================

export const seedMockData = async (): Promise<SeedResult> => {
  if (isDryRun) {
    console.log("🔍 ドライランモード（実際にデータは作成されません）\n");
  }
  console.log("🌱 モックデータの投入を開始します...\n");

  const { admin: adminApp, storageBucket } = await initAdmin();

  const ctx: SeedContext = {
    auth: adminApp.auth(),
    db: adminApp.firestore(),
    storage: adminApp.storage(),
    storageBucket,
    isDryRun,
  };

  console.log(`📦 Storage Bucket: ${storageBucket}\n`);

  // シード実行
  const { ids: userIds, idMap: userIdMap } = await seedUsers(ctx);
  const contentIds = await seedMeditationContents(ctx);
  const medalIds = await seedMedals(ctx);
  const historyIds = await seedMeditationHistories(ctx, userIdMap);
  const userMedalIds = await seedUserMedals(ctx, userIds[0], medalIds);

  const result: SeedResult = {
    userIds,
    contentIds,
    medalIds,
    historyIds,
    userMedalIds,
  };

  printResult(result, isDryRun);

  return result;
};

// ============================================================
// エントリーポイント
// ============================================================

if (process.env.NODE_ENV === "development") {
  seedMockData()
    .then((result) => {
      console.log("result:", result);
      process.exit(0);
    })
    .catch((error) => {
      console.error("error:", error);
      process.exit(1);
    });
}
