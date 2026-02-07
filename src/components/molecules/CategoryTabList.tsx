"use client";

import React from "react";
import { CategoryChip } from "@/components/atoms/CategoryChip";
import { cn } from "@/styles/classMerge";

export interface Category {
  id: string;
  label: string;
}

interface CategoryTabListProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
}

export const CategoryTabList: React.FC<CategoryTabListProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-hide",
        className
      )}
    >
      {categories.map((category) => (
        <CategoryChip
          key={category.id}
          label={category.label}
          isActive={activeCategory === category.id}
          onClick={() => onCategoryChange(category.id)}
        />
      ))}
    </div>
  );
};
