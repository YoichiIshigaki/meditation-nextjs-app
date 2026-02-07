"use client";

import React from "react";
import { ContentCard, ContentCardData } from "@/components/molecules/ContentCard";
import { cn } from "@/styles/classMerge";

interface ContentGridProps {
  contents: ContentCardData[];
  onContentClick?: (content: ContentCardData) => void;
  onFavoriteClick?: (content: ContentCardData) => void;
  emptyMessage?: string;
  newBadgeLabel?: string;
  popularBadgeLabel?: string;
  className?: string;
}

export const ContentGrid: React.FC<ContentGridProps> = ({
  contents,
  onContentClick,
  onFavoriteClick,
  emptyMessage = "コンテンツが見つかりませんでした",
  newBadgeLabel = "NEW",
  popularBadgeLabel = "人気",
  className,
}) => {
  if (contents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🧘</span>
        </div>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {contents.map((content) => (
        <ContentCard
          key={content.id}
          content={content}
          onClick={() => onContentClick?.(content)}
          onFavoriteClick={() => onFavoriteClick?.(content)}
          newBadgeLabel={newBadgeLabel}
          popularBadgeLabel={popularBadgeLabel}
        />
      ))}
    </div>
  );
};
