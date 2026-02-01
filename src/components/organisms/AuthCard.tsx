import { type ReactNode } from "react";
import { AppIcon, TranslateText } from "@/components";

type AuthCardProps = {
  titleKey: string;
  subtitle?: string;
  children: ReactNode;
};

export const AuthCard = ({ titleKey, subtitle, children }: AuthCardProps) => {
  return (
    <div className="relative w-full max-w-md">
      <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 space-y-6">
        {/* ヘッダー */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <AppIcon shape="square" size="lg" />
          </div>
          <div>
            <TranslateText
              element="h1"
              className="text-3xl font-bold text-white"
              translateKey={titleKey}
            />
            {subtitle && <p className="text-white/70 mt-2">{subtitle}</p>}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};
