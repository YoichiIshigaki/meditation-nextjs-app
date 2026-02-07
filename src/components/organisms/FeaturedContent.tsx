"use client";

import React from "react";
import { Play, Clock } from "lucide-react";
import { cn } from "@/styles/classMerge";
import { ContentCardData } from "@/components/molecules/ContentCard";

interface FeaturedContentProps {
  content: ContentCardData;
  onClick?: () => void;
  className?: string;
}

export const FeaturedContent: React.FC<FeaturedContentProps> = ({
  content,
  onClick,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden cursor-pointer group",
        "shadow-lg hover:shadow-xl transition-shadow duration-300",
        className
      )}
      onClick={onClick}
    >
      {/* 背景画像 */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{
          backgroundImage: `url(${content.imageUrl})`,
          backgroundColor: "#4f46e5",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-indigo-800/70 to-transparent" />

      {/* コンテンツ */}
      <div className="relative p-8 flex flex-col justify-center min-h-[200px]">
        <span className="text-indigo-200 text-sm font-medium mb-2">
          おすすめ
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 max-w-lg">
          {content.title}
        </h2>
        <p className="text-indigo-100 mb-4 max-w-md line-clamp-2">
          {content.description}
        </p>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 bg-white text-indigo-600 px-5 py-2.5 rounded-full font-medium hover:bg-indigo-50 transition-colors">
            <Play className="w-4 h-4" />
            今すぐ始める
          </button>
          <div className="flex items-center gap-1 text-indigo-200">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{content.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
