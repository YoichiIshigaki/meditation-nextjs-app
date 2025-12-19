import React from "react";

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className = "",
}) => {
  return (
    <div
      className={`h-24 bg-gray-100 rounded-lg relative overflow-hidden ${className}`}
    >
      <div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-400 rounded-lg transition-all duration-300"
        style={{ height: `${progress}%` }}
      />
    </div>
  );
};
