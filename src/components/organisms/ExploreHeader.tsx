"use client";

import React from "react";
import { SearchInput } from "@/components/atoms/SearchInput";
import { CategoryTabList, Category } from "@/components/molecules/CategoryTabList";

interface ExploreHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const ExploreHeader: React.FC<ExploreHeaderProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">瞑想を探す</h1>
        <p className="text-gray-500">
          あなたにぴったりの瞑想コンテンツを見つけましょう
        </p>
      </div>

      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="瞑想、リラックス、睡眠..."
      />

      <CategoryTabList
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
      />
    </div>
  );
};
