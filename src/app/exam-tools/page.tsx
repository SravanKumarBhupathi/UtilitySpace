"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Search,
  Camera,
  PenTool,
  SlidersHorizontal,
  FileCheck2,
  ChevronRight,
  ShieldCheck,
  Lock,
  Zap,
  ArrowRight,
  BookOpen,
  FileText,
  Info,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import {
  EXAM_CATEGORIES,
  EXAM_DATABASE,
  CATEGORY_DESCRIPTIONS,
  categoryToSlug,
} from '@/lib/data/exams';

export default function ExamToolsLandingPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExams = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return EXAM_DATABASE.filter(
      (e) =>
        e.active &&
        (e.name.toLowerCase().includes(q) ||
          e.organization.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          (e.notificationNumber && e.notificationNumber.toLowerCase().includes(q)))
    );
  }, [searchQuery]);

  const faqs = [
    {
      q: 'Are my sensitive photos and signatures uploaded to your server?',
      a: 'Never. All document processing, cropping, compression, and signature enhancements run 100% on your device using client-side WebAssembly, Canvas, and HTML5 APIs. No files or personal data ever leave your browser.',
    },
    {
      q: 'How are the exam dimensions and file size limits verified?',
      a: 'Every exam preset is checked directly against official recruitment notifications (e.g., SSC CGL, RRB CEN notifications, IBPS CRP guidelines, UPSC exam notices). We record the exact notification number, source link, recruitment cycle, and verification date for full transparency. If preparing documents for a new or subsequent recruitment cycle, applicants should verify with the current active notification on the official portal.',
    },
    {
      q: 'Does SSC still accept pre-scanned uploaded photographs?',
      a: 'No. On the updated SSC portal (ssc.gov.in), photograph capture is mandatory via live webcam or the official MySSC app. Upload is only required for your signature (10–20 KB). Our SSC presets clearly highlight this so you avoid application rejections.',
    },
    {
      q: 'What if my exam is not listed in the presets?',
      a: 'You can use the Custom Document Studio. It allows you to enter exact millimeter, centimeter, pixel, or inch dimensions, choose DPI (100, 200, 300), and define custom KB limits specified in your application brochure.',
    },
    {
      q: 'Can I add my name and the date of capture to my UPSC photograph?',
      a: 'Yes. UPSC notifications require the applicant’s name and photograph date clearly stamped at the bottom. Our studio has an automated Name & Date overlay tool designed specifically for this requirement.',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-14 max-w-7xl">
      {/* Hero Section */}
      <section className="text-center mb-16 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
          <ShieldCheck className="w-4 h-4" /> Officially Verified Document Presets
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
          Exam Tools – Photo, Signature &amp; Document Preparation
        </h1>
        <p className="text-lg md:text-xl text-secondary-text mb-8 leading-relaxed max-w-2xl mx-auto">
          Resize, crop, compress, and validate application photos and signatures according to
          verified government recruitment notifications — 100% private in your browser.
        </p>

        {/* Two Clear Entry Paths */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-10">
          <Link
            href="#select-exam"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 shadow-sm transition-all text-base group"
          >
            <span>Path A: Select Exam Preset</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/exam-tools/studio"
            className="flex items-center justify-center gap-2 px-6 py-4 bg-card border-2 border-border hover:border-primary/60 text-foreground font-semibold rounded-xl hover:bg-muted/50 transition-all text-base group"
          >
            <SlidersHorizontal className="w-4 h-4 text-primary" />
            <span>Path B: Custom Document Studio</span>
          </Link>
        </div>

        {/* Privacy Strip */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-secondary-text border-y border-border/60 py-4 max-w-3xl mx-auto">
          <span className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-success" /> 100% On-Device Processing
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-success" /> Zero Server Uploads
          </span>
          <span className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-success" /> Free &amp; No Account Required
          </span>
        </div>
      </section>

      {/* Quick Tools Section */}
      <section className="mb-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold">Quick Utility Studios</h2>
            <p className="text-secondary-text text-sm mt-1">
              Direct tools to resize, clean up, compress, or validate any document in seconds.
            </p>
          </div>
          <Link
            href="/exam-tools/studio"
            className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            Open Full Studio <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link
            href="/exam-tools/studio?type=photo"
            className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
              Photo Resizer
            </h3>
            <p className="text-sm text-secondary-text flex-grow">
              Resize passport photos to exact mm, cm, or px dimensions with target KB compression and optional UPSC name/date stamp.
            </p>
            <div className="mt-4 pt-3 border-t border-border/50 text-xs font-semibold text-primary flex items-center gap-1">
              Resize Photo <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/exam-tools/studio?type=signature"
            className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <PenTool className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
              Signature Resizer
            </h3>
            <p className="text-sm text-secondary-text flex-grow">
              Enhance contrast, eliminate paper shadows with white-background thresholding, and compress signatures to 10–20 KB.
            </p>
            <div className="mt-4 pt-3 border-t border-border/50 text-xs font-semibold text-primary flex items-center gap-1">
              Enhance Signature <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/tools/image/compressor"
            className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
              Image Compressor
            </h3>
            <p className="text-sm text-secondary-text flex-grow">
              Reduce JPG, PNG, and WebP image sizes to strict limits (under 50 KB, 100 KB, or 200 KB) with zero visual quality loss.
            </p>
            <div className="mt-4 pt-3 border-t border-border/50 text-xs font-semibold text-primary flex items-center gap-1">
              Compress Image <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/exam-tools/studio"
            className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all flex flex-col"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
              Document Validator
            </h3>
            <p className="text-sm text-secondary-text flex-grow">
              Check dimensions, file size, aspect ratio, and background conditions against verified exam criteria with instant PASS/FAIL checks.
            </p>
            <div className="mt-4 pt-3 border-t border-border/50 text-xs font-semibold text-primary flex items-center gap-1">
              Validate Document <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Select Exam & Search Section */}
      <section id="select-exam" className="mb-20 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold">
              Find Your Examination
            </h2>
            <p className="text-secondary-text text-sm mt-1">
              Select an exam to automatically load its official verified photo &amp; signature specifications.
            </p>
          </div>
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-secondary-text" />
            </div>
            <Input
              type="text"
              className="pl-10 h-11 bg-card"
              placeholder="Search e.g. SSC CGL, RRB NTPC, IBPS, UPSC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Live Search Results */}
        {searchQuery.trim() ? (
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-secondary-text mb-4">
              Search Results ({filteredExams.length})
            </div>
            {filteredExams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExams.map((exam) => (
                  <Link
                    key={exam.id}
                    href={`/exam-tools/${categoryToSlug(exam.category)}/${exam.slug}`}
                    className="block group"
                  >
                    <div className="bg-card hover:bg-card/90 border border-border rounded-2xl p-6 transition-all duration-200 h-full flex flex-col hover:border-primary/50 hover:shadow-md">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                          {exam.name}
                        </h3>
                        <span className="text-xs bg-muted px-2.5 py-1 rounded-md font-medium whitespace-nowrap">
                          {exam.recruitmentCycle}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-primary mb-2">{exam.organization}</p>
                      <p className="text-sm text-secondary-text mb-4 line-clamp-2 flex-grow">
                        {exam.notes || 'Official notification specifications.'}
                      </p>
                      <div className="flex items-center text-sm font-semibold text-primary pt-3 border-t border-border/50">
                        View Verified Specs <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-2xl border border-border">
                <p className="text-secondary-text mb-4">
                  No preset found for &quot;{searchQuery}&quot;. You can use our Custom Document Studio with your notification’s guidelines.
                </p>
                <div className="flex justify-center gap-3">
                  <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/exam-tools/studio">Open Custom Studio</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Category Cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXAM_CATEGORIES.map((category) => {
              const catExams = EXAM_DATABASE.filter((e) => e.category === category && e.active);
              const catSlug = categoryToSlug(category);
              return (
                <div
                  key={category}
                  className="bg-card border border-border rounded-2xl p-6 flex flex-col hover:border-primary/50 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                      {category}
                    </span>
                    <span className="text-xs text-secondary-text font-medium">
                      {catExams.length} {catExams.length === 1 ? 'Exam' : 'Exams'}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {category} Exam Tools
                  </h3>

                  <p className="text-sm text-secondary-text mb-6 flex-grow leading-relaxed">
                    {CATEGORY_DESCRIPTIONS[category]}
                  </p>

                  <div className="space-y-2 mb-6">
                    {catExams.slice(0, 3).map((exam) => (
                      <Link
                        key={exam.id}
                        href={`/exam-tools/${catSlug}/${exam.slug}`}
                        className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-muted/40 hover:bg-muted text-foreground transition-colors"
                      >
                        <span className="font-medium truncate mr-2">{exam.name}</span>
                        <span className="text-secondary-text shrink-0">{exam.recruitmentCycle}</span>
                      </Link>
                    ))}
                  </div>

                  <Link
                    href={`/exam-tools/${catSlug}`}
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 px-4 bg-muted text-foreground hover:bg-primary hover:text-white font-medium rounded-xl text-sm transition-colors"
                  >
                    Explore {category} Presets <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="mb-20 bg-card border border-border rounded-3xl p-8 md:p-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Step-by-Step Workflow
          </span>
          <h2 className="font-heading text-3xl font-bold mt-2">How Document Preparation Works</h2>
          <p className="text-secondary-text text-sm mt-2">
            Complete your document adjustments in 4 simple steps without installing any software.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-start">
            <div className="w-10 h-10 rounded-xl bg-primary text-white font-bold flex items-center justify-center mb-4 text-base shadow-sm">
              1
            </div>
            <h4 className="font-semibold text-base mb-1">Choose Exam or Custom</h4>
            <p className="text-sm text-secondary-text">
              Pick your recruitment exam to load verified rules, or enter custom px/cm and KB parameters in Custom Studio.
            </p>
          </div>

          <div className="flex flex-col items-start">
            <div className="w-10 h-10 rounded-xl bg-primary text-white font-bold flex items-center justify-center mb-4 text-base shadow-sm">
              2
            </div>
            <h4 className="font-semibold text-base mb-1">Upload Photograph or Signature</h4>
            <p className="text-sm text-secondary-text">
              Drop your scanned photo or signature. Processing happens instantly on your device without leaving your browser.
            </p>
          </div>

          <div className="flex flex-col items-start">
            <div className="w-10 h-10 rounded-xl bg-primary text-white font-bold flex items-center justify-center mb-4 text-base shadow-sm">
              3
            </div>
            <h4 className="font-semibold text-base mb-1">Crop, Clean &amp; Compress</h4>
            <p className="text-sm text-secondary-text">
              Frame with the interactive aspect-ratio crop box, remove signature shadows, and let our compressor reach target KB.
            </p>
          </div>

          <div className="flex flex-col items-start">
            <div className="w-10 h-10 rounded-xl bg-primary text-white font-bold flex items-center justify-center mb-4 text-base shadow-sm">
              4
            </div>
            <h4 className="font-semibold text-base mb-1">Validate &amp; Download</h4>
            <p className="text-sm text-secondary-text">
              Inspect the real-time PASS/FAIL report against official criteria, then download your prepared file in one click.
            </p>
          </div>
        </div>
      </section>

      {/* Helpful FAQs Section */}
      <section className="mb-20 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="text-secondary-text text-sm mt-1">
            Everything you need to know about exam document guidelines and privacy.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-border rounded-2xl bg-card p-6">
              <h3 className="font-semibold text-base text-foreground mb-2 flex items-start gap-3">
                <span className="text-primary font-bold">Q.</span>
                {faq.q}
              </h3>
              <p className="text-sm text-secondary-text pl-7 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Tools & Guides */}
      <section className="border-t border-border pt-12">
        <h3 className="font-heading text-xl font-bold mb-6">Related Guides &amp; Utilities</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            href="/guides/how-to-resize-image-for-government-job-portal"
            className="p-5 rounded-xl border border-border bg-card hover:border-primary/50 transition-all flex flex-col group"
          >
            <BookOpen className="w-5 h-5 text-primary mb-2" />
            <h4 className="font-semibold text-sm group-hover:text-primary transition-colors mb-1">
              Guide: Resizing for Govt Portals
            </h4>
            <p className="text-xs text-secondary-text">
              Comprehensive walkthrough on DPI, aspect ratio, and portal upload troubleshooting.
            </p>
          </Link>

          <Link
            href="/tools/pdf/image-to-pdf"
            className="p-5 rounded-xl border border-border bg-card hover:border-primary/50 transition-all flex flex-col group"
          >
            <FileText className="w-5 h-5 text-primary mb-2" />
            <h4 className="font-semibold text-sm group-hover:text-primary transition-colors mb-1">
              Image to PDF Converter
            </h4>
            <p className="text-xs text-secondary-text">
              Convert your certificates, identity proofs, and marksheets into portal-compliant single PDFs.
            </p>
          </Link>

          <Link
            href="/blog/how-to-compress-pdf-for-government-job-portal"
            className="p-5 rounded-xl border border-border bg-card hover:border-primary/50 transition-all flex flex-col group"
          >
            <Sparkles className="w-5 h-5 text-primary mb-2" />
            <h4 className="font-semibold text-sm group-hover:text-primary transition-colors mb-1">
              Portal PDF Compression Guide
            </h4>
            <p className="text-xs text-secondary-text">
              How to bring certificates under 100 KB or 200 KB while keeping text sharp and readable.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
