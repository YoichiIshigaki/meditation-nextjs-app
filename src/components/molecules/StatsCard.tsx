import React from 'react';

interface StatsCardProps {
  value: number | string;
  label: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  value, 
  label, 
  className = "" 
}) => {
  return (
    <div className={`text-center ${className}`}>
      <div className="text-4xl font-bold text-gray-900 mb-2">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
};
