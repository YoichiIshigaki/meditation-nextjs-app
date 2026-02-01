import { Eye, EyeOff } from "lucide-react";

type PasswordToggleProps = {
  show: boolean;
  onToggle: () => void;
};

export const PasswordToggle = ({ show, onToggle }: PasswordToggleProps) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="text-white/50 hover:text-white/80 transition-colors"
    >
      {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </button>
  );
};
