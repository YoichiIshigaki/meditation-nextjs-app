"use client";
import React, { ReactNode, ButtonHTMLAttributes } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "rounded-md shadow text-lg text-white font-medium border transition-all duration-500",
  {
    variants: {
      variant: {
        primary: "bg-sky-500 hover:bg-sky-600",
        secondary: "bg-slate-500 hover:bg-slate-600",
        success: "bg-green-500 hover:bg-green-600",
        danger: "bg-red-500 hover:bg-red-600",
      },
      size: {
        sm: "text-sm px-4 py-2",
        md: "text-md px-6 py-4",
        lg: "text-xl px-8 py-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "sm",
    },
  },
);

type ButtonProps = {
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { pending?: boolean };

export const Button: React.FC<ButtonProps> = (props) => {
  const { children, className, size, variant, pending, ...rest } = props;
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }), {
        "bg-slate-900": pending,
      })}
      {...rest}
    >
      {children}
    </button>
  );
};
