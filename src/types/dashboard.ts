export interface MeditationStats {
  totalSessions: number;
  mindfulDays: number;
  weekStreak: number;
}

export interface WeeklyProgress {
  [key: string]: number;
}

export interface MedalData {
  id: string;
  value: number;
  earned: boolean;
}

export interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isToday?: boolean;
  hasMeditation?: boolean;
}
