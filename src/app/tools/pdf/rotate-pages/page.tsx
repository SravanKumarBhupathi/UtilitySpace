"use client";

import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { FileUp, Download, RotateCw, Trash2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function RotatePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(90);
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
    if (!pdfDoc || !file) return;
    setProcessing(true);
    setError(null);

    try {
       const pages = pdfDoc.getPages();
       pages.forEach(page => {
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees(currentRotation + rotationAngle));
       });

       const pdfBytes = await pdfDoc.save();
       const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
       const url = URL.createObjectURL(blob);
       setOutputUrl(url);
    } catch (err: any) {
       setError("Failed to rotate PDF pages.");
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
      title="Rotate PDF Pages"
      description="Rotate all pages in a PDF document by 90, 180, or 270 degrees. Processing happens securely in your browser."
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
                  <Label>Rotation Angle</Label>
                  <div className="flex flex-wrap gap-4">
                    <Button variant={rotationAngle === 90 ? "default" : "outline"} onClick={() => setRotationAngle(90)}>
                      90° Right
                    </Button>
                    <Button variant={rotationAngle === 180 ? "default" : "outline"} onClick={() => setRotationAngle(180)}>
                      180°
                    </Button>
                    <Button variant={rotationAngle === 270 ? "default" : "outline"} onClick={() => setRotationAngle(270)}>
                      90° Left
                    </Button>
                  </div>
                </div>

                <Button onClick={handleProcess} disabled={processing} className="w-full sm:w-auto">
                  {processing ? "Processing..." : (
                     <>
                        <RotateCw className="w-4 h-4 mr-2" /> Rotate All Pages
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
                  <RotateCw className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">PDF Rotated Successfully</h3>
                <p className="text-secondary-text">Your document has been processed and is ready to download.</p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Button asChild size="lg">
                    <a href={outputUrl} download={`rotated_${file?.name}`}>
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
