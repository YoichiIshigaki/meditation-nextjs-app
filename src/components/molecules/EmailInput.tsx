import { forwardRef, type InputHTMLAttributes } from "react";
import { Mail } from "lucide-react";
import { GlassInput, FormError } from "@/components/atoms";

type EmailInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  error?: string;
  showIcon?: boolean;
};

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ error, showIcon = true, ...props }, ref) => {
    return (
      <div>
        <GlassInput
          ref={ref}
          type="email"
          icon={showIcon ? <Mail className="h-5 w-5" /> : undefined}
          {...props}
        />
        <FormError message={error} />
      </div>
    );
  },
);

EmailInput.displayName = "EmailInput";
