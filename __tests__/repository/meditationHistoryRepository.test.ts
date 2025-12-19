import { getMeditationHistoryMaxConsecutiveDays } from "@/repository/meditationHistoryRepository";
import * as meditationHistory from "@/models/meditation_history";
import * as dateFns from "date-fns";
import type { MeditationHistory } from "@/models/meditation_history";

jest.mock("@/models/meditation_history", () => ({
  list: jest.fn(),
}));

/**
 * 瞑想履歴のモックを作成するヘルパー関数
 */
const createMockMeditationHistory = (
  id: string,
  userId: string,
  date: Date,
  overrides?: Partial<MeditationHistory>,
): MeditationHistory => ({
  id,
  user_id: userId,
  meditation_id: `meditation_${id}`,
  duration: 10,
  score: 100,
  date: dateFns.format(date, "yyyy-MM-dd"),
  mindfulness_score: 80,
  created_at: date,
  updated_at: date,
  ...overrides,
});

/**
 * 指定された日付の配列から瞑想履歴のモック配列を作成する
 */
const createMockHistoriesFromDates = (
  userId: string,
  dates: Date[],
  options?: {
    idPrefix?: string;
    baseDuration?: number;
    baseScore?: number;
    baseMindfulnessScore?: number;
  },
): MeditationHistory[] => {
  const {
    idPrefix = "",
    baseDuration = 10,
    baseScore = 100,
    baseMindfulnessScore = 80,
  } = options || {};

  return dates.map((date, index) =>
    createMockMeditationHistory(
      `${idPrefix}${idPrefix ? "_" : ""}${index + 1}`,
      userId,
      date,
      {
        meditation_id: `meditation_${idPrefix}${idPrefix ? "_" : ""}${index + 1}`,
        duration: baseDuration + index * 5,
        score: baseScore - index * 5,
        mindfulness_score: baseMindfulnessScore + index * 5,
      },
    ),
  );
};

/**
 * 連続した日付の瞑想履歴のモック配列を作成する
 */
const createConsecutiveDaysMockHistories = (
  userId: string,
  startDate: Date,
  days: number,
  options?: {
    idPrefix?: string;
    baseDuration?: number;
    baseScore?: number;
    baseMindfulnessScore?: number;
  },
): MeditationHistory[] => {
  const dates = Array.from({ length: days }, (_, i) =>
    dateFns.subDays(startDate, days - 1 - i),
  );
  return createMockHistoriesFromDates(userId, dates, options);
};

