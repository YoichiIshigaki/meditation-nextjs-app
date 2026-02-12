import { forwardRef, type InputHTMLAttributes, useState } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/styles";

type FileUploadInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  label?: string;
  accept?: string;
  maxSize?: number;
  preview?: string;
  onFileChange?: (file: File | null) => void;
  onClear?: () => void;
  error?: string;
};

export const FileUploadInput = forwardRef<HTMLInputElement, FileUploadInputProps>(
  ({ label, accept, maxSize, preview, onFileChange, onClear, error, className, ...props }, ref) => {
    const [dragActive, setDragActive] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        setFileName(file.name);
        onFileChange?.(file);
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setFileName(file.name);
        onFileChange?.(file);
      }
    };

    const handleClear = () => {
      setFileName(null);
      onClear?.();
    };

    return (
      <div className={cn("w-full", className)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 text-center transition-colors",
            dragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-gray-400",
            error && "border-red-500"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {preview ? (
            <div className="relative inline-block">
              <img src={preview} alt="Preview" className="max-h-32 rounded-lg" />
              <button
                type="button"
                onClick={handleClear}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : fileName ? (
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-gray-600">{fileName}</span>
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-red-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                ドラッグ&ドロップ または クリックして選択
              </p>
              {maxSize && (
                <p className="mt-1 text-xs text-gray-500">
                  最大サイズ: {Math.round(maxSize / 1024 / 1024)}MB
                </p>
              )}
            </>
          )}
          <input
            ref={ref}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

FileUploadInput.displayName = "FileUploadInput";
