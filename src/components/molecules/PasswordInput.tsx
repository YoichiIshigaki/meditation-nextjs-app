"use client";
import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Lock } from "lucide-react";
import { GlassInput, PasswordToggle, FormError } from "@/components/atoms";

type PasswordInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  error?: string;
  showIcon?: boolean;
};

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ error, showIcon = true, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div>
        <GlassInput
          ref={ref}
          type={showPassword ? "text" : "password"}
          icon={showIcon ? <Lock className="h-5 w-5" /> : undefined}
          rightElement={
            <PasswordToggle
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />
          }
          {...props}
        />
        <FormError message={error} />
      </div>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
