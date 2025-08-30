import React from 'react';
import { Medal } from '../atoms/Medal';
import { MedalData } from '../../types/dashboard';

interface MedalsSectionProps {
  medals: MedalData[];
  onMedalClick?: (medal: MedalData) => void;
}

export const MedalsSection: React.FC<MedalsSectionProps> = ({
  medals,
  onMedalClick
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        メダル
      </h2>
      <div className="flex space-x-4">
        {medals.map((medal) => (
          <Medal
            key={medal.id}
            medal={medal}
            onClick={() => onMedalClick?.(medal)}
          />
        ))}
      </div>
    </div>
  );
};
