/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import {
  EXAM_DATABASE,
  DocumentRequirement,
  ExamRecord,
  getExamById,
  categoryToSlug,
} from '@/lib/data/exams';
import {
  compressToTargetKB,
  overlayTextOnImage,
  enhanceSignature,
  convertUnitToPx,
  imageBlobToPdfBlob,
  validateDocumentAgainstRequirements,
  ValidationReport,
} from '@/lib/image-utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  Settings,
  RefreshCw,
  Crop as CropIcon,
  Sliders,
  Type,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  FileCheck,
  FileText,
  Info,
  Lock,
  Eye,
  Check,
  RotateCw,
} from 'lucide-react';

function ExamStudioContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialExamId = searchParams.get('exam') || '';
  const initialDocType = (searchParams.get('type') as 'photo' | 'signature') || 'photo';

  // Mode: preset or custom
  const [selectedExamId, setSelectedExamId] = useState<string>(initialExamId);
  const [docType, setDocType] = useState<'photo' | 'signature'>(initialDocType);

  // Unit and DPI
  const [unit, setUnit] = useState<'px' | 'cm' | 'mm' | 'inch'>('px');
  const [dpi, setDpi] = useState<number>(200);

  // Custom dimensions state
  const [widthVal, setWidthVal] = useState<string>('350');
  const [heightVal, setHeightVal] = useState<string>('450');
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [minKBVal, setMinKBVal] = useState<string>('20');
  const [maxKBVal, setMaxKBVal] = useState<string>('50');
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp' | 'application/pdf'>('image/jpeg');

  // Photo Name and Date Overlay
  const [enableNameDate, setEnableNameDate] = useState<boolean>(false);
  const [nameText, setNameText] = useState<string>('');
  const [dateText, setDateText] = useState<string>('');

  // Signature Enhancements
  const [enableSigCleanup, setEnableSigCleanup] = useState<boolean>(initialDocType === 'signature');
  const [contrastVal, setContrastVal] = useState<number[]>([1.5]);
  const [brightnessVal, setBrightnessVal] = useState<number[]>([0]);

  // Image source & processed state
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Crop state
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation report state
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [finalSizeKB, setFinalSizeKB] = useState<number>(0);
  const [finalWidth, setFinalWidth] = useState<number>(0);
  const [finalHeight, setFinalHeight] = useState<number>(0);

  // Current selected exam record
  const currentExam = useMemo(() => {
    if (!selectedExamId) return null;
    return getExamById(selectedExamId) || null;
  }, [selectedExamId]);

  // Current document requirement from preset
  const presetReq = useMemo((): DocumentRequirement | null => {
    if (!currentExam) return null;
    return currentExam.requirements[docType] || null;
  }, [currentExam, docType]);

  // Sync preset values when exam or docType changes
  useEffect(() => {
    if (presetReq) {
      if (presetReq.unit) setUnit(presetReq.unit);
      if (presetReq.width) setWidthVal(String(presetReq.width));
      if (presetReq.height) setHeightVal(String(presetReq.height));
      if (presetReq.minKB !== undefined) setMinKBVal(String(presetReq.minKB));
      if (presetReq.maxKB !== undefined) setMaxKBVal(String(presetReq.maxKB));
      if (presetReq.nameRequired || presetReq.dateRequired) {
        setEnableNameDate(true);
      }
      if (docType === 'signature') {
        setEnableSigCleanup(true);
      }
    }
  }, [presetReq, docType]);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      if (processedUrl) URL.revokeObjectURL(processedUrl);
    };
  }, [sourceUrl, processedUrl]);

  // Handle file selection
  const handleFileChange = (file: File) => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (processedUrl) URL.revokeObjectURL(processedUrl);
    setProcessedUrl(null);
    setProcessedBlob(null);
    setValidationReport(null);
    setError(null);

    if (file.size > 20 * 1024 * 1024) {
      setError('File is too large. Please select an image under 20MB.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Invalid file type. Please select an image (JPG, PNG, WebP).');
      return;
    }

    setSourceFile(file);
    const url = URL.createObjectURL(file);
    setSourceUrl(url);

    // Initial crop frame
    const aspect =
      presetReq?.aspectRatio ||
      (parseFloat(widthVal) && parseFloat(heightVal)
        ? parseFloat(widthVal) / parseFloat(heightVal)
        : undefined);

    setCrop({
      unit: '%',
      width: 90,
      height: aspect ? 90 / aspect : 90,
      x: 5,
      y: 5,
    });
  };

  // Handle unit switching with automatic value conversion
  const handleUnitChange = (newUnit: 'px' | 'cm' | 'mm' | 'inch') => {
    if (newUnit === unit) return;
    const wNum = parseFloat(widthVal);
    const hNum = parseFloat(heightVal);
    if (!isNaN(wNum) && !isNaN(hNum) && wNum > 0 && hNum > 0) {
      const currentPxW = convertUnitToPx(wNum, unit, dpi);
      const currentPxH = convertUnitToPx(hNum, unit, dpi);

      let newW: number;
      let newH: number;
      if (newUnit === 'cm') {
        newW = parseFloat(((currentPxW / dpi) * 2.54).toFixed(2));
        newH = parseFloat(((currentPxH / dpi) * 2.54).toFixed(2));
      } else if (newUnit === 'mm') {
        newW = parseFloat(((currentPxW / dpi) * 25.4).toFixed(1));
        newH = parseFloat(((currentPxH / dpi) * 25.4).toFixed(1));
      } else if (newUnit === 'inch') {
        newW = parseFloat((currentPxW / dpi).toFixed(2));
        newH = parseFloat((currentPxH / dpi).toFixed(2));
      } else {
        newW = Math.round(currentPxW);
        newH = Math.round(currentPxH);
      }
      setWidthVal(String(newW));
      setHeightVal(String(newH));
    }
    setUnit(newUnit);
  };

  // Convert width and height to pixels
  const targetPxDimensions = useMemo(() => {
    const wNum = parseFloat(widthVal);
    const hNum = parseFloat(heightVal);
    if (isNaN(wNum) || isNaN(hNum) || wNum <= 0 || hNum <= 0) {
      return { width: null, height: null };
    }
    return {
      width: convertUnitToPx(wNum, unit, dpi),
      height: convertUnitToPx(hNum, unit, dpi),
    };
  }, [widthVal, heightVal, unit, dpi]);

  // Process Document
  const processDocument = async () => {
    if (!sourceUrl) return;
    setProcessing(true);
    setError(null);

    try {
      // 1. Interactive crop canvas
      let canvasToProcess: HTMLCanvasElement;

      if (completedCrop && completedCrop.width > 0 && completedCrop.height > 0 && imgRef.current) {
        const image = imgRef.current;
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = completedCrop.width * scaleX;
        canvas.height = completedCrop.height * scaleY;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

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
        canvasToProcess = canvas;
      } else if (imgRef.current) {
        const image = imgRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');
        ctx.drawImage(image, 0, 0);
        canvasToProcess = canvas;
      } else {
        throw new Error('Image source not loaded');
      }

      // Convert canvas to initial object URL
      let currentBlobUrl = await new Promise<string>((resolve) => {
        canvasToProcess.toBlob((b) => {
          if (b) resolve(URL.createObjectURL(b));
          else throw new Error('Failed to create canvas blob');
        }, 'image/jpeg', 0.95);
      });

      // 2. Apply Signature Enhancement (if enabled)
      if (enableSigCleanup && docType === 'signature') {
        currentBlobUrl = await enhanceSignature(
          currentBlobUrl,
          contrastVal[0],
          brightnessVal[0]
        );
      }

      // 3. Apply Name and Date Overlay (if enabled)
      if (enableNameDate && (nameText.trim() || dateText.trim())) {
        currentBlobUrl = await overlayTextOnImage(
          currentBlobUrl,
          nameText.trim(),
          dateText.trim()
        );
      }

      // 4. Fetch the modified blob
      const modifiedBlob = await fetch(currentBlobUrl).then((r) => r.blob());

      // 5. Target sizing and compression
      const minKB = parseFloat(minKBVal) || 0;
      const maxKB = parseFloat(maxKBVal) || 200;

      const compressionFormat =
        outputFormat === 'application/pdf' ? 'image/jpeg' : outputFormat;

      const compressionRes = await compressToTargetKB(modifiedBlob, {
        exactWidth: targetPxDimensions.width || undefined,
        exactHeight: targetPxDimensions.height || undefined,
        minKB,
        maxKB,
        format: compressionFormat,
        fillBackground: '#ffffff',
      });

      let finalBlob = compressionRes.blob;
      let finalUrl = compressionRes.url;

      // 6. Handle PDF Export if selected
      if (outputFormat === 'application/pdf') {
        const pdfBlob = await imageBlobToPdfBlob(compressionRes.blob);
        finalBlob = pdfBlob;
        finalUrl = URL.createObjectURL(pdfBlob);
      }

      setProcessedBlob(finalBlob);
      setProcessedUrl(finalUrl);
      setFinalSizeKB(finalBlob.size / 1024);
      setFinalWidth(compressionRes.width);
      setFinalHeight(compressionRes.height);

      // 7. Validate output against requirements
      const report = validateDocumentAgainstRequirements({
        sizeKB: finalBlob.size / 1024,
        width: compressionRes.width,
        height: compressionRes.height,
        format: outputFormat,
        minKB: presetReq ? presetReq.minKB : parseFloat(minKBVal) || undefined,
        maxKB: presetReq ? presetReq.maxKB : parseFloat(maxKBVal) || undefined,
        expectedWidth: targetPxDimensions.width,
        expectedHeight: targetPxDimensions.height,
        expectedFormats: presetReq?.format || (outputFormat === 'application/pdf' ? ['pdf'] : ['jpg', 'jpeg', 'png', 'webp']),
        backgroundInstruction: presetReq?.backgroundRequirement || null,
        nameRequired: presetReq?.nameRequired || false,
        dateRequired: presetReq?.dateRequired || false,
        hasNameOverlay: Boolean(nameText.trim()),
        hasDateOverlay: Boolean(dateText.trim()),
        isSignature: docType === 'signature',
      });

      setValidationReport(report);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to process document. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Download Handler
  const handleDownload = () => {
    if (!processedUrl) return;
    const a = document.createElement('a');
    a.href = processedUrl;

    const ext =
      outputFormat === 'application/pdf'
        ? 'pdf'
        : outputFormat === 'image/png'
        ? 'png'
        : outputFormat === 'image/webp'
        ? 'webp'
        : 'jpg';

    const examPrefix = currentExam ? currentExam.slug : 'custom';
    a.download = `${examPrefix}-${docType}-${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-secondary-text mb-6">
        <Link href="/exam-tools" className="hover:text-primary transition-colors">
          Exam Tools
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">Custom Document Studio</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-border gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
            <Lock className="w-3.5 h-3.5" /> 100% Client-Side Processing • Your files stay private
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Custom Document Studio
          </h1>
          <p className="text-secondary-text text-sm md:text-base mt-1">
            Resize, crop, clean, and compress photos and signatures for any examination or custom requirement.
          </p>
        </div>

        {/* Quick Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={selectedExamId ? 'outline' : 'default'}
            size="sm"
            onClick={() => {
              setSelectedExamId('');
              router.replace('/exam-tools/studio');
            }}
          >
            Custom Mode
          </Button>
          <Button
            variant={selectedExamId ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              if (!selectedExamId) {
                setSelectedExamId('ssc-cgl');
              }
            }}
          >
            Exam Preset Mode
          </Button>
        </div>
      </div>

      {/* Preset Selector Banner (if in preset mode or exam selected) */}
      <div className="mb-8 p-5 bg-card border border-border rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-secondary-text mb-1 block">
              Examination Preset
            </Label>
            <select
              value={selectedExamId}
              onChange={(e) => {
                setSelectedExamId(e.target.value);
                if (e.target.value) {
                  router.replace(`/exam-tools/studio?exam=${e.target.value}&type=${docType}`);
                } else {
                  router.replace(`/exam-tools/studio?type=${docType}`);
                }
              }}
              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="">Custom Requirements (No Preset)</option>
              {EXAM_DATABASE.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name} ({exam.recruitmentCycle}) – {exam.organization}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-xs font-semibold uppercase tracking-wider text-secondary-text mb-1 block">
              Document Type
            </Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={docType === 'photo' ? 'default' : 'outline'}
                className="w-full text-xs font-medium h-9"
                onClick={() => setDocType('photo')}
              >
                Photograph
              </Button>
              <Button
                type="button"
                variant={docType === 'signature' ? 'default' : 'outline'}
                className="w-full text-xs font-medium h-9"
                onClick={() => setDocType('signature')}
              >
                Signature
              </Button>
            </div>
          </div>

          <div className="text-xs text-secondary-text">
            {currentExam ? (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <ShieldCheck className="w-4 h-4 text-success" />
                  {currentExam.verificationStatus === 'Historical archive'
                    ? `Historical Archive (${currentExam.recruitmentCycle})`
                    : currentExam.verificationStatus}
                </div>
                <div>Verified: {currentExam.lastVerified}</div>
                {currentExam.sourceUrl && (
                  <a
                    href={currentExam.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center gap-1"
                  >
                    Official Source Notification <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ) : (
              <div className="p-2 bg-muted/40 rounded-lg text-xs">
                Custom mode active. Enter custom dimensions and KB limits below according to your notification.
              </div>
            )}
          </div>
        </div>

        {/* Live Photo Warning (e.g. SSC) */}
        {presetReq?.liveCaptureRequired && (
          <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-semibold text-sm mb-0.5">Mandatory Live Photograph Capture</p>
              <p className="leading-relaxed">
                The official {currentExam?.name} portal requires you to capture your photograph LIVE
                using a webcam or mobile application. A pre-scanned photograph cannot be uploaded for this exam.
                Upload is only required for your signature (4cm × 2cm, 10–20 KB). Please select &quot;Signature&quot; above to prepare your signature.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Workspace: 3-Column Layout on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* COLUMN 1: Controls & Parameters (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Dimension Controls Card */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary" /> Dimensions &amp; Scaling
              </h3>
              <div className="flex items-center gap-1 text-xs">
                {(['px', 'cm', 'mm', 'inch'] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => handleUnitChange(u)}
                    className={`px-2 py-0.5 rounded uppercase font-semibold text-[11px] transition-colors ${
                      unit === u
                        ? 'bg-primary text-white'
                        : 'bg-muted text-secondary-text hover:text-foreground'
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>

            {/* DPI Selector (for mm, cm, inch) */}
            {unit !== 'px' && (
              <div className="space-y-1.5">
                <Label className="text-xs text-secondary-text">DPI Resolution</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[100, 200, 300].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDpi(d)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                        dpi === d
                          ? 'border-primary bg-primary/10 text-primary font-semibold'
                          : 'border-border bg-background text-secondary-text hover:text-foreground'
                      }`}
                    >
                      {d} DPI
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Width & Height Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Width ({unit})</Label>
                <Input
                  type="number"
                  value={widthVal}
                  onChange={(e) => setWidthVal(e.target.value)}
                  placeholder="e.g. 350"
                  className="h-10 bg-background"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Height ({unit})</Label>
                <Input
                  type="number"
                  value={heightVal}
                  onChange={(e) => setHeightVal(e.target.value)}
                  placeholder="e.g. 450"
                  className="h-10 bg-background"
                />
              </div>
            </div>

            {/* Target Pixel Conversion Indicator */}
            {unit !== 'px' && targetPxDimensions.width && targetPxDimensions.height && (
              <div className="p-2.5 bg-muted/40 rounded-xl text-xs text-secondary-text flex items-center justify-between">
                <span>Calculated Resolution:</span>
                <span className="font-semibold text-foreground">
                  {targetPxDimensions.width} × {targetPxDimensions.height} px ({dpi} DPI)
                </span>
              </div>
            )}

            {/* File Size Limits */}
            <div className="space-y-3 pt-3 border-t border-border/60">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold uppercase tracking-wider text-secondary-text block">
                  Target File Size Limits (KB)
                </Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-xs text-secondary-text">Min Size (KB)</span>
                  <Input
                    type="number"
                    value={minKBVal}
                    onChange={(e) => setMinKBVal(e.target.value)}
                    placeholder="e.g. 20"
                    className="h-10 bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-secondary-text">Max Size (KB)</span>
                  <Input
                    type="number"
                    value={maxKBVal}
                    onChange={(e) => setMaxKBVal(e.target.value)}
                    placeholder="e.g. 50"
                    className="h-10 bg-background"
                  />
                </div>
              </div>
              <p className="text-[11px] text-secondary-text leading-relaxed">
                Client-side quality optimization compresses your file to fit within the specified KB range. Resulting file size depends on image detail and complexity.
              </p>
            </div>

            {/* Output Format */}
            <div className="space-y-2 pt-3 border-t border-border/60">
              <Label className="text-xs font-semibold uppercase tracking-wider text-secondary-text block">
                Output File Format
              </Label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: 'JPG', value: 'image/jpeg' },
                  { label: 'PNG', value: 'image/png' },
                  { label: 'WebP', value: 'image/webp' },
                  { label: 'PDF', value: 'application/pdf' },
                ].map((fmt) => (
                  <button
                    key={fmt.value}
                    type="button"
                    onClick={() => setOutputFormat(fmt.value as any)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border text-center transition-all ${
                      outputFormat === fmt.value
                        ? 'border-primary bg-primary text-white'
                        : 'border-border bg-background text-secondary-text hover:text-foreground'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Photo Extras: Name & Date Overlay */}
          {docType === 'photo' && (
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm">Name &amp; Date Overlay</span>
                </div>
                <Switch
                  checked={enableNameDate}
                  onCheckedChange={setEnableNameDate}
                  aria-label="Toggle Name & Date Stamp"
                />
              </div>

              {enableNameDate ? (
                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Candidate Name</Label>
                    <Input
                      type="text"
                      placeholder="e.g. RAHUL SHARMA"
                      value={nameText}
                      onChange={(e) => setNameText(e.target.value)}
                      className="h-9 bg-background uppercase"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Date of Photograph Capture</Label>
                    <Input
                      type="text"
                      placeholder="e.g. 15/10/2024"
                      value={dateText}
                      onChange={(e) => setDateText(e.target.value)}
                      className="h-9 bg-background"
                    />
                  </div>
                  <p className="text-[11px] text-secondary-text">
                    Applies a neat white caption strip with high-contrast text at the bottom (strictly required for UPSC CSE, NDA/CDS).
                  </p>
                </div>
              ) : (
                <p className="text-xs text-secondary-text">
                  Turn on if your application requires the candidate name and photo date stamped at the bottom.
                </p>
              )}
            </div>
          )}

          {/* Signature Extras: Contrast & Background Clean */}
          {docType === 'signature' && (
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-sm">Background Clean &amp; Contrast</span>
                </div>
                <Switch
                  checked={enableSigCleanup}
                  onCheckedChange={setEnableSigCleanup}
                  aria-label="Toggle Signature Enhancement"
                />
              </div>

              {enableSigCleanup ? (
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span>Contrast Boost</span>
                      <span className="font-semibold text-primary">{contrastVal[0]}x</span>
                    </div>
                    <Slider
                      value={contrastVal}
                      min={1.0}
                      max={3.0}
                      step={0.1}
                      onValueChange={setContrastVal}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span>Brightness Balance</span>
                      <span className="font-semibold text-primary">{brightnessVal[0]}</span>
                    </div>
                    <Slider
                      value={brightnessVal}
                      min={-50}
                      max={50}
                      step={5}
                      onValueChange={setBrightnessVal}
                    />
                  </div>

                  <p className="text-[11px] text-secondary-text">
                    Automatically whitens shadowy paper backgrounds and darkens blue/black ink strokes for maximum legibility.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-secondary-text">
                  Enable to clean up grey paper shadows and boost ink contrast.
                </p>
              )}
            </div>
          )}
        </div>

        {/* COLUMN 2: Upload, Crop, & Visual Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <CropIcon className="w-4 h-4 text-primary" />
                {processedUrl ? 'Processed Result' : 'Crop & Frame'}
              </h3>
              {sourceUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs h-8"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1" /> Replace File
                </Button>
              )}
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />

            {/* Workspace Area: Dropzone or Cropper or Result */}
            {!sourceUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileChange(e.dataTransfer.files[0]);
                  }
                }}
                className="border-2 border-dashed border-border hover:border-primary/60 rounded-2xl p-10 text-center cursor-pointer transition-colors bg-muted/20 hover:bg-muted/40 min-h-[350px] flex flex-col items-center justify-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Upload className="w-7 h-7" />
                </div>
                <h4 className="font-semibold text-base mb-1">
                  Click or drag &amp; drop to upload {docType}
                </h4>
                <p className="text-xs text-secondary-text max-w-xs mb-4">
                  Supports JPG, PNG, and WebP up to 20MB. All processing remains 100% on your device.
                </p>
                <Button size="sm" type="button">
                  Browse Files
                </Button>
              </div>
            ) : !processedUrl ? (
              /* Crop Editor */
              <div className="flex flex-col items-center justify-center min-h-[350px] bg-muted/30 rounded-xl p-4 overflow-hidden">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={
                    lockAspect && targetPxDimensions.width && targetPxDimensions.height
                      ? targetPxDimensions.width / targetPxDimensions.height
                      : undefined
                  }
                  className="max-w-full max-h-[500px]"
                >
                  <img
                    ref={imgRef}
                    src={sourceUrl}
                    alt="Upload preview"
                    className="max-h-[480px] w-auto object-contain rounded"
                  />
                </ReactCrop>
                <div className="flex items-center justify-between w-full mt-3 text-xs text-secondary-text">
                  <span>Drag corners to adjust framing</span>
                  <button
                    type="button"
                    onClick={() => setLockAspect(!lockAspect)}
                    className="hover:text-primary transition-colors underline"
                  >
                    {lockAspect ? 'Unlock Aspect Ratio' : 'Lock Aspect Ratio'}
                  </button>
                </div>
              </div>
            ) : (
              /* Processed Preview */
              <div className="flex flex-col items-center justify-center min-h-[350px] bg-muted/20 rounded-xl p-6">
                <div className="relative border border-border shadow-md rounded-lg overflow-hidden bg-white max-h-[440px]">
                  {outputFormat === 'application/pdf' ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center">
                      <FileText className="w-16 h-16 text-primary mb-3" />
                      <p className="font-semibold text-sm text-foreground">Single Page PDF Generated</p>
                      <p className="text-xs text-secondary-text mt-1">Ready for PDF document upload</p>
                    </div>
                  ) : (
                    <img
                      src={processedUrl}
                      alt="Processed output"
                      className="max-h-[400px] w-auto object-contain"
                    />
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setProcessedUrl(null);
                      setValidationReport(null);
                    }}
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Adjust Crop &amp; Settings
                  </Button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Button */}
            {sourceUrl && !processedUrl && (
              <Button
                className="w-full mt-5 py-6 text-base font-semibold"
                size="lg"
                disabled={processing}
                onClick={processDocument}
              >
                {processing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Processing &amp; Compressing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" /> Apply Framing &amp; Validate
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* COLUMN 3: Document Validation Report & Download (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5 sticky top-24 space-y-5">
            <div className="border-b border-border/60 pb-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-primary" /> Document Validation
              </h3>
              {validationReport && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    validationReport.overallStatus === 'PASS'
                      ? 'bg-success/15 text-success'
                      : validationReport.overallStatus === 'FAIL'
                      ? 'bg-red-500/15 text-red-600'
                      : 'bg-amber-500/15 text-amber-600'
                  }`}
                >
                  {validationReport.overallStatus}
                </span>
              )}
            </div>

            {!validationReport ? (
              <div className="text-center py-10 text-xs text-secondary-text">
                <ShieldCheck className="w-8 h-8 text-secondary-text/40 mx-auto mb-2" />
                Upload and click &quot;Apply Framing &amp; Validate&quot; to inspect your file against official portal limits.
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Result Specs Summary */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-muted/40 rounded-xl">
                  <div>
                    <span className="text-secondary-text block">Output Size:</span>
                    <span className="font-semibold text-foreground text-sm">
                      {finalSizeKB.toFixed(1)} KB
                    </span>
                  </div>
                  <div>
                    <span className="text-secondary-text block">Resolution:</span>
                    <span className="font-semibold text-foreground text-sm">
                      {finalWidth} × {finalHeight} px
                    </span>
                  </div>
                </div>

                {/* Validation Checklist Items */}
                <div className="space-y-2.5">
                  {validationReport.items.map((item) => (
                    <div
                      key={item.key}
                      className={`p-3 rounded-xl border flex flex-col gap-1 ${
                        item.status === 'PASS'
                          ? 'bg-success/5 border-success/20 text-foreground'
                          : item.status === 'FAIL'
                          ? 'bg-red-500/5 border-red-500/20 text-foreground'
                          : 'bg-amber-500/5 border-amber-500/20 text-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span className="flex items-center gap-1.5">
                          {item.status === 'PASS' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                          ) : item.status === 'FAIL' ? (
                            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          ) : (
                            <Eye className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          )}
                          {item.label}
                        </span>
                        <span
                          className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                            item.status === 'PASS'
                              ? 'bg-success/20 text-success'
                              : item.status === 'FAIL'
                              ? 'bg-red-500/20 text-red-600'
                              : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {item.status === 'MANUAL_REVIEW' ? 'REVIEW' : item.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-secondary-text leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Official Disclaimer */}
                <div className="p-3 bg-muted/40 rounded-xl border border-border text-[11px] text-secondary-text leading-relaxed">
                  <span className="font-semibold text-foreground block mb-0.5">Disclaimer:</span>
                  UtilitySpace prepares and checks files against the displayed requirements. Final
                  acceptance is determined by the official examination authority.
                </div>

                {/* Download CTA Button */}
                <Button
                  className="w-full py-5 text-sm font-semibold"
                  size="lg"
                  onClick={handleDownload}
                  variant={validationReport.overallStatus === 'FAIL' ? 'secondary' : 'default'}
                >
                  <Download className="w-4 h-4 mr-2" /> Download Prepared Document
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExamStudioPage() {
  return (
    <React.Suspense
      fallback={
        <div className="container mx-auto px-4 py-20 text-center text-sm text-secondary-text">
          Loading Document Studio...
        </div>
      }
    >
      <ExamStudioContent />
    </React.Suspense>
  );
}
