import React from 'react';
import { CalendarDay } from '../molecules/CalendarDay';
import { CalendarDay as CalendarDayType } from '../../types/dashboard';

interface CalendarProps {
  calendarDays: CalendarDayType[];
  selectedMonth?: string;
  selectedYear?: number;
  onDateSelect?: (day: number) => void;
  onMonthChange?: (month: string) => void;
  onYearChange?: (year: number) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  calendarDays,
  selectedMonth = "7月",
  selectedYear = 2025,
  onDateSelect,
  onMonthChange,
  onYearChange
}) => {
  const weekDays = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          カレンダー
        </h2>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">
          カレンダーを見る
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <select 
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
            value={selectedMonth}
            onChange={(e) => onMonthChange?.(e.target.value)}
            aria-label="月を選択"
          >
            <option>7月</option>
            <option>8月</option>
            <option>9月</option>
          </select>
          <select 
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm"
            value={selectedYear}
            onChange={(e) => onYearChange?.(Number(e.target.value))}
            aria-label="年を選択"
          >
            <option>2025</option>
            <option>2024</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs text-gray-500 py-2"
          >
            {day.charAt(0)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => (
          <CalendarDay
            key={index}
            day={date}
            onClick={onDateSelect}
          />
        ))}
      </div>
    </div>
  );
};
