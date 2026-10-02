"use client";

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, Download, Image as ImageIcon, Crop as CropIcon, Loader2 } from "lucide-react";
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export default function ImageCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
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
      setCroppedBlob(null);
      setCrop(undefined);
      setCompletedCrop(null);
      setError(null);
    }
  };

  const processCrop = () => {
    if (!completedCrop || !completedCrop.width || !completedCrop.height || !imgRef.current || !preview) {
       setError("Please select an area to crop.");
       return;
    }

    setIsProcessing(true);
    setError(null);

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
       setError("Failed to initialize canvas context.");
       setIsProcessing(false);
       return;
    }

    try {
      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob((blob) => {
        if (blob) {
          setCroppedBlob(blob);
        } else {
          setError("Failed to create cropped image.");
        }
        setIsProcessing(false);
      }, file?.type || 'image/jpeg');
    } catch(err) {
      setError("An error occurred during cropping.");
      setIsProcessing(false);
    }
  };

  const download = () => {
    if (!croppedBlob || !file) return;
    const url = URL.createObjectURL(croppedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cropped-${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setCroppedBlob(null);
    setCrop(undefined);
    setCompletedCrop(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <ToolLayout
      title="Image Cropper"
      description="Crop images to exact proportions securely in your browser."
      category="Images"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-6">
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

                {!croppedBlob ? (
                  <div className="bg-muted rounded-lg flex items-center justify-center overflow-hidden max-h-[600px] border border-border">
                    <ReactCrop
                      crop={crop}
                      onChange={c => setCrop(c)}
                      onComplete={c => setCompletedCrop(c)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img ref={imgRef} src={preview} alt="Preview" className="max-h-[500px] w-auto object-contain" />
                    </ReactCrop>
                  </div>
                ) : (
                  <div className="bg-muted rounded-lg flex items-center justify-center overflow-hidden max-h-[600px] border border-border p-4">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src={URL.createObjectURL(croppedBlob)} alt="Cropped" className="max-h-[500px] w-auto object-contain shadow-sm border border-border" />
                  </div>
                )}

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

        <div className="md:col-span-4 space-y-6">
          <Card className={!preview ? "opacity-50 pointer-events-none" : ""}>
            <CardContent className="p-6 space-y-6">
              <h3 className="font-heading font-semibold text-lg flex items-center gap-2">
                 <CropIcon className="w-5 h-5"/> Crop Settings
              </h3>

              {error && (
                <div className="p-3 bg-red-500/10 text-red-600 border border-red-500/20 rounded-md text-sm">
                  {error}
                </div>
              )}

              {!croppedBlob ? (
                <>
                  <p className="text-sm text-secondary-text">
                    Drag on the image to select the crop area.
                  </p>
                  <Button onClick={processCrop} className="w-full" size="lg" disabled={!completedCrop?.width || !completedCrop?.height || isProcessing}>
                    {isProcessing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Cropping...</> : 'Crop Image'}
                  </Button>
                </>
              ) : (
                <div className="space-y-4 pt-4 border-t border-border animate-in fade-in duration-200">
                  <Button onClick={download} className="w-full" size="lg">
                    <Download className="w-4 h-4 mr-2" /> Download Cropped
                  </Button>
                  <Button variant="outline" onClick={() => setCroppedBlob(null)} className="w-full">
                    Adjust Crop
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
