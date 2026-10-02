"use client";

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, Download, Image as ImageIcon, Loader2 } from "lucide-react";

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [maintainRatio, setMaintainRatio] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setResizedBlob(null);
      setError(null);

      const img = new Image();
      img.onload = () => {
        setWidth(img.width.toString());
        setHeight(img.height.toString());
        setAspectRatio(img.width / img.height);
      };
      img.onerror = () => {
        setError("Failed to read image dimensions.");
      }
      img.src = url;
    }
  };

  const handleWidthChange = (val: string) => {
    setWidth(val);
    if (maintainRatio && aspectRatio) {
      const w = parseInt(val);
      if (!isNaN(w) && w > 0) {
        setHeight(Math.round(w / aspectRatio).toString());
      } else {
        setHeight("");
      }
    }
  };

  const handleHeightChange = (val: string) => {
    setHeight(val);
    if (maintainRatio && aspectRatio) {
      const h = parseInt(val);
      if (!isNaN(h) && h > 0) {
        setWidth(Math.round(h * aspectRatio).toString());
      } else {
        setWidth("");
      }
    }
  };

  const handleResize = () => {
    if (!file || !preview) return;

    const w = parseInt(width);
    const h = parseInt(height);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      setError("Please enter valid positive dimensions.");
      return;
    }

    // Prevent ridiculous sizes that crash browser
    if (w > 10000 || h > 10000) {
       setError("Dimensions too large. Please keep width and height below 10,000px.");
       return;
    }

    setIsProcessing(true);
    setError(null);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Draw image stretched to exact dimensions
        ctx.drawImage(img, 0, 0, w, h);

        canvas.toBlob((blob) => {
          if (blob) {
            setResizedBlob(blob);
          } else {
            setError("Failed to create resized image.");
          }
          setIsProcessing(false);
        }, file.type);
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
    if (!resizedBlob || !file) return;
    const url = URL.createObjectURL(resizedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resized-${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setResizedBlob(null);
    setWidth("");
    setHeight("");
    setAspectRatio(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <ToolLayout
      title="Image Resizer"
      description="Resize images to exact pixel dimensions locally in your browser."
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
              <p className="text-sm text-secondary-text mb-4">Drag and drop or click to browse</p>
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
              </CardContent>
            </Card>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="space-y-6">
          <Card className={!preview ? "opacity-50 pointer-events-none" : ""}>
            <CardContent className="p-6 space-y-6">
              <h3 className="font-heading font-semibold text-lg">Resize Options</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={width}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    placeholder="e.g. 1920"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    placeholder="e.g. 1080"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ratio"
                  checked={maintainRatio}
                  onChange={(e) => setMaintainRatio(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary accent-primary h-4 w-4"
                />
                <Label htmlFor="ratio" className="cursor-pointer">Maintain aspect ratio</Label>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 text-red-600 border border-red-500/20 rounded-md text-sm">
                  {error}
                </div>
              )}

              {!resizedBlob ? (
                <Button onClick={handleResize} className="w-full" size="lg" disabled={!preview || isProcessing}>
                  {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : 'Resize Image'}
                </Button>
              ) : (
                <div className="space-y-4 pt-4 border-t border-border animate-in fade-in duration-200">
                  <div className="flex justify-between items-center bg-success/10 p-3 rounded-md border border-success/20">
                     <span className="text-sm font-medium text-success">New Dimensions</span>
                     <span className="text-base font-bold text-success">{width} × {height}</span>
                  </div>
                  <Button onClick={download} className="w-full" size="lg">
                    <Download className="w-4 h-4 mr-2" /> Download Resized Image
                  </Button>
                  <Button variant="outline" onClick={() => setResizedBlob(null)} className="w-full">
                    Adjust Dimensions
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
