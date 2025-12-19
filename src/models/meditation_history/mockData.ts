import type { MeditationHistory } from "./type";
import { format } from "date-fns";

export const getMockMeditationHistory = (
  count: number,
  date: Date,
): MeditationHistory[] => {
  const mockUserId = `user_id_${count}`;
  const mockMeditationId = `meditation_id_${count}`;
  const mockDate = format(date, "yyyy-MM-dd");

  const mockHistories = Array.from({ length: count }, (_, index) => {
    return {
      id: `${mockUserId}_${mockMeditationId}`,
      user_id: mockUserId,
      meditation_id: mockMeditationId,
      duration: index,
      date: mockDate,
      mindfulness_score: index * 10,
      created_at: date,
      updated_at: date,
    };
  }) satisfies MeditationHistory[];

  return mockHistories;
};
