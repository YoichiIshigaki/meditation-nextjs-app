import React from "react";
import { Calendar, User, Heart, Target, Book } from "lucide-react";

export const DashboardHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                MediMate
              </span>
            </div>
          </div>
          <nav className="flex items-center space-x-6">
            <button className="flex items-center space-x-1 text-gray-700 hover:text-purple-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">今日</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-700 hover:text-purple-600">
              <Target className="w-4 h-4" />
              <span className="text-sm">探す</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-700 hover:text-purple-600">
              <Book className="w-4 h-4" />
              <span className="text-sm">睡眠</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-700 hover:text-purple-600">
              <Heart className="w-4 h-4" />
              <span className="text-sm">音楽</span>
            </button>
          </nav>
          <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};
