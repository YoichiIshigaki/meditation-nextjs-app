'use client';

import Image from 'next/image';

interface RecommendationCardProps {
  imageUrl: string;
  title: string;
  description: string;
  tagIcon: string;
  tagLabel: string;
}

export default function RecommendationCard({
  imageUrl,
  title,
  description,
  tagIcon,
  tagLabel,
}: RecommendationCardProps) {
  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-lg overflow-hidden mb-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
      <Image src={imageUrl} width={80} height={80} className="w-full sm:w-20 h-32 sm:h-20 object-cover" alt={title} />
      <div className="p-2.5 flex-1 flex flex-col justify-between w-full">
        <div>
          <div className="font-bold text-sm sm:text-base">{title}</div>
          <div className="text-xs sm:text-sm text-gray-500">{description}</div>
        </div>
        <div className="inline-flex items-center bg-gray-100 py-0.5 px-1.5 sm:py-1 sm:px-2 rounded-full text-xs mt-2 sm:mt-1.5 self-start">
          <div className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex justify-center items-center">{tagIcon}</div>
          <span>{tagLabel}</span>
        </div>
      </div>
    </div>
  );
}