describe("getMeditationHistoryMaxConsecutiveDays", () => {
  const mockUserId = "test-user-id";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("空の履歴の場合", () => {
    it("履歴が空の場合は0を返す", async () => {
      (meditationHistory.list as jest.Mock).mockResolvedValue([]);

      const result = await getMeditationHistoryMaxConsecutiveDays(
        mockUserId,
        "all_time",
      );

      expect(result).toBe(0);
      expect(meditationHistory.list).toHaveBeenCalledWith({
        userId: mockUserId,
        orderByField: "created_at",
        orderDirection: "desc",
      });
    });
  });

  describe("連続した日付の場合", () => {
    it("3日連続の場合は3を返す", async () => {
      const today = new Date();
      const mockHistories = createConsecutiveDaysMockHistories(
        mockUserId,
        today,
        3,
      );

      (meditationHistory.list as jest.Mock).mockResolvedValue(mockHistories);

      const result = await getMeditationHistoryMaxConsecutiveDays(
        mockUserId,
        "all_time",
      );

      expect(result).toBe(3);
    });

    it("5日連続の場合は5を返す", async () => {
      const today = new Date();
      const mockHistories = createConsecutiveDaysMockHistories(
        mockUserId,
        today,
        5,
      );

      (meditationHistory.list as jest.Mock).mockResolvedValue(mockHistories);

      const result = await getMeditationHistoryMaxConsecutiveDays(
        mockUserId,
        "all_time",
      );

      expect(result).toBe(5);
    });
  });

  describe("連続が途切れている場合", () => {
    it("3日連続と2日連続がある場合、最大値の3を返す", async () => {
      const today = new Date();
      const day6 = dateFns.subDays(today, 6);
      const day5 = dateFns.subDays(today, 5);
      const day2 = dateFns.subDays(today, 2);
      const day1 = dateFns.subDays(today, 1);

      // 古い期間（2日連続）
      const oldPeriod = createMockHistoriesFromDates(mockUserId, [day6, day5]);
      // 新しい期間（3日連続）
      const newPeriod = createMockHistoriesFromDates(mockUserId, [
        day2,
        day1,
        today,
      ]);

      const mockHistories = [...oldPeriod, ...newPeriod];

      (meditationHistory.list as jest.Mock).mockResolvedValue(mockHistories);

      const result = await getMeditationHistoryMaxConsecutiveDays(
        mockUserId,
        "all_time",
      );

      expect(result).toBe(3); // 最新の3日連続
    });
  });

  describe("同じ日の重複がある場合", () => {
    it("同じ日に複数の履歴がある場合、1日としてカウントする", async () => {
      const today = new Date();
      const yesterday = dateFns.subDays(today, 1);
      const todayWithHours = dateFns.addHours(today, 2);

      const mockHistories = [
        ...createMockHistoriesFromDates(mockUserId, [yesterday]),
        createMockMeditationHistory("2", mockUserId, today),
        createMockMeditationHistory("3", mockUserId, todayWithHours, {
          meditation_id: "meditation_3",
          duration: 20,
          score: 95,
          mindfulness_score: 90,
        }),
      ];

      (meditationHistory.list as jest.Mock).mockResolvedValue(mockHistories);

      const result = await getMeditationHistoryMaxConsecutiveDays(
        mockUserId,
        "all_time",
      );

      expect(result).toBe(2); // 昨日と今日（今日は重複を除去して1日としてカウント）
    });
  });

  describe("異なるtypeパラメータ", () => {
    it("this_yearタイプで正しく動作する", async () => {
      (meditationHistory.list as jest.Mock).mockResolvedValue([]);

      await getMeditationHistoryMaxConsecutiveDays(mockUserId, "this_year");

      expect(meditationHistory.list).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserId,
          orderByField: "created_at",
          orderDirection: "desc",
          between: expect.objectContaining({
            start: expect.any(Date),
            end: expect.any(Date),
          }),
        }),
      );
    });

    it("this_monthタイプで正しく動作する", async () => {
      (meditationHistory.list as jest.Mock).mockResolvedValue([]);

      await getMeditationHistoryMaxConsecutiveDays(mockUserId, "this_month");

      expect(meditationHistory.list).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserId,
          orderByField: "created_at",
          orderDirection: "desc",
          between: expect.objectContaining({
            start: expect.any(Date),
            end: expect.any(Date),
          }),
        }),
      );
    });

    it("all_timeタイプで正しく動作する", async () => {
      (meditationHistory.list as jest.Mock).mockResolvedValue([]);

      await getMeditationHistoryMaxConsecutiveDays(mockUserId, "all_time");

      expect(meditationHistory.list).toHaveBeenCalledWith({
        userId: mockUserId,
        orderByField: "created_at",
        orderDirection: "desc",
      });
    });
  });

  describe("複雑なシナリオ", () => {
    it("複数の連続期間がある場合、最大値を返す", async () => {
      const today = new Date();
      const oldPeriodStartDate = dateFns.subDays(today, 24);

      // 5日連続（古い期間）
      const oldPeriod = createConsecutiveDaysMockHistories(
        mockUserId,
        oldPeriodStartDate,
        5,
        { idPrefix: "old" },
      );
      // 3日連続（新しい期間）
      const newPeriod = createConsecutiveDaysMockHistories(
        mockUserId,
        today,
        3,
        {
          idPrefix: "new",
          baseDuration: 15,
          baseScore: 90,
          baseMindfulnessScore: 85,
        },
      );

      const mockHistories = [...oldPeriod, ...newPeriod];

      (meditationHistory.list as jest.Mock).mockResolvedValue(mockHistories);

      const result = await getMeditationHistoryMaxConsecutiveDays(
        mockUserId,
        "all_time",
      );

      expect(result).toBe(5); // 最大値は5日連続
    });

    it("1日だけの場合は1を返す", async () => {
      const today = new Date();
      const mockHistories = createMockHistoriesFromDates(mockUserId, [today]);

      (meditationHistory.list as jest.Mock).mockResolvedValue(mockHistories);

      const result = await getMeditationHistoryMaxConsecutiveDays(
        mockUserId,
        "all_time",
      );

      expect(result).toBe(1);
    });
  });
});
