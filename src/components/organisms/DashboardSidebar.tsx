import React from 'react';
import {
  User,
  BarChart3,
  Heart,
  Target,
  Settings,
  Globe,
  LogOut,
} from "lucide-react";

interface DashboardSidebarProps {
  userName?: string;
  userId?: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  userName = "John",
  userId = "user-id"
}) => {
  const menuItems = [
    { icon: BarChart3, label: "これまでの瞑想" },
    { icon: Heart, label: "お気に入り" },
    { icon: Target, label: "定期購読" },
    { icon: Settings, label: "設定" },
    { icon: BarChart3, label: "気分の履歴" },
    { icon: Globe, label: "言語" },
    { icon: LogOut, label: "ログアウト" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* プロフィール */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{userName}</h3>
            <p className="text-sm text-gray-500">{userId}</p>
          </div>
        </div>
      </div>

      {/* メニュー */}
      <nav className="py-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button className="w-full flex items-center space-x-3 px-6 py-3 text-left text-gray-700 hover:bg-gray-50">
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
