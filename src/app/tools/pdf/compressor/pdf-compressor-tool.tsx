"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File, X, Download, Loader2, FileDown } from "lucide-react";
import { compressPdf } from "@/lib/pdf-utils";

export function PDFCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [newSize, setNewSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      if (selected.type !== "application/pdf") {
        setError("Please select a valid PDF document.");
        return;
      }
      setFile(selected);
      setOriginalSize(selected.size);
      setError(null);
      setResultUrl(null);
    }
  };

  const handleProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setResultUrl(null);

    try {
      const compressedBytes = await compressPdf(file);
      const blob = new Blob([new Uint8Array(compressedBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
      setNewSize(blob.size);
    } catch (err: any) {
      setError(err.message || "We couldn't compress this PDF. It might be corrupted or encrypted.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setError(null);
  };

  const savings = originalSize > 0 ? ((originalSize - newSize) / originalSize) * 100 : 0;
  const isActuallySmaller = newSize > 0 && newSize < originalSize;

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="text-center mb-6">
          <p className="text-sm text-secondary-text bg-muted/50 inline-block px-3 py-1 rounded-full border border-border">
            🔒 Your PDF is processed locally in your browser.
          </p>
        </div>

        {!file ? (
          <div
            className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-secondary-text mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload PDF File</h3>
            <p className="text-sm text-secondary-text">Select a PDF to reduce its file size.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-background">
              <div className="flex items-center gap-3 overflow-hidden">
                <File className="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-secondary-text">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={reset} className="text-secondary-text hover:text-red-500">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {!resultUrl && (
              <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-border text-center">
                <p className="text-sm text-secondary-text mb-4">
                  We will remove unnecessary metadata and structural dead-weight. (Deep image compression currently unavailable locally).
                </p>
                <Button className="w-full sm:w-auto" size="lg" onClick={handleProcess} disabled={isProcessing}>
                  {isProcessing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Compressing...</>
                  ) : (
                    <><FileDown className="w-4 h-4 mr-2" /> Compress PDF</>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="application/pdf"
          onChange={handleFileChange}
        />

        {error && (
          <div className="mt-4 p-4 text-sm text-red-600 bg-red-500/10 border border-red-500/20 rounded-md">
            {error}
          </div>
        )}

        {resultUrl && (
          <div className="mt-6 p-6 border border-border bg-muted/10 rounded-xl text-center space-y-4">
            <h3 className="text-xl font-bold mb-2">Processing Complete!</h3>

            <div className="flex justify-center gap-8 py-4 mb-4">
              <div>
                <p className="text-xs text-secondary-text uppercase tracking-wider mb-1">Original Size</p>
                <p className="font-semibold">{(originalSize / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <div>
                <p className="text-xs text-secondary-text uppercase tracking-wider mb-1">New Size</p>
                <p className={`font-semibold ${isActuallySmaller ? 'text-success' : 'text-yellow-600'}`}>
                  {(newSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              {isActuallySmaller && (
                <div>
                  <p className="text-xs text-secondary-text uppercase tracking-wider mb-1">Saved</p>
                  <p className="font-semibold text-success">{savings.toFixed(1)}%</p>
                </div>
              )}
            </div>

            {!isActuallySmaller && (
              <p className="text-sm text-yellow-600 bg-yellow-500/10 p-2 rounded inline-block">
                This PDF is already highly optimized. We could not reduce the size further.
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <a href={resultUrl} download={`compressed_${file?.name}`}>
                <Button size="lg" className="w-full sm:w-auto">
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
              </a>
              <Button variant="outline" size="lg" onClick={reset}>
                Process Another
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
