type DividerProps = {
  text?: string;
};

export const Divider = ({ text }: DividerProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-white/20" />
      </div>
      {text && (
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-transparent text-white/50">{text}</span>
        </div>
      )}
    </div>
  );
};
