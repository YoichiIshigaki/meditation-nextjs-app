import React, { HTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/styles/utils";
// import WaveSvg from "./wave.svg";

const appIconVariants = cva(
  "text-[8px] w-[50px] h-[50px] rounded-xl bg-gradient-to-bl from-[#b722ff] to-[#22d4fe] text-white text-center",
  {
    variants: {
      shape: {
        square: "rounded-xl",
        circle: "rounded-full",
      },
      size: {
        sm: "text-[8px] w-[50px] h-[50px]",
        md: "text-md w-[75px] h-[75px]",
        lg: "text-xl w-[100px] h-[100px]",
      },
    },
    defaultVariants: {
      shape: "square",
      size: "sm",
    },
  }
);

type AppIconProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof appIconVariants>;

export const AppIcon: React.FC<AppIconProps> = ({ className, shape, size }) => {
  return (
    <div className={cn(appIconVariants({ shape, size }), className)}>
      <p className="inline-block pt-3">Meditation</p>
      <p>Web App</p>
    </div>
  );
};
