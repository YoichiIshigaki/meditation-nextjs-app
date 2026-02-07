import React from "react";
import { DashboardHeader } from "@/components/organisms/DashboardHeader";

interface ExploreTemplateProps {
  children: React.ReactNode;
}

export const ExploreTemplate: React.FC<ExploreTemplateProps> = ({
  children,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <DashboardHeader />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};
