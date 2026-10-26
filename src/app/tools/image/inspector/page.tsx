"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { FileUp, Info, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SafeImage } from "@/components/safe-image";

export default function ImageInspector() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

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

    const img = new Image();
    img.onload = () => {
       setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = url;
  };

  const handleReset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setFile(null);
    setImageUrl(null);
    setDimensions(null);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  return (
    <ToolLayout
      title="Image Inspector"
      description="View detailed dimensions, file size, and metadata for any image. Fully secure in your browser."
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

        {file && imageUrl && dimensions && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <Card className="shadow-sm border border-border">
                <CardHeader className="py-4 border-b border-border bg-muted/20">
                   <CardTitle className="text-base text-secondary-text uppercase tracking-wider flex items-center justify-between">
                      <span>Image Details</span>
                      <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 text-xs text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4 mr-1" /> Clear
                      </Button>
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                   <ul className="space-y-4">
                     <li className="flex justify-between items-center border-b border-border pb-2">
                        <span className="text-sm text-secondary-text">Filename</span>
                        <span className="font-semibold text-sm truncate max-w-[200px]" title={file.name}>{file.name}</span>
                     </li>
                     <li className="flex justify-between items-center border-b border-border pb-2">
                        <span className="text-sm text-secondary-text">File Size</span>
                        <span className="font-semibold text-sm">{formatBytes(file.size)}</span>
                     </li>
                     <li className="flex justify-between items-center border-b border-border pb-2">
                        <span className="text-sm text-secondary-text">Dimensions</span>
                        <span className="font-semibold text-sm">{dimensions.width} × {dimensions.height} px</span>
                     </li>
                     <li className="flex justify-between items-center border-b border-border pb-2">
                        <span className="text-sm text-secondary-text">Aspect Ratio</span>
                        <span className="font-semibold text-sm">{(dimensions.width / dimensions.height).toFixed(2)}:1</span>
                     </li>
                     <li className="flex justify-between items-center border-b border-border pb-2">
                        <span className="text-sm text-secondary-text">MIME Type</span>
                        <span className="font-semibold text-sm bg-muted px-2 py-0.5 rounded font-mono">{file.type || 'Unknown'}</span>
                     </li>
                   </ul>

                   <div className="mt-6 flex items-start gap-3 text-sm text-secondary-text bg-muted/50 p-4 rounded-lg">
                      <Info className="w-5 h-5 shrink-0 text-primary mt-0.5" />
                      <p>All analysis is done locally in your browser. Your image is never uploaded to any server.</p>
                   </div>
                </CardContent>
             </Card>

             <Card className="shadow-sm border border-border overflow-hidden">
                <CardHeader className="py-4 border-b border-border bg-muted/20">
                   <CardTitle className="text-base text-secondary-text uppercase tracking-wider">Preview</CardTitle>
                </CardHeader>
                <CardContent className="p-0 bg-muted/10 relative flex items-center justify-center min-h-[300px]">
                   <div className="p-4 w-full flex justify-center items-center">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="max-h-[400px] object-contain shadow-md rounded"
                      />
                   </div>
                </CardContent>
             </Card>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}
