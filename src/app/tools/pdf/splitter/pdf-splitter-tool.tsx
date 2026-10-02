"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, File, X, Download, Loader2, Scissors } from "lucide-react";
import { extractPdfPages, splitPdf } from "@/lib/pdf-utils";

export function PDFSplitterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultUrls, setResultUrls] = useState<{url: string, name: string}[]>([]);
  const [splitMode, setSplitMode] = useState<'extract' | 'all'>('extract');
  const [pageRanges, setPageRanges] = useState("1, 3-5");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      if (selected.type !== "application/pdf") {
        setError("Please select a valid PDF document.");
        return;
      }
      setFile(selected);
      setError(null);
      setResultUrls([]);
    }
  };

  const handleProcess = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setResultUrls([]);

    try {
      if (splitMode === 'extract') {
        const mergedPdfBytes = await extractPdfPages(file, pageRanges);
        const blob = new Blob([new Uint8Array(mergedPdfBytes)], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        setResultUrls([{ url, name: `extracted_${file.name}` }]);
      } else {
        const splitBytesArr = await splitPdf(file);
        const urls = splitBytesArr.map((bytes, idx) => {
          const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
          return {
            url: URL.createObjectURL(blob),
            name: `page_${idx + 1}_${file.name}`
          };
        });
        setResultUrls(urls);
      }
    } catch (err: any) {
      setError(err.message || "We couldn't process this PDF. Check if your page ranges are correct.");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    resultUrls.forEach(r => URL.revokeObjectURL(r.url));
    setResultUrls([]);
    setError(null);
  };

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
            <p className="text-sm text-secondary-text">Select a PDF to extract pages from.</p>
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

            {!resultUrls.length && (
              <div className="space-y-4 bg-muted/30 p-4 rounded-lg border border-border">
                <div className="flex gap-4 mb-4">
                  <Button
                    variant={splitMode === 'extract' ? 'default' : 'outline'}
                    onClick={() => setSplitMode('extract')}
                    className="w-full"
                  >
                    Extract Specific Pages
                  </Button>
                  <Button
                    variant={splitMode === 'all' ? 'default' : 'outline'}
                    onClick={() => setSplitMode('all')}
                    className="w-full"
                  >
                    Split All Pages
                  </Button>
                </div>

                {splitMode === 'extract' && (
                  <div className="space-y-2">
                    <Label htmlFor="pages">Pages to extract</Label>
                    <Input
                      id="pages"
                      value={pageRanges}
                      onChange={(e) => setPageRanges(e.target.value)}
                      placeholder="e.g., 1, 3-5, 8"
                    />
                    <p className="text-xs text-secondary-text">
                      Enter page numbers and/or page ranges separated by commas.
                    </p>
                  </div>
                )}

                <Button className="w-full mt-4" size="lg" onClick={handleProcess} disabled={isProcessing}>
                  {isProcessing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
                  ) : (
                    <><Scissors className="w-4 h-4 mr-2" /> Split PDF</>
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

        {resultUrls.length > 0 && (
          <div className="mt-6 p-6 border border-success/30 bg-success/5 rounded-xl text-center space-y-4">
            <h3 className="text-xl font-bold text-success mb-2">PDF Split Successfully!</h3>

            {resultUrls.length === 1 ? (
              <a href={resultUrls[0].url} download={resultUrls[0].name}>
                <Button size="lg" className="bg-success hover:bg-success/90 text-white w-full sm:w-auto">
                  <Download className="w-4 h-4 mr-2" /> Download Extracted PDF
                </Button>
              </a>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto p-2 bg-background rounded border border-border text-left">
                <p className="text-sm font-medium mb-2">Download Individual Pages:</p>
                {resultUrls.map((r, i) => (
                  <div key={i} className="flex justify-between items-center p-2 hover:bg-muted rounded">
                    <span className="text-sm truncate mr-4">{r.name}</span>
                    <a href={r.url} download={r.name}>
                      <Button size="sm" variant="outline"><Download className="w-3 h-3 mr-1"/> Save</Button>
                    </a>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4">
              <Button variant="outline" onClick={reset}>
                Process Another File
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
