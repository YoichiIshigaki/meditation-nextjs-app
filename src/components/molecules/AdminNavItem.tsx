"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/styles";
import { type LucideIcon } from "lucide-react";

type AdminNavItemProps = {
  href: string;
  icon: LucideIcon;
  label: string;
};

export const AdminNavItem = ({
  href,
  icon: Icon,
  label,
}: AdminNavItemProps) => {
  const pathname = usePathname();
  const isActive = pathname.includes(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
        isActive
          ? "bg-indigo-100 text-indigo-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </Link>
  );
};
