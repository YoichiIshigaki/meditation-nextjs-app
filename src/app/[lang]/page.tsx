'use client';

import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MainContent from '@/components/MainContent';

interface HomeProps {
  lang: string;
}

export default function Home({ lang }: HomeProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Mobile-first: sidebar initially collapsed
  console.log(lang);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={cn('flex min-h-screen relative overflow-hidden')}> {/* Added overflow-hidden to prevent horizontal scroll from main content issues */}
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <MainContent toggleSidebar={toggleSidebar} /> {/* Pass toggleSidebar to MainContent for Header */}
      {/* Overlay for mobile when sidebar is open (covers MainContent) */}
      {!isSidebarCollapsed && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}