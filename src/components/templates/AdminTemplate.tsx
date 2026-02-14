import React from "react";
import { AdminSidebar } from "@/components/organisms/AdminSidebar";

type AdminTemplateProps = {
  children: React.ReactNode;
};

export const AdminTemplate: React.FC<AdminTemplateProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};
