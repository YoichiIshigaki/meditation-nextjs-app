'use client';

import Image from 'next/image';

interface ProgramCardProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  progress: string;
  progressPercent: string;
  tagIcon: string;
  tagLabel: string;
}

export default function ProgramCard({
  imageUrl,
  title,
  subtitle,
  progress,
  progressPercent,
  tagIcon,
  tagLabel,
}: ProgramCardProps) {
  return (
    <div className="flex bg-white rounded-lg overflow-hidden mb-4 shadow-sm mx-5 cursor-pointer hover:shadow-md transition-shadow">
      <Image src={imageUrl} width={80} height={80} className="object-cover" alt={title} />
      <div className="p-2.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="font-bold text-base">{title}</div>
          <div className="text-xs text-gray-500">{subtitle}</div>
          <div className="flex items-center mt-1.5 text-xs text-gray-500">
            <span>{progress}</span>
            <div className="flex-1 h-[3px] bg-gray-300 rounded-sm mx-1.5">
              <div className="h-full bg-[#7273d0] rounded-sm" style={{ width: progressPercent }}></div>
            </div>
          </div>
        </div>
        <div className="inline-flex items-center bg-gray-100 py-1 px-2 rounded-full text-xs mt-1.5 self-start">
          <div className="w-4 h-4 mr-1 flex justify-center items-center">{tagIcon}</div>
          <span>{tagLabel}</span>
        </div>
      </div>
    </div>
  );
}