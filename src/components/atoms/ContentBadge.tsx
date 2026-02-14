"use client";

import React from "react";
import { cn } from "@/styles/classMerge";

interface ContentBadgeProps {
  label: string;
  variant?: "duration" | "category" | "new" | "popular";
  className?: string;
}

const variantStyles = {
  duration: "bg-black/50 text-white",
  category: "bg-indigo-100 text-indigo-700",
  new: "bg-green-100 text-green-700",
  popular: "bg-orange-100 text-orange-700",
};

export const ContentBadge: React.FC<ContentBadgeProps> = ({
  label,
  variant = "category",
  className,
}) => {
  return (
    <span
      className={cn(
        "px-2 py-1 rounded-md text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {label}
    </span>
  );
};
