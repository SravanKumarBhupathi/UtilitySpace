"use client";

import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { FileUp, Download, PlusSquare, Trash2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AddPdfPageNumbers() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [position, setPosition] = useState("bottom-center");

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
    if (!pdfDoc || !file) return;
    setProcessing(true);
    setError(null);

    try {
       const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
       const pages = pdfDoc.getPages();

       pages.forEach((page, idx) => {
          const { width, height } = page.getSize();
          const text = `${idx + 1}`;
          const fontSize = 12;
          const textWidth = font.widthOfTextAtSize(text, fontSize);

          let x = width / 2 - textWidth / 2;
          let y = 30;

          if (position === "bottom-left") {
             x = 30;
          } else if (position === "bottom-right") {
             x = width - 30 - textWidth;
          } else if (position === "top-center") {
             y = height - 40;
          } else if (position === "top-left") {
             x = 30;
             y = height - 40;
          } else if (position === "top-right") {
             x = width - 30 - textWidth;
             y = height - 40;
          }

          page.drawText(text, {
             x,
             y,
             size: fontSize,
             font,
             color: rgb(0, 0, 0),
          });
       });

       const pdfBytes = await pdfDoc.save();
       const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
       const url = URL.createObjectURL(blob);
       setOutputUrl(url);
    } catch (err: any) {
       setError("Failed to add page numbers to PDF.");
    } finally {
       setProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPdfDoc(null);
    setPageCount(0);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl(null);
    setError(null);
  };

  return (
    <ToolLayout
      title="Add Page Numbers to PDF"
      description="Easily insert page numbers into your PDF documents. Processing happens securely in your browser."
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
                  <label className="text-sm font-semibold">Position</label>
                  <select
                     className="flex h-10 w-full md:w-64 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                     value={position}
                     onChange={(e) => setPosition(e.target.value)}
                  >
                     <option value="bottom-left">Bottom Left</option>
                     <option value="bottom-center">Bottom Center</option>
                     <option value="bottom-right">Bottom Right</option>
                     <option value="top-left">Top Left</option>
                     <option value="top-center">Top Center</option>
                     <option value="top-right">Top Right</option>
                  </select>
                </div>

                <Button onClick={handleProcess} disabled={processing} className="w-full sm:w-auto">
                  {processing ? "Processing..." : (
                     <>
                        <PlusSquare className="w-4 h-4 mr-2" /> Add Page Numbers
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
                  <PlusSquare className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">Page Numbers Added</h3>
                <p className="text-secondary-text">Your document has been processed and is ready to download.</p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Button asChild size="lg">
                    <a href={outputUrl} download={`numbered_${file?.name}`}>
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
