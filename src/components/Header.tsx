"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { useLanguage, useTranslation } from "@/i18n/client";
import { useLogout } from "@/hooks/useLogout";
import type { User } from "next-auth"

interface HeaderProps {
  toggleSidebar?: () => void;
  user?: User;
};

export default function Header({ toggleSidebar, user }: HeaderProps) {
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const { logout } = useLogout();

  const greeting = user ? t("home:header.greeting") : t("home:header.guest_greeting");
  const honorificTitle = user ? t("home:header.honorific_title") : t("home:header.guest_honorific");

  const userName = user?.name ?? t("home:header.guest");
  return (
    <div className="flex justify-between items-center py-4 px-5 bg-white/80">
      <div className="flex items-center">
        {/* Hamburger menu for mobile */}
        {toggleSidebar && (
          <button
            onClick={toggleSidebar}
            className="md:hidden mr-2 p-1 text-gray-600 hover:text-gray-800"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        )}
        {user?.image ? (
          <img
            src={user.image}
            alt="User"
            className="w-10 h-10 rounded-full mr-2.5 object-contain"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-[#7273d0] mr-2.5 flex justify-center items-center text-white">
            {userName.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div>
          <div>{greeting}{userName}{honorificTitle}</div>
          <div className="text-sm text-gray-500 flex items-center gap-1">
            {t("home:mood_check")} <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {user && (
        <button
          onClick={() => logout()}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {t("home:header.logout")}
        </button>
      )}
    </div>
  );
}
