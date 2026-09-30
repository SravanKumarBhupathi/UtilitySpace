import * as React from "react";
import { UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  accept: string;
  maxSizeMB?: number;
  label?: string;
  description?: string;
}

export function FileUploader({
  onFileSelect,
  accept,
  maxSizeMB = 10,
  label = "Upload File",
  description = "Drag and drop or click to browse"
}: FileUploaderProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setError(null);

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Maximum supported size: ${maxSizeMB} MB.`);
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div
        className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
          ${dragActive ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Upload file"
      >
        <UploadCloud className="w-12 h-12 text-secondary-text mb-4" />
        <h3 className="font-heading font-medium text-lg mb-1">{label}</h3>
        <p className="text-sm text-secondary-text mb-2">{description}</p>
        <p className="text-xs text-secondary-text mb-4 uppercase">Max size: {maxSizeMB}MB</p>
        <Button type="button" variant="outline" tabIndex={-1}>Choose File</Button>
      </div>

      {error && (
        <p className="text-sm text-red-500 font-medium text-center bg-red-50 p-2 rounded">{error}</p>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleChange}
        accept={accept}
        className="hidden"
      />
    </div>
  );
}
