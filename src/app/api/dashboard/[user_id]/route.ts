import { NextRequest, NextResponse } from "next/server";
import {
  differenceInDays,
  parseISO,
  isValid,
  eachDayOfInterval,
  startOfYear,
  endOfYear,
  endOfMonth,
  startOfMonth,
  isAfter,
  isBefore,
} from "date-fns";
import { getMockMeditationHistory } from "@/models/meditation_history";

type DashboardType =
  | "mindfulness_meter"
  | "past_meditation"
  | "meditation_calender"
  | "medal";

type Context = {
  user_id: string;
  // TODO: 型は決まっていない。
  option: Record<string, unknown>; // 関数の引数の型
};

type History = {
  id: string;
  date: Date;
  session_count: number;
  total_days: number;
};

// 日付範囲内の全ての日付を取得する関数
const getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
  return eachDayOfInterval({ start: startDate, end: endDate });
};

// マインドフルネスメトリックスの取得
const getMindfulnessMeter = async (ctx: Context) => {
  // validation
  const { start_date, end_date } = ctx.option as {
    start_date: string | undefined;
    end_date: string | undefined;
  };
  if (!start_date || !end_date) {
    throw new Error("start_date and end_date are required");
  }

  const startDate = parseISO(start_date);
  const endDate = parseISO(end_date);

  if (!isValid(startDate) || !isValid(endDate)) {
    throw new Error("Invalid date format. Please use YYYY-MM-DD.");
  }

  // differenceInDaysは丸一日の差を計算するため、開始日と終了日を含む場合は+1します。
  // 例: 7/1から7/3 -> 3日間, differenceInDaysは2を返す
  const durationInDays = differenceInDays(endDate, startDate) + 1;

  // 日付範囲内の全ての日付を取得
  const datesInRange = getDatesInRange(startDate, endDate);

  const getMindfulnessHistories = async (_ctx: Context, date: Date) => {
    // ...今後実装 BDから取得
    // const histories =
    // mock data
    const mockMeditationHistory = getMockMeditationHistory(3, date);

    return mockMeditationHistory;
  };

  const mindfulnessHistories = await Promise.all(
    datesInRange.map((date) => getMindfulnessHistories(ctx, date)),
  );

  // 指定期間のトータルのスコア
  const mindfulnessScores = mindfulnessHistories.map((histories) => {
    return histories.reduce(
      (total, history) => total + history.mindfulness_score,
      0,
    );
  });

  // 指定期間の瞑想時間
  const mindfulnessDurations = mindfulnessHistories.map((histories) => {
    return histories.reduce((total, history) => total + history.duration, 0);
  });

  return {
    duration_in_days: durationInDays,
    dates_in_range: datesInRange.map(
      (date) => date.toISOString().split("T")[0],
    ), // YYYY-MM-DD形式で返す
    // mindfulness_histories: mindfulnessHistories
    mindfulness_scores: mindfulnessScores,
    mindfulness_durations: mindfulnessDurations,
  };
};

