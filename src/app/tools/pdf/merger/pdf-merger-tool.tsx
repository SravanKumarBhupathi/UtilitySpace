"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File, X, ArrowDown, ArrowUp, Download, Loader2 } from "lucide-react";
import { mergePdfs } from "@/lib/pdf-utils";

export function PDFMergerTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter(f => f.type === "application/pdf");
      if (newFiles.length !== e.target.files.length) {
        setError("Some files were skipped because they are not valid PDF documents.");
      } else {
        setError(null);
      }
      setFiles(prev => [...prev, ...newFiles]);
      setResultUrl(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setResultUrl(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
    setFiles(newFiles);
    setResultUrl(null);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    [newFiles[index + 1], newFiles[index]] = [newFiles[index], newFiles[index + 1]];
    setFiles(newFiles);
    setResultUrl(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please select at least 2 PDF files to merge.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const mergedPdfBytes = await mergePdfs(files);
      const blob = new Blob([new Uint8Array(mergedPdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err: any) {
      setError(err.message || "We couldn't process these PDFs. Please try other files.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFiles([]);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="text-center mb-6">
          <p className="text-sm text-secondary-text bg-muted/50 inline-block px-3 py-1 rounded-full border border-border">
            🔒 Your PDFs are processed locally in your browser.
          </p>
        </div>

        {files.length === 0 ? (
          <div
            className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-secondary-text mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload PDF Files</h3>
            <p className="text-sm text-secondary-text">Select multiple PDFs to merge them into one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-semibold text-foreground">Selected Files ({files.length})</h3>
               <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                 Add More
               </Button>
            </div>

            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={`${file.name}-${index}`} className="flex items-center justify-between p-3 border border-border rounded-lg bg-background">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <File className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{file.name}</span>
                    <span className="text-xs text-secondary-text flex-shrink-0">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => moveUp(index)} disabled={index === 0} className="h-8 w-8">
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => moveDown(index)} disabled={index === files.length - 1} className="h-8 w-8">
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeFile(index)} className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            {!resultUrl && (
              <Button className="w-full mt-6" size="lg" onClick={handleMerge} disabled={isProcessing || files.length < 2}>
                {isProcessing ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Merging...</>
                ) : (
                  "Merge PDFs"
                )}
              </Button>
            )}
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="application/pdf"
          onChange={handleFileChange}
        />

        {error && (
          <div className="mt-4 p-4 text-sm text-red-600 bg-red-500/10 border border-red-500/20 rounded-md">
            {error}
          </div>
        )}

        {resultUrl && (
          <div className="mt-6 p-6 border border-success/30 bg-success/5 rounded-xl text-center">
            <h3 className="text-xl font-bold text-success mb-2">PDF Merged Successfully!</h3>
            <p className="text-sm text-secondary-text mb-6">Your combined document is ready.</p>
            <div className="flex gap-4 justify-center">
              <a href={resultUrl} download="merged_document.pdf">
                <Button size="lg" className="bg-success hover:bg-success/90 text-white">
                  <Download className="w-4 h-4 mr-2" /> Download Merged PDF
                </Button>
              </a>
              <Button variant="outline" size="lg" onClick={reset}>
                Merge More Files
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
