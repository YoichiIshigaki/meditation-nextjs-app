import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/styles";

type GlassButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  loadingText?: string;
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
};

export const GlassButton = ({
  isLoading = false,
  loadingText,
  variant = "primary",
  children,
  className,
  disabled,
  ...props
}: GlassButtonProps) => {
  const variants = {
    primary: "bg-white text-indigo-600 hover:bg-white/90 focus:ring-white/50",
    secondary: "bg-white/10 text-white border border-white/20 hover:bg-white/20 focus:ring-white/30",
    ghost: "text-white/70 hover:text-white hover:bg-white/10",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "w-full py-3.5 font-semibold rounded-xl",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent",
        "transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "flex items-center justify-center gap-2",
        variants[variant],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          {loadingText && <span>{loadingText}</span>}
        </>
      ) : (
        children
      )}
    </button>
  );
};
