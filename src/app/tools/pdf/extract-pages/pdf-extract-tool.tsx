"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, File, X, Download, Loader2 } from "lucide-react";
import { extractPdfPages } from "@/lib/pdf-utils";

export function PDFExtractTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pagesString, setPagesString] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload a valid PDF document.");
        return;
      }
      setFile(selectedFile);
      setResultUrl(null);
      setError(null);
    }
  };

  const removeFile = () => {
    setFile(null);
    setResultUrl(null);
    setPagesString("");
  };

  const handleExtract = async () => {
    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }
    if (!pagesString.trim()) {
      setError("Please enter the pages you want to extract.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Allow minor UI yield
      await new Promise(r => setTimeout(r, 50));
      const extractedBytes = await extractPdfPages(file, pagesString);
      const blob = new Blob([new Uint8Array(extractedBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err: any) {
      setError(err.message || "Failed to extract pages. Check your page format string (e.g. 1, 3, 5-7).");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPagesString("");
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="text-center mb-6">
          <p className="text-sm text-secondary-text bg-muted/50 inline-block px-3 py-1 rounded-full border border-border">
            🔒 Processed locally in your browser. No files are uploaded to our servers.
          </p>
        </div>

        {!file ? (
          <div
            className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-secondary-text mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload a PDF</h3>
            <p className="text-sm text-secondary-text">Select a PDF to extract pages from.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/20">
              <div className="flex items-center gap-3 overflow-hidden">
                <File className="w-6 h-6 text-primary shrink-0" />
                <div className="overflow-hidden">
                   <p className="text-sm font-medium truncate">{file.name}</p>
                   <p className="text-xs text-secondary-text">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={removeFile} className="shrink-0 text-red-500 hover:bg-red-500/10">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {!resultUrl && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pages">Pages to Extract</Label>
                  <Input
                    id="pages"
                    placeholder="e.g. 1, 3, 5-7"
                    value={pagesString}
                    onChange={(e) => setPagesString(e.target.value)}
                  />
                  <p className="text-xs text-secondary-text">
                    Enter comma-separated page numbers or ranges (e.g. 1, 3, 5-7).
                  </p>
                </div>
                <Button className="w-full" size="lg" onClick={handleExtract} disabled={isProcessing || !pagesString.trim()}>
                  {isProcessing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Extracting...</>
                  ) : (
                    "Extract Pages"
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
          <div className="mt-6 p-6 border border-success/30 bg-success/5 rounded-xl text-center animate-in fade-in">
            <h3 className="text-xl font-bold text-success mb-2">Pages Extracted Successfully!</h3>
            <p className="text-sm text-secondary-text mb-6">Your new PDF document is ready.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={resultUrl} download={`extracted_${file?.name || 'document.pdf'}`} className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-success hover:bg-success/90 text-white">
                  <Download className="w-4 h-4 mr-2 shrink-0" /> Download Extracted PDF
                </Button>
              </a>
              <Button variant="outline" size="lg" onClick={reset} className="w-full sm:w-auto">
                Extract More Pages
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
