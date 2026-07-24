"use client";

import { Upload } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";

import { cn } from "@/lib/utils";

type DropzoneProps = {
  disabled?: boolean;
  onFilesSelect: (files: File[]) => void;
};

const ACCEPT =
  "image/png,image/jpeg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg";

export function Dropzone({ disabled = false, onFilesSelect }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (!disabled) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);

    if (disabled) {
      return;
    }

    const droppedFiles = Array.from(event.dataTransfer.files);

    if (droppedFiles.length > 0) {
      onFilesSelect(droppedFiles);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    if (selectedFiles.length > 0) {
      onFilesSelect(selectedFiles);
    }

    event.target.value = "";
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(event) => {
        if ((event.key === "Enter" || event.key === " ") && !disabled) {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 text-center shadow-sm ring-1 ring-foreground/5 transition-colors",
        isDragActive
          ? "border-primary bg-primary/10 ring-primary/20"
          : "border-foreground/20 bg-card hover:border-foreground/35 hover:bg-card/80",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-secondary text-foreground">
        <Upload className="size-5" />
      </div>

      <p className="text-base font-medium">
        Drop images here or choose files
      </p>
      <p className="mt-2 max-w-sm text-base text-muted-foreground">
        PNG, JPG, JPEG, WebP, or SVG up to 5 MB — multiple files supported
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        disabled={disabled}
        onChange={handleInputChange}
      />
    </div>
  );
}
