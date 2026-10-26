"use client";

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { FileUp, Download, RotateCcw, RotateCw, FlipHorizontal, FlipVertical, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SafeImage } from "@/components/safe-image";

export default function RotateFlipImage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(1);
  const [flipV, setFlipV] = useState(1);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setImageUrl(url);
    setRotation(0);
    setFlipH(1);
    setFlipV(1);
  };

  const handleRotateLeft = () => setRotation(r => (r - 90) % 360);
  const handleRotateRight = () => setRotation(r => (r + 90) % 360);
  const handleFlipHorizontal = () => setFlipH(f => f * -1);
  const handleFlipVertical = () => setFlipV(f => f * -1);

  const handleDownload = () => {
    if (!imageRef.current || !file) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imageRef.current;

    // Determine new dimensions based on rotation
    if (Math.abs(rotation) % 180 === 90) {
       canvas.width = img.naturalHeight;
       canvas.height = img.naturalWidth;
    } else {
       canvas.width = img.naturalWidth;
       canvas.height = img.naturalHeight;
    }

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH, flipV);

    ctx.drawImage(
       img,
       -img.naturalWidth / 2,
       -img.naturalHeight / 2,
       img.naturalWidth,
       img.naturalHeight
    );

    canvas.toBlob((blob) => {
       if (!blob) return;
       const url = URL.createObjectURL(blob);
       const a = document.createElement("a");
       a.href = url;
       a.download = `rotated_${file.name}`;
       document.body.appendChild(a);
       a.click();
       document.body.removeChild(a);
       URL.revokeObjectURL(url);
    }, file.type);
  };

  const handleReset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setFile(null);
    setImageUrl(null);
    setRotation(0);
    setFlipH(1);
    setFlipV(1);
  };

  return (
    <ToolLayout
      title="Rotate & Flip Image"
      description="Rotate images left or right, and flip them horizontally or vertically. Processing is fully secure in your browser."
      category="Images"
    >
      <div className="space-y-8">

        {!file && (
          <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:bg-muted/50 transition-colors">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
              <FileUp className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Select an image</h3>
              <p className="text-sm text-secondary-text mb-4">or drag and drop here</p>
              <Button variant="secondary" className="pointer-events-none">Browse Files</Button>
            </label>
          </div>
        )}

        {file && imageUrl && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2">
                <Card className="shadow-sm overflow-hidden border border-border">
                   <CardContent className="p-0 bg-muted/30 relative flex items-center justify-center min-h-[400px]">
                      <div className="absolute top-4 right-4 z-10 flex gap-2">
                         <Button variant="destructive" size="sm" onClick={handleReset}>
                            <Trash2 className="w-4 h-4 mr-2" /> Clear
                         </Button>
                      </div>
                      <div className="p-8 w-full flex justify-center items-center overflow-hidden">
                         <div style={{ transform: `rotate(${rotation}deg) scale(${flipH}, ${flipV})`, transition: 'transform 0.3s ease' }}>
                            <img
                              ref={imageRef}
                              src={imageUrl}
                              alt="Preview"
                              className="max-h-[600px] object-contain shadow-md rounded"
                            />
                         </div>
                      </div>
                   </CardContent>
                </Card>
             </div>

             <div className="lg:col-span-1 space-y-6">
                <Card className="shadow-sm">
                   <CardContent className="p-6 space-y-6">
                      <div className="space-y-4">
                         <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-text">Rotate</h3>
                         <div className="flex gap-4">
                            <Button variant="outline" className="flex-1" onClick={handleRotateLeft}>
                               <RotateCcw className="w-4 h-4 mr-2" /> Left
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={handleRotateRight}>
                               <RotateCw className="w-4 h-4 mr-2" /> Right
                            </Button>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary-text">Flip</h3>
                         <div className="flex gap-4">
                            <Button variant="outline" className="flex-1" onClick={handleFlipHorizontal}>
                               <FlipHorizontal className="w-4 h-4 mr-2" /> Horizontal
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={handleFlipVertical}>
                               <FlipVertical className="w-4 h-4 mr-2" /> Vertical
                            </Button>
                         </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                         <Button className="w-full" size="lg" onClick={handleDownload}>
                            <Download className="w-4 h-4 mr-2" /> Download Image
                         </Button>
                      </div>
                   </CardContent>
                </Card>
             </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
