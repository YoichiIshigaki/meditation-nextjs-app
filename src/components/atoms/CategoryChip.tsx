"use client";

import React from "react";
import { cn } from "@/styles/classMerge";

interface CategoryChipProps {
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  isActive = false,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
        "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        isActive
          ? "bg-indigo-600 text-white shadow-md"
          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
      )}
    >
      {label}
    </button>
  );
};
