"use client";

import { cn } from "@/styles/classMerge";
import React from "react";
import Link from "next/link";

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  isCollapsed: boolean;
  isActive?: boolean;
  href?: string;
  onClick?: () => void;
}

export default function SidebarItem({
  icon,
  text,
  isCollapsed,
  isActive,
  href,
  onClick,
}: SidebarItemProps) {
  const content = (
    <>
      <div className="w-5 h-5 flex justify-center items-center shrink-0 mr-2.5">
        {icon}
      </div>
      <div>{text}</div>
    </>
  );

  const className = cn(
    "flex items-center py-3 px-2.5 rounded-md mb-1.5 text-sm cursor-pointer whitespace-nowrap hover:bg-gray-200 transition-opacity duration-300",
    {
      "bg-gray-300 font-bold": isActive,
      "opacity-0": isCollapsed,
      "opacity-100": !isCollapsed,
    },
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <div className={className} onClick={onClick}>
      {content}
    </div>
  );
}
