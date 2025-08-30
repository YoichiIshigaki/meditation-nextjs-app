import React from 'react';
import { CalendarDay as CalendarDayType } from '../../types/dashboard';

interface CalendarDayProps {
  day: CalendarDayType;
  onClick?: (day: number) => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({ day, onClick }) => {
  const handleClick = () => {
    if (day.isCurrentMonth && onClick) {
      onClick(day.day);
    }
  };

  return (
    <button
      className={`
        h-10 w-10 rounded-lg text-sm font-medium transition-colors
        ${
          day.isCurrentMonth
            ? day.isToday
              ? "bg-blue-500 text-white"
              : day.hasMeditation
                ? "bg-purple-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            : "text-gray-300"
        }
      `}
      onClick={handleClick}
      disabled={!day.isCurrentMonth}
    >
      {day.day}
    </button>
  );
};
