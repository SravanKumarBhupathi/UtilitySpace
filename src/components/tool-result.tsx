import * as React from "react";
import { Download, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ToolResultProps {
  title?: string;
  onDownload?: () => void;
  onReset: () => void;
  downloadLabel?: string;
  resetLabel?: string;
  children?: React.ReactNode;
}

export function ToolResult({
  title = "Result",
  onDownload,
  onReset,
  downloadLabel = "Download",
  resetLabel = "Process another file",
  children
}: ToolResultProps) {
  return (
    <div className="space-y-4 pt-4 border-t border-border animate-in fade-in duration-200">
      <h3 className="text-sm font-semibold text-secondary-text uppercase tracking-wider mb-3 text-center">{title}</h3>

      {children && (
        <div className="mb-4">
          {children}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        {onDownload && (
          <Button onClick={onDownload} className="w-full sm:flex-1" size="lg">
            <Download className="w-4 h-4 mr-2" /> {downloadLabel}
          </Button>
        )}
        <Button variant="outline" onClick={onReset} className="w-full sm:flex-1" size="lg">
          <RefreshCcw className="w-4 h-4 mr-2" /> {resetLabel}
        </Button>
      </div>
    </div>
  );
}
