"use client";

import React from "react";
import { Search } from "lucide-react";
import { cn } from "@/styles/classMerge";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "検索...",
  className,
}) => {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full pl-10 pr-4 py-3 rounded-xl",
          "bg-white border border-gray-200",
          "text-gray-900 placeholder-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
          "transition-all duration-200",
        )}
      />
    </div>
  );
};
