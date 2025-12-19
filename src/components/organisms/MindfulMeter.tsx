import React from "react";
import { WeeklyProgressChart } from "../molecules/WeeklyProgressChart";
import { CircularProgress } from "../atoms/CircularProgress";
import { WeeklyProgress } from "../../types/dashboard";

interface MindfulMeterProps {
  weeklyProgress: WeeklyProgress;
  overallProgress: number;
}

export const MindfulMeter: React.FC<MindfulMeterProps> = ({
  weeklyProgress,
  overallProgress,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        マインドフルメーター
      </h2>

      <WeeklyProgressChart weeklyProgress={weeklyProgress} />

      {/* 進捗円グラフ */}
      <div className="flex justify-end">
        <CircularProgress progress={overallProgress} />
      </div>
    </div>
  );
};
