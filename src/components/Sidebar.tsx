"use client";

import { cn } from "@/styles/classMerge";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import SidebarItem from "@/components/SidebarItem";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const mainNavigationItems = [
  { icon: "📁", text: "フォルダ" },
  { icon: "🏠", text: "今日", isActive: true },
  { icon: "🔍", text: "探す" },
  { icon: "🎵", text: "瞑想" },
  { icon: "🔊", text: "サウンド" },
  { icon: "👤", text: "プロフィール" },
  { icon: "🔍", text: "検索" },
];

const shortcutItems = [
  { icon: "♡", text: "お気に入り" },
  { icon: "✓", text: "ムードチェック" },
  { icon: "🧘", text: "呼吸" },
  { icon: "🎵", text: "くつろぎサウンド" },
  { icon: "📝", text: "今日の名言" },
  { icon: "🏆", text: "チャレンジ" },
  { icon: "📓", text: "ノート" },
  { icon: "📊", text: "ムードログ" },
];

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(true);

  return (
    <div
      style={{
        width: isCollapsed ? "60px" : "225px",
        transition: "width 300ms ease-in-out",
      }}
      className={cn(
        "bg-gray-100 border-r border-gray-300 p-4 flex flex-col overflow-hidden",
        "hidden md:flex",
      )}
    >
      <div
        className={cn(
          "w-8 h-8 bg-gray-200 border border-gray-300 rounded-full flex justify-center items-center cursor-pointer text-sm mb-4 shrink-0",
          "hidden md:flex", // Only show on desktop
          {
            "self-center": isCollapsed,
            "self-end": !isCollapsed,
          },
        )}
        onClick={toggleSidebar}
      >
        {isCollapsed ? "▶" : "◀"}
      </div>

      {mainNavigationItems.map((item) => (
        <SidebarItem
          key={item.text}
          icon={item.icon}
          text={item.text}
          isCollapsed={isCollapsed}
          isActive={item.isActive}
        />
      ))}

      <div className="mt-5 w-full">
        <div
          className={cn(
            "flex justify-between items-center py-1 text-sm text-gray-500 cursor-pointer transition-opacity duration-300",
            {
              "opacity-0": isCollapsed,
              "opacity-100": !isCollapsed,
            },
          )}
          onClick={() => setIsShortcutsOpen(!isShortcutsOpen)}
        >
          <span>ショートカット</span>
          <ChevronDown
            className={cn(
              "w-4 h-4 transition-transform duration-300",
              { "rotate-180": !isShortcutsOpen }
            )}
          />
        </div>
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            {
              "max-h-96 opacity-100": isShortcutsOpen,
              "max-h-0 opacity-0": !isShortcutsOpen,
            }
          )}
        >
          {shortcutItems.map((item) => (
            <SidebarItem
              key={item.text}
              icon={item.icon}
              text={item.text}
              isCollapsed={isCollapsed}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
