import * as userMedal from "@/models/user_medal";
import * as meditationMedal from "@/models/meditation_medal";
import type { MeditationMedal } from "@/models/meditation_medal";
import { getListByChunk } from "./utils";
/**
 * ユーザーが保持しているメダルを取得する
 * メダルの詳細情報も含めて返す
 *
 * @param userId ユーザーID
 * @returns メダルの詳細情報リスト
 */
const getUserMedals = async (
  userId: string,
): Promise<Array<MeditationMedal & { earned_at: Date }>> => {
  // ユーザーが保持しているメダルのIDリストを取得
  const userMedals = await userMedal.list({
    userId,
    orderByField: "earned_at",
    orderDirection: "desc",
  });

  // 各メダルの詳細情報を取得
  const medalsWithDetails = await Promise.all(
    userMedals.map(async (userMedalItem) => {
      const medalDetail = await meditationMedal.get(userMedalItem.medal_id);
      return {
        ...medalDetail,
        earned_at: userMedalItem.earned_at,
      };
    }),
  );

  return medalsWithDetails;
};

/**
 * ユーザーにメダルを付与する（保存する）
 *
 * @param userId ユーザーID
 * @param medalId メダルID
 * @param earnedAt 付与日時
 * @returns 付与したメダルのID
 */
const addUserMedal = async (
  userId: string,
  medalId: string,
  earnedAt?: Date,
): Promise<string> => {
  // 既に同じメダルを持っているかチェック
  const existingMedals = await userMedal.list({
    userId,
    medalId,
  });

  if (existingMedals.length > 0) {
    // 既に持っている場合は、既存のIDを返す
    return existingMedals[0].id;
  }

  // 新しいメダルを付与
  return await userMedal.create({
    user_id: userId,
    medal_id: medalId,
    earned_at: earnedAt || new Date(),
  });
};

/**
 * ユーザーが特定のメダルを持っているかチェックする
 *
 * @param userId ユーザーID
 * @param medalId メダルID
 * @returns メダルを持っているかどうか
 */
const hasUserMedal = async (
  userId: string,
  medalId: string,
): Promise<boolean> => {
  const userMedals = await userMedal.list({
    userId,
    medalId,
  });

  return userMedals.length > 0;
};

/**
 * ユーザーが保持しているメダルのIDリストを取得する
 *
 * @param userId ユーザーID
 * @returns メダルのIDリスト
 */
const getUserMedalIds = async (userId: string): Promise<string[]> => {
  const userMedals = await userMedal.list({
    userId,
  });
  return userMedals.map((um) => um.medal_id);
};


/**
 * メダルIDリストからメダルの詳細情報を取得する
 *
 * @param medalIds メダルIDリスト
 * @returns メダルの詳細情報リスト
 */
const getMedalByIds = async (
  medalIds: string[],
): Promise<MeditationMedal[]> => {
  return await getListByChunk(medalIds, (ids) =>
    meditationMedal.list({ medalIds: ids }),
  );
};

export {
  getUserMedals,
  addUserMedal,
  hasUserMedal,
  getUserMedalIds,
  getMedalByIds,
};
