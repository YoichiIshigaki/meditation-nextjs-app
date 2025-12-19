import React from "react";
import { ProgressBar } from "../atoms/ProgressBar";
import { WeeklyProgress } from "../../types/dashboard";

interface WeeklyProgressChartProps {
  weeklyProgress: WeeklyProgress;
  title?: string;
}

export const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({
  weeklyProgress,
  title = "先週の瞑想",
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-medium text-gray-700 mb-4">{title}</h3>
      <div className="grid grid-cols-7 gap-2">
        {Object.entries(weeklyProgress).map(([day, progress]) => (
          <div key={day} className="text-center">
            <div className="text-xs text-gray-500 mb-2">{day}</div>
            <ProgressBar progress={progress} />
          </div>
        ))}
      </div>
    </div>
  );
};
