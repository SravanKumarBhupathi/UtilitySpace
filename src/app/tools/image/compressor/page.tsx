"use client";

import { useState, useRef } from "react";
import { ToolLayout } from "../../layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, Download, ImageMinus } from "lucide-react";

export default function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(0.7);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);

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
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
      setCompressedBlob(null);
    }
  };

  const compressImage = () => {
    if (!file || !preview) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        let targetType = file.type;
        if (targetType === 'image/png') {
           targetType = 'image/jpeg';
        }

        canvas.toBlob((blob) => {
          if (blob) {
            setCompressedBlob(blob);
          }
        }, targetType, quality);
      }
    };
    img.src = preview;
  };

  const download = () => {
    if (!compressedBlob || !file) return;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compressed-${file.name.replace(/\.[^/.]+$/, "")}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setCompressedBlob(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const savings = file && compressedBlob ? ((file.size - compressedBlob.size) / file.size) * 100 : 0;

  return (
    <ToolLayout
      title="Image Compressor"
      description="Reduce image file size without losing quality in your browser."
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
              <p className="text-sm text-secondary-text mb-4">Support for JPG, PNG</p>
              <Button type="button" variant="outline">Choose File</Button>
            </div>
          ) : (
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <ImageMinus className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-medium truncate">{file?.name}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={reset} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    Remove
                  </Button>
                </div>
                <div className="bg-muted rounded-lg aspect-video relative flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
                </div>
                <div className="mt-2 text-center text-sm font-medium text-secondary-text">
                  Original: {formatSize(file?.size || 0)}
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
              <h3 className="font-heading font-semibold text-lg">Compression Level</h3>

              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center text-sm font-medium text-secondary-text">
                  <span>Low (Larger file)</span>
                  <span>High (Smaller file)</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={1.1 - quality}
                  onChange={(e) => {
                     setQuality(1.1 - parseFloat(e.target.value));
                     setCompressedBlob(null);
                  }}
                  className="w-full accent-primary"
                />
              </div>

              {!compressedBlob ? (
                <Button onClick={compressImage} className="w-full" size="lg" disabled={!preview}>
                  Compress Image
                </Button>
              ) : (
                <div className="space-y-4 pt-4 border-t border-border animate-in fade-in duration-200">
                  <div className="flex justify-between items-center bg-muted/50 p-3 rounded-md border border-border">
                    <span className="text-sm font-medium text-secondary-text">Compressed Size</span>
                    <span className="text-base font-bold text-foreground">{formatSize(compressedBlob.size)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-success/10 p-3 rounded-md border border-success/20">
                    <span className="text-sm font-medium text-success">Saved</span>
                    <span className="text-base font-bold text-success">{savings.toFixed(0)}%</span>
                  </div>
                  <Button onClick={download} className="w-full" size="lg">
                    <Download className="w-4 h-4 mr-2" /> Download
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          <p className="text-xs text-center text-secondary-text">
            Your file is processed securely in your browser.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
