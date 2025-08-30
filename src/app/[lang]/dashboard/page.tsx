"use client";
import React, { useState } from "react";
import { DashboardTemplate } from "../../../components/templates/DashboardTemplate";
import { MindfulMeter } from "../../../components/organisms/MindfulMeter";
import { MeditationStats } from "../../../components/organisms/MeditationStats";
import { Calendar } from "../../../components/organisms/Calendar";
import { MedalsSection } from "../../../components/organisms/MedalsSection";
import { 
  MeditationStats as MeditationStatsType,
  WeeklyProgress,
  MedalData,
  CalendarDay as CalendarDayType
} from "../../../types/dashboard";

// メインダッシュボードコンポーネント
const Dashboard: React.FC = () => {
  const [, setSelectedDate] = useState<number>(12);
  const [currentMonth, setCurrentMonth] = useState<string>("7月");
  const [currentYear, setCurrentYear] = useState<number>(2025);

  // サンプルデータ
  const stats: MeditationStatsType = {
    totalSessions: 340,
    mindfulDays: 4494,
    weekStreak: 12,
  };

  const weeklyProgress: WeeklyProgress = {
    日: 0,
    月: 20,
    火: 0,
    水: 100,
    木: 0,
    金: 0,
    土: 0,
  };

  const medals: MedalData[] = [
    { id: "1", value: 1, earned: true },
    { id: "5", value: 5, earned: true },
    { id: "10", value: 10, earned: true },
    { id: "50", value: 50, earned: true },
    { id: "100", value: 100, earned: true },
    { id: "500", value: 500, earned: false },
    { id: "1000", value: 1000, earned: false },
  ];

  const calendarDays: CalendarDayType[] = [
    { day: 30, isCurrentMonth: false },
    { day: 1, isCurrentMonth: true },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true },
    { day: 4, isCurrentMonth: true },
    { day: 5, isCurrentMonth: true },
    { day: 6, isCurrentMonth: true },
    { day: 7, isCurrentMonth: true },
    { day: 8, isCurrentMonth: true, hasMeditation: true },
    { day: 9, isCurrentMonth: true, hasMeditation: true },
    { day: 10, isCurrentMonth: true },
    { day: 11, isCurrentMonth: true },
    { day: 12, isCurrentMonth: true, isToday: true },
    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true },
    { day: 15, isCurrentMonth: true },
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true },
    { day: 18, isCurrentMonth: true },
    { day: 19, isCurrentMonth: true },
    { day: 20, isCurrentMonth: true },
    { day: 21, isCurrentMonth: true },
    { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true },
    { day: 24, isCurrentMonth: true },
    { day: 25, isCurrentMonth: true },
    { day: 26, isCurrentMonth: true },
    { day: 27, isCurrentMonth: true },
    { day: 28, isCurrentMonth: true },
    { day: 29, isCurrentMonth: true },
    { day: 30, isCurrentMonth: true },
    { day: 31, isCurrentMonth: true },
    { day: 1, isCurrentMonth: false },
    { day: 2, isCurrentMonth: false },
    { day: 3, isCurrentMonth: false },
  ];

  const handleDateSelect = (day: number) => {
    setSelectedDate(day);
    console.log('Selected date:', day);
  };

  const handleMonthChange = (month: string) => {
    setCurrentMonth(month);
  };

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
  };

  const handleMedalClick = (medal: MedalData) => {
    console.log('Medal clicked:', medal);
  };

  return (
    <DashboardTemplate userName="John" userId="user-id">
      <MindfulMeter 
        weeklyProgress={weeklyProgress}
        overallProgress={75}
      />
      
      <MeditationStats stats={stats} />
      
      <Calendar
        calendarDays={calendarDays}
        selectedMonth={currentMonth}
        selectedYear={currentYear}
        onDateSelect={handleDateSelect}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
      />
      
      <MedalsSection 
        medals={medals}
        onMedalClick={handleMedalClick}
      />
    </DashboardTemplate>
  );
};

export default Dashboard;
