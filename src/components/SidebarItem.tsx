"use client";

import { cn } from "@/styles/classMerge";
import React from "react";

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  isCollapsed: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

export default function SidebarItem({
  icon,
  text,
  isCollapsed,
  isActive,
  onClick,
}: SidebarItemProps) {
  return (
    <div
      className={cn(
        "flex items-center py-3 px-2.5 rounded-md mb-1.5 text-sm cursor-pointer whitespace-nowrap hover:bg-gray-200",
        { "bg-gray-300 font-bold": isActive },
      )}
      onClick={onClick}
    >
      <div
        className={cn("w-5 h-5 flex justify-center items-center shrink-0", {
          "mr-0": isCollapsed,
          "mr-2.5": !isCollapsed,
        })}
      >
        {icon}
      </div>
      <div
        className={cn(
          "transition-opacity duration-200 ease-in-out overflow-hidden",
          { "opacity-0 w-0": isCollapsed, "opacity-100": !isCollapsed },
        )}
      >
        {text}
      </div>
    </div>
  );
}
