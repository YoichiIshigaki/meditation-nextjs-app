import React from "react";
import { MedalData } from "../../types/dashboard";

interface MedalProps {
  medal: MedalData;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export const Medal: React.FC<MedalProps> = ({
  medal,
  size = "md",
  onClick,
}) => {
  const sizeClasses = {
    sm: "w-12 h-12 text-sm",
    md: "w-16 h-16 text-base",
    lg: "w-20 h-20 text-lg",
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white cursor-pointer transition-transform hover:scale-105
        ${
          medal.earned
            ? "bg-gradient-to-r from-yellow-400 to-orange-400"
            : "bg-gray-300"
        }
      `}
      onClick={onClick}
    >
      {medal.value}
    </div>
  );
};
