"use client";

import { useState, useRef } from "react";
import { ToolLayout } from "../../layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UploadCloud, Download, Image as ImageIcon } from "lucide-react";

export default function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [maintainRatio, setMaintainRatio] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);

      const img = new Image();
      img.onload = () => {
        setWidth(img.width.toString());
        setHeight(img.height.toString());
        setAspectRatio(img.width / img.height);
      };
      img.src = url;
    }
  };

  const handleWidthChange = (val: string) => {
    setWidth(val);
    if (maintainRatio && aspectRatio) {
      const w = parseInt(val);
      if (!isNaN(w)) {
        setHeight(Math.round(w / aspectRatio).toString());
      }
    }
  };

  const handleHeightChange = (val: string) => {
    setHeight(val);
    if (maintainRatio && aspectRatio) {
      const h = parseInt(val);
      if (!isNaN(h)) {
        setWidth(Math.round(h * aspectRatio).toString());
      }
    }
  };

  const handleResize = () => {
    if (!file || !preview) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const w = parseInt(width) || img.width;
      const h = parseInt(height) || img.height;

      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `resized-${file.name}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        }, file.type);
      }
    };
    img.src = preview;
  };

  const reset = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setWidth("");
    setHeight("");
    setAspectRatio(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <ToolLayout
      title="Image Resizer"
      description="Resize images to exact pixel dimensions in your browser."
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
                <div className="bg-muted rounded-lg aspect-video relative flex items-center justify-center overflow-hidden">
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="ratio"
                  checked={maintainRatio}
                  onChange={(e) => setMaintainRatio(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary accent-primary"
                />
                <Label htmlFor="ratio" className="cursor-pointer">Maintain aspect ratio</Label>
              </div>

              <Button onClick={handleResize} className="w-full" size="lg" disabled={!preview}>
                <Download className="w-4 h-4 mr-2" /> Download Resized Image
              </Button>
            </CardContent>
          </Card>
          <p className="text-xs text-center text-secondary-text">
            Your file is processed in your browser.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
