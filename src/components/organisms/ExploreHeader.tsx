"use client";

import React from "react";
import { SearchInput } from "@/components/atoms/SearchInput";
import { CategoryTabList, Category } from "@/components/molecules/CategoryTabList";

interface ExploreHeaderProps {
  title: string;
  subtitle: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder: string;
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const ExploreHeader: React.FC<ExploreHeaderProps> = ({
  title,
  subtitle,
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-500">{subtitle}</p>
      </div>

      <SearchInput
        value={searchQuery}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
      />

      <CategoryTabList
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
      />
    </div>
  );
};
