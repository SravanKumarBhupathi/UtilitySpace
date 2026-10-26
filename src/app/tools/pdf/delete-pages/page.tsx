"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { FileUp, Download, Trash2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function DeletePdfPages() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pagesToDelete, setPagesToDelete] = useState("");
  const [processing, setProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Please select a valid PDF file.");
      return;
    }

    setFile(selectedFile);
    setError(null);
    setOutputUrl(null);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer);
      setPdfDoc(doc);
      setPageCount(doc.getPageCount());
    } catch (err: any) {
      setError("Could not read PDF. It might be encrypted or corrupted.");
      setFile(null);
      setPdfDoc(null);
    }
  };

  const handleProcess = async () => {
    if (!pdfDoc || !file || !pagesToDelete) {
       setError("Please enter the pages you want to delete.");
       return;
    }
    setProcessing(true);
    setError(null);

    try {
       // Parse input: e.g. "1, 3, 5-7"
       const parts = pagesToDelete.split(',').map(s => s.trim());
       const toDelete = new Set<number>();

       for (const part of parts) {
          if (part.includes('-')) {
             const [start, end] = part.split('-').map(Number);
             if (isNaN(start) || isNaN(end) || start < 1 || end > pageCount || start > end) {
                throw new Error(`Invalid range: ${part}`);
             }
             for (let i = start; i <= end; i++) {
                toDelete.add(i);
             }
          } else {
             const num = Number(part);
             if (isNaN(num) || num < 1 || num > pageCount) {
                throw new Error(`Invalid page number: ${part}`);
             }
             toDelete.add(num);
          }
       }

       if (toDelete.size === 0) {
          throw new Error("No valid pages selected for deletion.");
       }

       if (toDelete.size >= pageCount) {
          throw new Error("You cannot delete all pages from the PDF.");
       }

       // Delete pages from end to start to avoid index shifting issues
       const sortedToDelete = Array.from(toDelete).sort((a, b) => b - a);
       for (const pageNum of sortedToDelete) {
          // pdf-lib uses 0-based indexing
          pdfDoc.removePage(pageNum - 1);
       }

       const pdfBytes = await pdfDoc.save();
       const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
       const url = URL.createObjectURL(blob);
       setOutputUrl(url);
    } catch (err: any) {
       setError(err.message || "Failed to delete PDF pages.");
    } finally {
       setProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPdfDoc(null);
    setPageCount(0);
    setPagesToDelete("");
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl(null);
    setError(null);
  };

  return (
    <ToolLayout
      title="Delete PDF Pages"
      description="Remove specific pages from a PDF document securely in your browser."
      category="PDF"
    >
      <div className="space-y-8">

        {!file && (
          <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:bg-muted/50 transition-colors">
            <input
              type="file"
              id="pdf-upload"
              accept=".pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
              <FileUp className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select a PDF file</h3>
              <p className="text-sm text-secondary-text mb-4">or drag and drop here</p>
              <Button variant="secondary" className="pointer-events-none">Browse Files</Button>
            </label>
          </div>
        )}

        {error && (
          <div className="flex items-center text-sm font-medium text-red-500 bg-red-500/10 p-4 rounded-md border border-red-500/20">
             <AlertCircle className="w-5 h-5 mr-2" /> {error}
          </div>
        )}

        {file && !outputUrl && (
          <Card className="shadow-sm">
             <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center space-x-3 overflow-hidden">
                     <FileUp className="w-8 h-8 text-primary shrink-0" />
                     <div className="overflow-hidden">
                       <p className="font-semibold truncate">{file.name}</p>
                       <p className="text-sm text-secondary-text">{pageCount} pages • {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                     </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleReset} className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="pagesToDelete">Pages to Delete</Label>
                  <Input
                    id="pagesToDelete"
                    placeholder="e.g. 1, 3, 5-10"
                    value={pagesToDelete}
                    onChange={(e) => setPagesToDelete(e.target.value)}
                  />
                  <p className="text-xs text-secondary-text">Enter page numbers and/or ranges separated by commas. (Max page: {pageCount})</p>
                </div>

                <Button onClick={handleProcess} disabled={processing || !pagesToDelete} className="w-full sm:w-auto">
                  {processing ? "Processing..." : (
                     <>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Selected Pages
                     </>
                  )}
                </Button>
             </CardContent>
          </Card>
        )}

        {outputUrl && (
           <Card className="shadow-sm bg-green-500/5 border-green-500/20">
             <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">Pages Deleted Successfully</h3>
                <p className="text-secondary-text">Your document has been updated and is ready to download.</p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Button asChild size="lg">
                    <a href={outputUrl} download={`updated_${file?.name}`}>
                      <Download className="w-4 h-4 mr-2" /> Download PDF
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleReset}>
                    Process Another
                  </Button>
                </div>
             </CardContent>
           </Card>
        )}

      </div>
    </ToolLayout>
  );
}
