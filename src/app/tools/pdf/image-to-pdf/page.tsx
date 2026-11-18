"use client";

import React, { useState, useRef } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  FileImage,
  X,
  ArrowUp,
  ArrowDown,
  Download,
  Loader2,
  Trash2,
  Settings2,
  CheckCircle2,
} from "lucide-react";

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
}

export default function ImageToPdfPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<"fit" | "a4" | "letter">("a4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape" | "auto">("portrait");
  const [margin, setMargin] = useState<"none" | "small" | "normal">("small");
  const [pdfFileName, setPdfFileName] = useState<string>("converted-images.pdf");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    setErrorMessage(null);
    setDownloadUrl(null);

    const validFiles = Array.from(selectedFiles).filter((f) =>
      f.type.startsWith("image/")
    );

    if (validFiles.length === 0) {
      setErrorMessage("Please select valid image files (JPG, PNG, WebP, etc.).");
      return;
    }

    validFiles.forEach((file) => {
      const previewUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const item: ImageItem = {
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          file,
          previewUrl,
          width: img.width,
          height: img.height,
        };
        setImages((prev) => [...prev, item]);
      };
      img.onerror = () => {
        URL.revokeObjectURL(previewUrl);
      };
      img.src = previewUrl;
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
    setDownloadUrl(null);
  };

  const clearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setDownloadUrl(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      [copy[index - 1], copy[index]] = [copy[index], copy[index - 1]];
      return copy;
    });
    setDownloadUrl(null);
  };

  const moveDown = (index: number) => {
    if (index === images.length - 1) return;
    setImages((prev) => {
      const copy = [...prev];
      [copy[index + 1], copy[index]] = [copy[index], copy[index + 1]];
      return copy;
    });
    setDownloadUrl(null);
  };

  // Convert File / Image to Uint8Array JPEG bytes using HTML5 canvas
  const convertImageToJpegBytes = async (file: File): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          return reject(new Error("Failed to get canvas 2d context"));
        }
        // White background for transparent PNGs
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          async (blob) => {
            URL.revokeObjectURL(objectUrl);
            if (!blob) return reject(new Error("Failed to create image blob"));
            const arrayBuffer = await blob.arrayBuffer();
            resolve(new Uint8Array(arrayBuffer));
          },
          "image/jpeg",
          0.92
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Failed to load image into canvas"));
      };
      img.src = objectUrl;
    });
  };

  const generatePdf = async () => {
    if (images.length === 0) {
      setErrorMessage("Please add at least one image to create a PDF.");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setErrorMessage(null);
    setDownloadUrl(null);

    try {
      const pdfDoc = await PDFDocument.create();

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        setProgress(Math.round(((i + 1) / images.length) * 90));

        let embeddedImage;
        const fileType = item.file.type.toLowerCase();

        if (fileType === "image/jpeg" || fileType === "image/jpg") {
          const bytes = await item.file.arrayBuffer();
          embeddedImage = await pdfDoc.embedJpg(bytes);
        } else if (fileType === "image/png") {
          try {
            const bytes = await item.file.arrayBuffer();
            embeddedImage = await pdfDoc.embedPng(bytes);
          } catch {
            const jpegBytes = await convertImageToJpegBytes(item.file);
            embeddedImage = await pdfDoc.embedJpg(jpegBytes);
          }
        } else {
          // WebP, AVIF, SVG, BMP, etc.
          const jpegBytes = await convertImageToJpegBytes(item.file);
          embeddedImage = await pdfDoc.embedJpg(jpegBytes);
        }

        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;

        let pageWidth = imgWidth;
        let pageHeight = imgHeight;

        if (pageSize === "a4") {
          // A4 at 72 points per inch = 595.28 x 841.89
          if (orientation === "portrait" || (orientation === "auto" && imgHeight >= imgWidth)) {
            pageWidth = 595.28;
            pageHeight = 841.89;
          } else {
            pageWidth = 841.89;
            pageHeight = 595.28;
          }
        } else if (pageSize === "letter") {
          // US Letter at 72 points per inch = 612 x 792
          if (orientation === "portrait" || (orientation === "auto" && imgHeight >= imgWidth)) {
            pageWidth = 612;
            pageHeight = 792;
          } else {
            pageWidth = 792;
            pageHeight = 612;
          }
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        let marginPts = 0;
        if (pageSize !== "fit") {
          if (margin === "small") marginPts = 20;
          if (margin === "normal") marginPts = 40;
        }

        const availableWidth = pageWidth - marginPts * 2;
        const availableHeight = pageHeight - marginPts * 2;

        if (pageSize === "fit") {
          page.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: imgWidth,
            height: imgHeight,
          });
        } else {
          // Fit proportionally into available space
          const scale = Math.min(
            availableWidth / imgWidth,
            availableHeight / imgHeight
          );
          const drawWidth = imgWidth * scale;
          const drawHeight = imgHeight * scale;
          const x = marginPts + (availableWidth - drawWidth) / 2;
          const y = marginPts + (availableHeight - drawHeight) / 2;

          page.drawImage(embeddedImage, {
            x,
            y,
            width: drawWidth,
            height: drawHeight,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setProgress(100);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err.message || "An error occurred while compiling your PDF. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const howToSteps = [
    "Upload or drag-and-drop one or more JPG, PNG, or WebP images into the drop area.",
    "Reorder your images using the Up and Down buttons to set the exact page sequence.",
    "Choose your page size (A4, US Letter, or Original Image Fit), orientation, and margins.",
    "Click 'Generate PDF' and download your merged document in seconds with zero server uploads.",
  ];

  const faqs = [
    {
      question: "Are my images uploaded to any remote server?",
      answer: "No. All conversion and document synthesis are performed locally inside your browser via WebAssembly and the pdf-lib library. Your personal photos, IDs, receipts, and sensitive documents never leave your computer or phone.",
    },
    {
      question: "Can I combine images of different sizes and orientations?",
      answer: "Yes! You can choose 'Auto' orientation, which automatically rotates individual pages to portrait or landscape based on each image's dimensions, ensuring optimal presentation without cropping.",
    },
    {
      question: "Does this tool work for transparent PNGs?",
      answer: "Yes. Transparent PNGs are automatically provided with a clean white background during compilation to ensure perfect rendering without dark black background artifacts.",
    },
    {
      question: "Is there a limit on how many images I can convert?",
      answer: "There are no artificial limits. You can combine dozens of images into a single document as long as your device has sufficient RAM to process the files.",
    },
  ];

  return (
    <ToolLayout
      title="Image to PDF Converter"
      description="Convert JPG, PNG, and WebP images into multi-page PDF documents locally in your browser."
      category="PDF"
      howToSteps={howToSteps}
      faqs={faqs}
      aboutText="UtilitySpace Image to PDF Converter is a secure, browser-native tool that transforms image collections into professional PDF documents. Whether preparing documents for job applications, archiving receipts, or binding scanned book pages, our tool guarantees total privacy, zero watermarks, and granular control over page sizing and margins."
    >
      <div className="space-y-6">
        {/* Upload Drop Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          className="border-2 border-dashed border-border hover:border-primary/60 transition-colors rounded-2xl p-8 text-center cursor-pointer bg-card/50 flex flex-col items-center justify-center min-h-[180px]"
        >
          <div className="p-3 bg-primary/10 text-primary rounded-full mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="font-semibold text-foreground text-sm">
            Click to upload or drag & drop images
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supports JPG, JPEG, PNG, WebP, and BMP (Up to 50MB per file)
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-600 dark:text-red-400">
            {errorMessage}
          </div>
        )}

        {/* Selected Images Queue */}
        {images.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <FileImage className="w-4 h-4 text-primary" /> {images.length} Image
                {images.length === 1 ? "" : "s"} Selected
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-xs text-destructive hover:text-destructive h-8 px-2 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </Button>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((item, idx) => (
                <div
                  key={item.id}
                  className="relative group border border-border bg-background rounded-lg p-2.5 flex items-center gap-3 shadow-xs"
                >
                  <div className="w-14 h-14 rounded bg-muted overflow-hidden shrink-0 flex items-center justify-center border border-border">
                    <img
                      src={item.previewUrl}
                      alt={item.file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground truncate">
                      {idx + 1}. {item.file.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {item.width} × {item.height} px • {(item.file.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      title="Move Up"
                      className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveDown(idx)}
                      disabled={idx === images.length - 1}
                      title="Move Down"
                      className="p-1 rounded hover:bg-muted text-muted-foreground disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeImage(item.id)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-80 hover:opacity-100 shadow-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Options & Configuration */}
        {images.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-primary" /> PDF Page Layout Options
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="pageSize" className="text-xs">Page Format</Label>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as any)}
                  className="w-full h-9 mt-1 px-2.5 rounded-md border border-input bg-background text-xs"
                >
                  <option value="a4">A4 Standard (210 × 297 mm)</option>
                  <option value="letter">US Letter (8.5 × 11 in)</option>
                  <option value="fit">Fit to Image Size</option>
                </select>
              </div>

              <div>
                <Label htmlFor="orientation" className="text-xs">Orientation</Label>
                <select
                  id="orientation"
                  disabled={pageSize === "fit"}
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as any)}
                  className="w-full h-9 mt-1 px-2.5 rounded-md border border-input bg-background text-xs disabled:opacity-50"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                  <option value="auto">Auto (Match Image Aspect)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="margin" className="text-xs">Page Margins</Label>
                <select
                  id="margin"
                  disabled={pageSize === "fit"}
                  value={margin}
                  onChange={(e) => setMargin(e.target.value as any)}
                  className="w-full h-9 mt-1 px-2.5 rounded-md border border-input bg-background text-xs disabled:opacity-50"
                >
                  <option value="none">No Margins (Full Bleed)</option>
                  <option value="small">Small Margins</option>
                  <option value="normal">Normal Margins</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <Label htmlFor="filename" className="text-xs">Output PDF Filename</Label>
              <Input
                id="filename"
                value={pdfFileName}
                onChange={(e) => setPdfFileName(e.target.value)}
                placeholder="converted-images.pdf"
                className="mt-1 h-9 text-xs"
              />
            </div>
          </div>
        )}

        {/* Action Button & Download */}
        {images.length > 0 && (
          <div className="flex flex-col items-center gap-3 pt-2">
            {!downloadUrl ? (
              <Button
                onClick={generatePdf}
                disabled={isProcessing}
                size="lg"
                className="w-full sm:w-auto min-w-[220px] flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Converting... {progress}%
                  </>
                ) : (
                  <>
                    <FileImage className="w-4 h-4" /> Convert to PDF
                  </>
                )}
              </Button>
            ) : (
              <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={downloadUrl}
                  download={pdfFileName.endsWith(".pdf") ? pdfFileName : `${pdfFileName}.pdf`}
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="lg"
                    className="w-full min-w-[220px] bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download PDF Now
                  </Button>
                </a>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setDownloadUrl(null)}
                  className="w-full sm:w-auto"
                >
                  Reconfigure
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
