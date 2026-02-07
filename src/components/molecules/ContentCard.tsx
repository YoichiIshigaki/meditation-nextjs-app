"use client";

import React from "react";
import { Play, Heart, Clock } from "lucide-react";
import { cn } from "@/styles/classMerge";
import { ContentBadge } from "@/components/atoms/ContentBadge";

export interface ContentCardData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  category: string;
  isFavorite?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
}

interface ContentCardProps {
  content: ContentCardData;
  onClick?: () => void;
  onFavoriteClick?: () => void;
  className?: string;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  content,
  onClick,
  onFavoriteClick,
  className,
}) => {
  return (
    <div
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100",
        "hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {/* 画像部分 */}
      <div className="relative aspect-video overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
          style={{
            backgroundImage: `url(${content.imageUrl})`,
            backgroundColor: "#e0e7ff",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* 再生ボタン */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
            <Play className="w-6 h-6 text-indigo-600 ml-1" />
          </div>
        </div>

        {/* 時間バッジ */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1">
          <Clock className="w-3 h-3 text-white" />
          <ContentBadge label={content.duration} variant="duration" />
        </div>

        {/* お気に入りボタン */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteClick?.();
          }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              content.isFavorite
                ? "fill-red-500 text-red-500"
                : "text-gray-600 hover:text-red-500"
            )}
          />
        </button>

        {/* 新着/人気バッジ */}
        {(content.isNew || content.isPopular) && (
          <div className="absolute top-3 left-3">
            {content.isNew && <ContentBadge label="NEW" variant="new" />}
            {content.isPopular && !content.isNew && (
              <ContentBadge label="人気" variant="popular" />
            )}
          </div>
        )}
      </div>

      {/* コンテンツ情報 */}
      <div className="p-4">
        <ContentBadge label={content.category} variant="category" className="mb-2" />
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
          {content.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">{content.description}</p>
      </div>
    </div>
  );
};