// 過去のメンタルメトリックス
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getPastMeditation = async (_ctx: Context) => {
  // ...今後の実装
  const today = new Date();

  const startOfYearDate = startOfYear(today);
  const endOfYearDate = endOfYear(today);

  const startOfMonthDate = startOfMonth(today);
  const endOfMonthDate = endOfMonth(today);

  const getMeditationHistories = async (): Promise<History[]> => {
    // ...今後実装 BDから取得
    return [
      {
        id: "history_id_1",
        date: new Date(),
        session_count: 10,
        total_days: 10,
      },
      {
        id: "history_id_2",
        date: new Date(),
        session_count: 10,
        total_days: 10,
      },
      {
        id: "history_id_1",
        date: new Date(),
        session_count: 20,
        total_days: 20,
      },
      {
        id: "history_id_3",
        date: new Date(),
        session_count: 20,
        total_days: 20,
      },
      {
        id: "history_id_4",
        date: new Date(),
        session_count: 30,
        total_days: 30,
      },
    ];
  };

  const allMeditationHistories = await getMeditationHistories();
  const thisYearMeditationHistories = allMeditationHistories.filter(
    (history) => {
      return (
        isAfter(history.date, startOfYearDate) &&
        isBefore(history.date, endOfYearDate)
      );
    },
  );

  const thisMonthMeditationHistories = allMeditationHistories.filter(
    (history) => {
      return (
        isAfter(history.date, startOfMonthDate) &&
        isBefore(history.date, endOfMonthDate)
      );
    },
  );

  const getMetrics = (histories: History[]) => {
    const totalDays = histories.reduce(
      (total, history) => total + history.total_days,
      0,
    );
    const sessionCount = histories.reduce(
      (total, history) => total + history.session_count,
      0,
    );

    const sortCreatedAt = (a: History, b: History) =>
      b.date.getTime() - a.date.getTime();

    // 連続して瞑想した最大連続日数を計算
    // TODO: あとでテストコードを書いて検証する。
    const maxConsecutiveDays = histories
      .sort(sortCreatedAt)
      .reduce((total, history, index, histories) => {
        const diff = differenceInDays(
          history.date,
          histories[index + 1]?.date ?? history.date,
        );
        if (diff === 1) {
          total += 1;
          return total;
        }
        return 0;
      }, 0);

    return {
      session_count: totalDays,
      total_days: sessionCount,
      consecutive_days: maxConsecutiveDays,
    };
  };

  return {
    // サービスを利用してから、現在までのメトリクスを示す。
    total: {
      ...getMetrics(allMeditationHistories),
    },
    // 今月利用している、現在までのメトリクスを示す。
    month: {
      ...getMetrics(thisMonthMeditationHistories),
    },
    // 今年利用している、現在までのメトリクスを示す。
    year: {
      ...getMetrics(thisYearMeditationHistories),
    },
  };
};

// メンタルメトリックスカレンダー
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getMeditationCalender = async (_ctx: Context) => {
  // ...今後の実装
  return { message: "meditation_calender not implemented yet" };
};

// 実績達成のメダル取得
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getMedal = async (_ctx: Context) => {
  // ...今後の実装
  return { message: "medal not implemented yet" };
};

const parseUrlSearchParams = (urlSearchParams: URLSearchParams) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, ...params } = Object.fromEntries(urlSearchParams.entries());
  return { type, params };
};

const getDashboardStrategy = async (ctx: Context, type: DashboardType) => {
  const strategy = {
    mindfulness_meter: getMindfulnessMeter,
    past_meditation: getPastMeditation,
    meditation_calender: getMeditationCalender,
    medal: getMedal,
  };
  return await strategy[type](ctx);
};

const getDashboardData = async (
  type: DashboardType,
  user_id: string,
  options: Record<string, unknown>,
) => {
  const ctx: Context = {
    user_id,
    option: options,
  };
  return await getDashboardStrategy(ctx, type);
};

// curl http://localhost:3000/api/dashboard/user_id?type=mindfulness_meter&start_date=2024-01-01&end_date=2024-01-03
export async function GET(
  req: NextRequest,
  { params }: { params: { user_id: string } },
) {
  try {
    // パスパラメータ
    const { user_id: userId } = params;

    // クエリパラメータ
    const { searchParams } = new URL(req.url);
    const { type, params: option } = parseUrlSearchParams(searchParams);
    console.log({ option });

    if (!type) {
      return NextResponse.json(
        { message: "type is required" },
        { status: 400 },
      );
    }

    // 型チェック
    const validTypes: DashboardType[] = [
      "mindfulness_meter",
      "past_meditation",
      "meditation_calender",
      "medal",
    ];
    if (!validTypes.includes(type as DashboardType)) {
      return NextResponse.json(
        { message: "Invalid type. Must be one of: " + validTypes.join(", ") },
        { status: 400 },
      );
    }

    const data = await getDashboardData(type as DashboardType, userId, {
      start_date: option.start_date ?? null,
      end_date: option.end_date ?? null,
    });

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ message }, { status: 500 });
  }
}
