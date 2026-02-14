import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { GlassInput, FormError } from "@/components/atoms";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  icon?: ReactNode;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ error, icon, ...props }, ref) => {
    return (
      <div>
        <GlassInput ref={ref} icon={icon} {...props} />
        <FormError message={error} />
      </div>
    );
  },
);

TextInput.displayName = "TextInput";
