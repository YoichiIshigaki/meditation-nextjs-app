import React from 'react';
import { StatsCard } from '../molecules/StatsCard';
import { MeditationStats as MeditationStatsType } from '../../types/dashboard';

interface MeditationStatsProps {
  stats: MeditationStatsType;
}

export const MeditationStats: React.FC<MeditationStatsProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          これまでの瞑想
        </h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">
            全計
          </button>
          <button className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm">
            月
          </button>
          <button className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm">
            年
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <StatsCard 
          value={stats.totalSessions} 
          label="セッション数" 
        />
        <StatsCard 
          value={stats.mindfulDays} 
          label="マインドフル日数" 
        />
        <StatsCard 
          value={stats.weekStreak} 
          label="週間日数" 
        />
      </div>
    </div>
  );
};
