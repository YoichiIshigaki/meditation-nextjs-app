import React from "react";
import { DashboardHeader } from "../organisms/DashboardHeader";
import { DashboardSidebar } from "../organisms/DashboardSidebar";

interface DashboardTemplateProps {
  children: React.ReactNode;
  userName?: string;
  userId?: string;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  children,
  userName,
  userId,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* サイドバー */}
          <div className="lg:col-span-1">
            <DashboardSidebar userName={userName} userId={userId} />
          </div>

          {/* メインコンテンツ */}
          <div className="lg:col-span-3 space-y-8">{children}</div>
        </div>
      </div>
    </div>
  );
};
