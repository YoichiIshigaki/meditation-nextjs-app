import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/styles";

type GlassInputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: ReactNode;
  rightElement?: ReactNode;
};

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ icon, rightElement, className, ...props }, ref) => {
    return (
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-white/50">{icon}</span>
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50",
            "focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent",
            "transition-all duration-200",
            icon ? "pl-12" : "pl-4",
            rightElement ? "pr-12" : "pr-4",
            className,
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
    );
  },
);

GlassInput.displayName = "GlassInput";
