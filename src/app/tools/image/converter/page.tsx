"use client";

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UploadCloud, Download, Image as ImageIcon, ArrowRight, Loader2 } from "lucide-react";

type Format = "image/jpeg" | "image/png" | "image/webp";
const formatLabels: Record<Format, string> = {
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WebP"
};

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<Format>("image/png");
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError("Unsupported file format. Please upload an image.");
        return;
      }
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
      setConvertedBlob(null);
      setError(null);

      // Auto-suggest format change
      if (selectedFile.type === 'image/jpeg') setTargetFormat('image/png');
      else if (selectedFile.type === 'image/png') setTargetFormat('image/jpeg');
      else if (selectedFile.type === 'image/webp') setTargetFormat('image/jpeg');
    }
  };

  const convertImage = () => {
    if (!file || !preview) return;
    setIsProcessing(true);
    setError(null);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        // If converting TO JPEG from PNG/WebP (which might have transparency),
        // fill background with white first to avoid black background artifacts.
        if (targetFormat === 'image/jpeg' && (file.type === 'image/png' || file.type === 'image/webp')) {
           ctx.fillStyle = '#FFFFFF';
           ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            setConvertedBlob(blob);
          } else {
            setError("Failed to convert image format.");
          }
          setIsProcessing(false);
        }, targetFormat, 0.92);
      } else {
        setError("Failed to process image context.");
        setIsProcessing(false);
      }
    };
    img.onerror = () => {
       setError("Failed to load original image data.");
       setIsProcessing(false);
    }
    img.src = preview;
  };

  const download = () => {
    if (!convertedBlob || !file) return;
    const url = URL.createObjectURL(convertedBlob);
    const a = document.createElement("a");
    a.href = url;
    const ext = formatLabels[targetFormat].toLowerCase();
    a.download = `converted-${file.name.replace(/\.[^/.]+$/, "")}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setConvertedBlob(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <ToolLayout
      title="Image Converter"
      description="Convert images between JPG, PNG, and WebP formats securely in your browser."
      category="Images"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {!preview ? (
            <div
              className="border-2 border-dashed border-border rounded-xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="w-12 h-12 text-secondary-text mb-4" />
              <h3 className="font-heading font-medium text-lg mb-1">Upload Image</h3>
              <p className="text-sm text-secondary-text mb-4">Support for JPG, PNG, WebP</p>
              <Button type="button" variant="outline">Choose File</Button>
            </div>
          ) : (
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <ImageIcon className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-medium truncate">{file?.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={reset} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    Remove
                  </Button>
                </div>
                <div className="bg-muted rounded-lg aspect-video relative flex items-center justify-center overflow-hidden border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="mt-2 text-center text-sm font-medium text-secondary-text flex items-center justify-center gap-2">
                  <span>{formatSize(file?.size || 0)}</span>
                  <span className="px-2 py-0.5 bg-muted border border-border rounded uppercase text-xs">{file?.type.split('/')[1] || 'UNKNOWN'}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg, image/png, image/webp"
            className="hidden"
          />
        </div>

        <div className="space-y-6">
          <Card className={!preview ? "opacity-50 pointer-events-none" : ""}>
            <CardContent className="p-6 space-y-6">
              <h3 className="font-heading font-semibold text-lg">Conversion Options</h3>

              <div className="space-y-4">
                <Label>Convert to format</Label>
                <div className="flex flex-wrap gap-3">
                  {(["image/jpeg", "image/png", "image/webp"] as Format[]).map((format) => (
                    <label key={format} className={`
                      flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-all
                      ${targetFormat === format ? "border-primary bg-primary/5 text-primary" : "border-border hover:bg-muted"}
                    `}>
                      <input
                        type="radio"
                        name="format"
                        value={format}
                        checked={targetFormat === format}
                        onChange={() => { setTargetFormat(format); setConvertedBlob(null); }}
                        className="hidden"
                      />
                      <span className="font-medium text-sm">{formatLabels[format]}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 text-red-600 border border-red-500/20 rounded-md text-sm">
                  {error}
                </div>
              )}

              {!convertedBlob ? (
                <Button onClick={convertImage} className="w-full" size="lg" disabled={!preview || isProcessing || file?.type === targetFormat}>
                  {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Converting...</> : (file?.type === targetFormat ? "File is already in this format" : "Convert Image")}
                </Button>
              ) : (
                <div className="space-y-4 pt-4 border-t border-border animate-in fade-in duration-200">
                  <div className="flex justify-center items-center gap-4 text-sm font-medium text-secondary-text mb-4">
                    <span className="uppercase">{file?.type.split('/')[1] || 'UNKNOWN'}</span>
                    <ArrowRight className="w-4 h-4 text-primary" />
                    <span className="uppercase text-primary">{formatLabels[targetFormat]}</span>
                  </div>
                  <div className="flex justify-between items-center bg-muted/50 p-3 rounded-md border border-border">
                    <span className="text-sm font-medium text-secondary-text">Output Size</span>
                    <span className="text-base font-bold text-foreground">{formatSize(convertedBlob.size)}</span>
                  </div>
                  <Button onClick={download} className="w-full" size="lg">
                    <Download className="w-4 h-4 mr-2" /> Download {formatLabels[targetFormat]}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          <p className="text-xs text-center text-secondary-text">
            Your image is processed locally in your browser.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
