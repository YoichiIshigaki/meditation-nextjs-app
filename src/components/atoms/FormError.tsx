import { cn } from "@/lib/styles";

type FormErrorProps = {
  message?: string;
  className?: string;
};

export const FormError = ({ message, className }: FormErrorProps) => {
  if (!message) return null;

  return (
    <p className={cn("text-red-400 text-sm mt-1", className)}>{message}</p>
  );
};
