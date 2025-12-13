import * as meditationHistory from "../models/meditation_history"
import * as dateFns from "date-fns";
import type { MeditationHistory } from "../models/meditation_history"


const getThisYearMeditationHistories = async (userId: string) :Promise<MeditationHistory[]> => { 
  const now = new Date()
  return await meditationHistory.list({
    userId,
    orderByField: 'created_at',
    orderDirection: 'desc',
    between : {
      start: dateFns.startOfYear(now),
      end: dateFns.endOfYear(now),
    }
  });
};

const getThisMonthMeditationHistories = async (userId: string) :Promise<MeditationHistory[]> => { 
  const now = new Date()
  return await meditationHistory.list({
    userId,
    orderByField: 'created_at',
    orderDirection: 'desc',
    between : {
      start: dateFns.startOfMonth(now),
      end: dateFns.endOfMonth(now),
    }
  });
};

const getAllTimeMeditationHistories = async (userId: string) :Promise<MeditationHistory[]> => { 
  return await meditationHistory.list({
    userId,
    orderByField: 'created_at',
    orderDirection: 'desc',
  });
};

type PeriodType = 'this_year' | 'this_month' | 'all_time';

/**
 * 期間タイプに応じた瞑想履歴取得関数のマッピング
 */
const getHistoryByPeriod = async (userId: string, type: PeriodType): Promise<MeditationHistory[]> => {
  const historyGetters = {
    this_year: getThisYearMeditationHistories,
    this_month: getThisMonthMeditationHistories,
    all_time: getAllTimeMeditationHistories,
  } as const;
  
  return await historyGetters[type](userId);
};

/**
 * 瞑想履歴を日付の昇順（古い順）にソートする
 */
const sortHistoriesByDateAsc = (histories: MeditationHistory[]): MeditationHistory[] => {
  return [...histories].sort((a, b) => 
    dateFns.compareAsc(a.created_at, b.created_at)
  );
};

/**
 * 同じ日の重複を除去し、各日付の最初の履歴のみを残す
 */
const removeDuplicateDates = (histories: MeditationHistory[]): MeditationHistory[] => {
  const seenDates = new Set<string>();
  
  return histories.filter(history => {
    const dateKey = dateFns.format(history.created_at, 'yyyy-MM-dd');
    
    if (seenDates.has(dateKey)) {
      return false;
    }
    
    seenDates.add(dateKey);
    return true;
  });
};

/**
 * 配列の隣接する要素のペアを作成する
 */
const createAdjacentPairs = <T>(array: T[]): Array<[T, T]> => {
  return array.slice(0, -1).map((item, index) => [item, array[index + 1]]);
};

/**
 * 連続した日付の連続日数を計算する
 */
const calculateConsecutiveDays = (histories: MeditationHistory[]): number[] => {
  if (histories.length === 0) {
    return [];
  }
  
  if (histories.length === 1) {
    return [1];
  }
  
  // 隣接する要素のペアを作成
  const pairs = createAdjacentPairs(histories);
  
  // 各ペアの日数差を計算し、連続日数をグループ化
  const result = pairs.reduce(
    (acc, [previous, current]) => {
      const daysDifference = dateFns.differenceInDays(
        current.created_at,
        previous.created_at
      );
      
      if (daysDifference === 1) {
        // 連続している場合：現在の連続日数を増やす
        return {
          periods: acc.periods,
          currentCount: acc.currentCount + 1,
        };
      } else {
        // 連続が途切れた場合：現在の連続日数を保存し、新しい連続を開始
        return {
          periods: [...acc.periods, acc.currentCount],
          currentCount: 1,
        };
      }
    },
    {
      periods: [] as number[],
      currentCount: 1, // 最初の日からカウント開始
    }
  );
  
  // 最後の連続日数も追加
  return [...result.periods, result.currentCount];
};

/**
 * 瞑想履歴から最大連続日数を計算する
 * 
 * @param userId - ユーザーID
 * @param type - 期間タイプ（this_year, this_month, all_time）
 * @returns 最大連続日数（履歴がない場合は0）
 */
const getMeditationHistoryMaxConsecutiveDays = async (
  userId: string, 
  type: PeriodType
): Promise<number> => {
  // 1. 期間に応じた履歴を取得
  const histories = await getHistoryByPeriod(userId, type);
  
  if (histories.length === 0) {
    return 0;
  }
  
  // 2. 日付の昇順にソート（降順で取得されるため）
  const sortedHistories = sortHistoriesByDateAsc(histories);
  
  // 3. 同じ日の重複を除去
  const uniqueHistories = removeDuplicateDates(sortedHistories);
  
  if (uniqueHistories.length === 0) {
    return 0;
  }
  
  // 4. 連続日数を計算
  const consecutiveDays = calculateConsecutiveDays(uniqueHistories);
  
  // 5. 最大連続日数を返す
  return Math.max(...consecutiveDays, 0);
}

export { 
  getThisYearMeditationHistories,
  getThisMonthMeditationHistories,
  getAllTimeMeditationHistories,
  getMeditationHistoryMaxConsecutiveDays,
};