/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getExamBySlug, EXAM_DATABASE, DocumentRequirement } from '@/lib/data/exams';
import { compressToTargetKB, overlayTextOnImage, enhanceSignature } from '@/lib/image-utils';
import { Upload, Download, CheckCircle2, AlertCircle, Settings, RefreshCw, ZoomIn, Contrast, Wand2, Type } from 'lucide-react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

function ExamStudioContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const examId = searchParams.get('exam');
  const docType = searchParams.get('type') as 'photo' | 'signature' | null;

  // State
  const [exam, setExam] = useState(examId ? EXAM_DATABASE.find(e => e.id === examId) : null);
  const [reqs, setReqs] = useState<DocumentRequirement | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit State
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Photo extras
  const [nameText, setNameText] = useState('');
  const [dateText, setDateText] = useState('');

  // Signature extras
  const [contrast, setContrast] = useState([1.5]);
  const [brightness, setBrightness] = useState([0]);
  const [applyEnhancement, setApplyEnhancement] = useState(docType === 'signature');

  // Final validation state
  const [finalSizeKB, setFinalSizeKB] = useState(0);
  const [finalWidth, setFinalWidth] = useState(0);
  const [finalHeight, setFinalHeight] = useState(0);

  useEffect(() => {
    if (exam && docType) {
      setReqs(exam.requirements[docType] || null);
    }
  }, [exam, docType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSourceFile(file);
      const url = URL.createObjectURL(file);
      setSourceUrl(url);
      setProcessedUrl(null);
      setError(null);

      // Auto crop based on aspect ratio
      if (reqs?.aspectRatio) {
         setCrop({
           unit: '%',
           width: 90,
           height: 90 / reqs.aspectRatio,
           x: 5,
           y: 5
         });
      }
    }
  };

  const processImage = async () => {
    if (!sourceUrl || !reqs) return;
    setProcessing(true);
    setError(null);

    try {
      // 1. Get cropped image if crop exists
      let canvasToProcess: HTMLCanvasElement;

      if (completedCrop && completedCrop.width > 0 && completedCrop.height > 0 && imgRef.current) {
        const image = imgRef.current;
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = completedCrop.width;
        canvas.height = completedCrop.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error("Could not get canvas context");

        ctx.drawImage(
          image,
          completedCrop.x * scaleX,
          completedCrop.y * scaleY,
          completedCrop.width * scaleX,
          completedCrop.height * scaleY,
          0,
          0,
          completedCrop.width,
          completedCrop.height
        );
        canvasToProcess = canvas;
      } else {
         const image = imgRef.current;
         if(!image) throw new Error("Image not loaded");
         const canvas = document.createElement('canvas');
         canvas.width = image.naturalWidth;
         canvas.height = image.naturalHeight;
         const ctx = canvas.getContext('2d');
         if(ctx) ctx.drawImage(image, 0, 0);
         canvasToProcess = canvas;
      }

      // 2. Apply Signature Enhancement if applicable
      if (docType === 'signature' && applyEnhancement) {
        const tempBlob = await new Promise<Blob>((res) => canvasToProcess.toBlob(b => res(b!), 'image/png'));
        const enhancedUrl = await enhanceSignature(URL.createObjectURL(tempBlob), contrast[0], brightness[0]);
        const img = new Image();
        img.src = enhancedUrl;
        await new Promise((res) => img.onload = res);
        const ctx = canvasToProcess.getContext('2d');
        if(ctx) ctx.drawImage(img, 0, 0, canvasToProcess.width, canvasToProcess.height);
      }

      // 3. Apply Name/Date Overlay if applicable
      if (docType === 'photo' && (nameText || dateText)) {
        const tempBlob = await new Promise<Blob>((res) => canvasToProcess.toBlob(b => res(b!), 'image/jpeg'));
        const overlayUrl = await overlayTextOnImage(URL.createObjectURL(tempBlob), nameText, dateText);
        const img = new Image();
        img.src = overlayUrl;
        await new Promise((res) => img.onload = res);
        const ctx = canvasToProcess.getContext('2d');
        if(ctx) ctx.drawImage(img, 0, 0, canvasToProcess.width, canvasToProcess.height);
      }

      // 4. Target Compression & Sizing
      const targetOpts = {
        minKB: reqs.minKB,
        maxKB: reqs.maxKB,
        exactWidth: reqs.width || undefined,
        exactHeight: reqs.height || undefined,
        format: reqs.format.includes('jpg') || reqs.format.includes('jpeg') ? 'image/jpeg' as const : 'image/png' as const,
        fillBackground: '#ffffff'
      };

      const result = await compressToTargetKB(canvasToProcess, targetOpts);

      setProcessedUrl(result.url);
      setFinalSizeKB(result.sizeKB);
      setFinalWidth(result.width);
      setFinalHeight(result.height);

    } catch (err: any) {
      setError(err.message || 'An error occurred during processing.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedUrl) return;
    const a = document.createElement('a');
    a.href = processedUrl;
    const ext = reqs?.format.includes('jpg') ? 'jpg' : 'png';
    a.download = `${exam?.slug || 'custom'}-${docType || 'document'}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!reqs) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-xl text-center">
        <h1 className="text-2xl font-bold mb-4">Select an Exam First</h1>
        <p className="mb-6 text-secondary-text">Please go back and select an exam to load the correct requirements.</p>
        <Button onClick={() => router.push('/exam-tools')}>Browse Exams</Button>
      </div>
    );
  }

  const isSizeValid = finalSizeKB >= reqs.minKB && finalSizeKB <= reqs.maxKB;
  const isDimensionsValid = (!reqs.width || finalWidth === reqs.width) && (!reqs.height || finalHeight === reqs.height);
  const isAllValid = isSizeValid && isDimensionsValid;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8 border-b border-border pb-4">
        <h1 className="text-2xl font-bold text-foreground capitalize">
          {exam ? `${exam.name} - ` : ''}Prepare {docType}
        </h1>
        <p className="text-secondary-text text-sm mt-1">
          Target: {reqs.width}x{reqs.height}px • {reqs.minKB}-{reqs.maxKB}KB • {reqs.format.join('/').toUpperCase()}
        </p>
      </header>

      {!sourceUrl ? (
        <div className="max-w-2xl mx-auto">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer bg-card hover:bg-muted/50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-secondary-text" />
              <p className="mb-2 text-sm text-foreground font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-secondary-text">Supported formats: {reqs.format.join(', ').toUpperCase()}</p>
            </div>
            <input type="file" className="hidden" accept={reqs.format.map(f => `image/${f}`).join(',')} onChange={handleFileChange} />
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: Tools */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-card border border-border rounded-xl p-4">
               <h3 className="font-semibold mb-4 flex items-center gap-2"><Settings className="w-4 h-4"/> Tools</h3>

               {docType === 'signature' && (
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <Label htmlFor="enhance">Enhance Signature</Label>
                     <Switch id="enhance" checked={applyEnhancement} onCheckedChange={setApplyEnhancement} />
                   </div>
                   {applyEnhancement && (
                     <>
                       <div className="space-y-2">
                         <div className="flex justify-between text-xs">
                           <Label>Contrast</Label>
                           <span>{contrast[0]}x</span>
                         </div>
                         <Slider value={contrast} onValueChange={setContrast} min={0.5} max={3} step={0.1} />
                       </div>
                       <div className="space-y-2">
                         <div className="flex justify-between text-xs">
                           <Label>Brightness</Label>
                           <span>{brightness[0]}</span>
                         </div>
                         <Slider value={brightness} onValueChange={setBrightness} min={-100} max={100} step={1} />
                       </div>
                     </>
                   )}
                 </div>
               )}

               {docType === 'photo' && (
                 <div className="space-y-4">
                   <div className="space-y-2">
                     <Label>Name on Photo (Optional)</Label>
                     <Input placeholder="E.g. JOHN DOE" value={nameText} onChange={e => setNameText(e.target.value)} />
                   </div>
                   <div className="space-y-2">
                     <Label>Date on Photo (Optional)</Label>
                     <Input placeholder="E.g. 15-08-2023" value={dateText} onChange={e => setDateText(e.target.value)} />
                   </div>
                 </div>
               )}

               <Button className="w-full mt-6" onClick={processImage} disabled={processing}>
                 {processing ? 'Processing...' : 'Apply & Validate'}
               </Button>

               <Button variant="outline" className="w-full mt-2" onClick={() => { setSourceUrl(null); setProcessedUrl(null); }}>
                 Upload Different File
               </Button>
            </div>
          </div>

          {/* CENTER: Preview */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="bg-muted/30 border border-border rounded-xl p-2 flex-grow flex items-center justify-center min-h-[400px] overflow-hidden">
              {!processedUrl ? (
                <ReactCrop
                  crop={crop}
                  onChange={c => setCrop(c)}
                  onComplete={c => setCompletedCrop(c)}
                  aspect={reqs.aspectRatio || undefined}
                >
                  <img
                    ref={imgRef}
                    src={sourceUrl}
                    alt="Upload preview"
                    className="max-h-[500px] w-auto object-contain"
                  />
                </ReactCrop>
              ) : (
                <div className="flex flex-col items-center">
                  <img
                    src={processedUrl}
                    alt="Processed result"
                    className="max-h-[500px] w-auto border border-border shadow-sm"
                  />
                  <Button variant="ghost" size="sm" className="mt-4" onClick={() => setProcessedUrl(null)}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Adjust Crop/Settings
                  </Button>
                </div>
              )}
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 text-red-600 border border-red-500/20 rounded-md text-sm">
                {error}
              </div>
            )}
          </div>

          {/* RIGHT: Validation & Download */}
          <div className="lg:col-span-3">
             <div className="bg-card border border-border rounded-xl p-4 sticky top-24">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> Validation</h3>

                {!processedUrl ? (
                  <div className="text-sm text-secondary-text text-center py-8">
                    Click &quot;Apply &amp; Validate&quot; to check if your document meets the requirements.
                  </div>
                ) : (
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                      <div>
                        <p className="font-medium">File Size</p>
                        <p className="text-xs text-secondary-text">Req: {reqs.minKB}-{reqs.maxKB}KB</p>
                      </div>
                      <div className={`font-semibold flex items-center gap-1 ${isSizeValid ? 'text-success' : 'text-red-500'}`}>
                        {finalSizeKB.toFixed(1)} KB
                        {isSizeValid ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-2 rounded bg-muted/50">
                      <div>
                        <p className="font-medium">Dimensions</p>
                        <p className="text-xs text-secondary-text">Req: {reqs.width}x{reqs.height}px</p>
                      </div>
                      <div className={`font-semibold flex items-center gap-1 ${isDimensionsValid ? 'text-success' : 'text-yellow-600'}`}>
                        {finalWidth}x{finalHeight}
                        {isDimensionsValid ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border">
                      {isAllValid ? (
                        <div className="text-success font-medium flex items-center justify-center gap-2 mb-4 bg-success/10 py-2 rounded">
                          <CheckCircle2 className="w-5 h-5" /> READY TO UPLOAD
                        </div>
                      ) : (
                        <div className="text-red-500 font-medium flex items-center justify-center gap-2 mb-4 bg-red-500/10 py-2 px-1 text-center rounded">
                          <AlertCircle className="w-5 h-5 shrink-0" /> Requirements not met
                        </div>
                      )}
                      <Button className="w-full" size="lg" onClick={handleDownload} variant={isAllValid ? 'default' : 'secondary'}>
                        <Download className="w-4 h-4 mr-2" /> Download
                      </Button>
                      {!isAllValid && (
                        <p className="text-xs text-secondary-text mt-2 text-center">
                          Warning: You can download, but it may be rejected by the portal.
                        </p>
                      )}
                    </div>
                  </div>
                )}
             </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default function ExamStudioPage() {
  return (
    <React.Suspense fallback={<div className="container py-12 text-center">Loading Studio...</div>}>
      <ExamStudioContent />
    </React.Suspense>
  );
}
