'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import SidebarItem from '@/components/SidebarItem';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const mainNavigationItems = [
  { icon: '📁', text: 'フォルダ' },
  { icon: '🏠', text: '今日', isActive: true },
  { icon: '🔍', text: '探す' },
  { icon: '🎵', text: '瞑想' },
  { icon: '🔊', text: 'サウンド' },
  { icon: '👤', text: 'プロフィール' },
  { icon: '🔍', text: '検索' },
];

const shortcutItems = [
  { icon: '♡', text: 'お気に入り' },
  { icon: '✓', text: 'ムードチェック' },
  { icon: '🧘', text: '呼吸' },
  { icon: '🎵', text: 'くつろぎサウンド' },
  { icon: '📝', text: '今日の名言' },
  { icon: '🏆', text: 'チャレンジ' },
  { icon: '📓', text: 'ノート' },
  { icon: '📊', text: 'ムードログ' },
];

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
  return (
    <div
      className={cn(
        'bg-gray-100 border-r border-gray-300 p-4 flex flex-col',
        'fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out', // Mobile: fixed, w-64
        'md:static md:z-auto md:transform-none md:transition-all md:duration-300 md:ease-in-out', // Desktop: static
        {
          'translate-x-0': !isCollapsed, // Show on mobile
          '-translate-x-full': isCollapsed, // Hide on mobile
          'md:w-[225px]': !isCollapsed, // Desktop expanded
          'md:w-[60px] md:overflow-hidden': isCollapsed, // Desktop collapsed
        }
      )}
    >
      <div
        className={cn(
          'w-8 h-8 bg-gray-200 border border-gray-300 rounded-full flex justify-center items-center cursor-pointer text-sm mb-4 shrink-0',
          'hidden md:flex', // Only show on desktop
          {
            'self-center': isCollapsed,
            'self-end': !isCollapsed,
          }
        )}
        onClick={toggleSidebar}
      >
        {isCollapsed ? '▶' : '◀'}
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
        <div className={cn('flex justify-between items-center py-1 text-sm text-gray-500 cursor-pointer', { 'hidden': isCollapsed })}>
          <span>ショートカット</span>
          <span>∨</span>
        </div>
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
  );
}