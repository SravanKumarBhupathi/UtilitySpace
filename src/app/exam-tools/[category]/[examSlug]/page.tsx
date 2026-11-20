import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  EXAM_DATABASE,
  getExamBySlug,
  categoryToSlug,
  slugToCategory,
} from '@/lib/data/exams';
import {
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Info,
  Camera,
  PenTool,
  Fingerprint,
  FileText,
  SlidersHorizontal,
  Lock,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  params: {
    category: string;
    examSlug: string;
  };
}

export function generateMetadata({ params }: Props): Metadata {
  const exam = getExamBySlug(params.examSlug);

  if (!exam) {
    return { title: 'Exam Not Found | UtilitySpace' };
  }

  const reqs = exam.requirements.photo || exam.requirements.signature;
  const dims =
    reqs && reqs.width && reqs.height
      ? `${reqs.width}×${reqs.height} ${reqs.unit}`
      : 'official dimensions';
  const size =
    reqs && reqs.maxKB > 0 ? `${reqs.minKB}–${reqs.maxKB} KB` : 'required file size';

  const title = `${exam.name} Photo & Signature Resizer (${exam.recruitmentCycle} Archive) | UtilitySpace`;
  const description = `Historical archive requirements and resizer for ${exam.name} (${exam.recruitmentCycle} recruitment cycle archive, ${exam.organization}). Verified requirements: ${dims}, ${size}. 100% private in-browser processing.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://utilityspace.online/exam-tools/${params.category}/${params.examSlug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://utilityspace.online/exam-tools/${params.category}/${params.examSlug}`,
      siteName: 'UtilitySpace',
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return EXAM_DATABASE.map((exam) => ({
    category: categoryToSlug(exam.category),
    examSlug: exam.slug,
  }));
}

export default function ExamRequirementsPage({ params }: Props) {
  const exam = getExamBySlug(params.examSlug);

  if (!exam) {
    notFound();
  }

  const categorySlug = categoryToSlug(exam.category);

  // Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: `${exam.name} Document Preparation — UtilitySpace`,
    description: `Official document preparation tool for ${exam.name} (${exam.organization}).`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://utilityspace.online',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Exam Tools',
        item: 'https://utilityspace.online/exam-tools',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: exam.category,
        item: `https://utilityspace.online/exam-tools/${categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: exam.name,
        item: `https://utilityspace.online/exam-tools/${categorySlug}/${exam.slug}`,
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex flex-wrap items-center space-x-2 text-sm text-secondary-text mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 shrink-0" />
        <Link href="/exam-tools" className="hover:text-primary transition-colors">
          Exam Tools
        </Link>
        <ChevronRight className="w-4 h-4 shrink-0" />
        <Link
          href={`/exam-tools/${categorySlug}`}
          className="hover:text-primary transition-colors"
        >
          {exam.category}
        </Link>
        <ChevronRight className="w-4 h-4 shrink-0" />
        <span className="text-foreground font-medium truncate">{exam.name}</span>
      </nav>

      {/* Header */}
      <header className="mb-8 pb-6 border-b border-border">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            {exam.category}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-secondary-text">
            Cycle: {exam.recruitmentCycle}
          </span>
          {exam.notificationNumber && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-secondary-text">
              Notice: {exam.notificationNumber}
            </span>
          )}
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
          {exam.name} Document Requirements &amp; Resizer
        </h1>
        <p className="text-base text-secondary-text">{exam.organization}</p>

        {exam.notes && (
          <div className="mt-5 p-4 rounded-2xl bg-muted/40 border border-border text-sm text-secondary-text flex items-start gap-3">
            <Info className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
            <p className="leading-relaxed">{exam.notes}</p>
          </div>
        )}
      </header>

      {/* Official Verification Status Banner */}
      <div className="mb-10 p-5 rounded-2xl border bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              exam.verificationStatus === 'Verified for current cycle' ||
              exam.verificationStatus === 'Historical archive'
                ? 'bg-success/15 text-success'
                : 'bg-amber-500/15 text-amber-600'
            }`}
          >
            {exam.verificationStatus === 'Verified for current cycle' ||
            exam.verificationStatus === 'Historical archive' ? (
              <ShieldCheck className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">
                {exam.verificationStatus === 'Historical archive'
                  ? `Historical Archive Notification (${exam.recruitmentCycle})`
                  : exam.verificationStatus}
              </span>
            </div>
            <p className="text-xs text-secondary-text mt-0.5 leading-relaxed">
              Verified against official notification {exam.notificationNumber ? `(${exam.notificationNumber})` : ''} on {exam.lastVerified}. If applying for a newer recruitment cycle, please cross-verify with the current notification on {exam.organization}&apos;s official portal before uploading.
            </p>
          </div>
        </div>

        {exam.sourceUrl && (
          <a
            href={exam.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-primary hover:text-white transition-colors shrink-0 text-foreground"
          >
            <span>Official Portal / Notice</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Document Specification Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Photograph Card */}
        {exam.requirements.photo && (
          <div className="border border-border rounded-2xl bg-card overflow-hidden flex flex-col shadow-sm">
            <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <h2 className="font-heading text-lg font-bold">Photograph</h2>
              </div>
              {exam.requirements.photo.liveCaptureRequired && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600">
                  Live Webcam Capture
                </span>
              )}
            </div>

            <div className="p-6 flex-grow space-y-4 text-xs">
              {exam.requirements.photo.liveCaptureRequired ? (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 leading-relaxed">
                  <p className="font-semibold text-sm mb-1">Live Capture Mandatory</p>
                  <p>
                    {exam.name} portal requires live photograph capture via webcam or the official application.
                    Do not upload a scanned photo. Scanned uploads will be rejected.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  <div className="py-2.5 flex justify-between">
                    <span className="text-secondary-text">Format</span>
                    <span className="font-semibold uppercase text-foreground">
                      {exam.requirements.photo.format.join(', ')}
                    </span>
                  </div>

                  <div className="py-2.5 flex justify-between">
                    <span className="text-secondary-text">Dimensions</span>
                    <span className="font-semibold text-foreground">
                      {exam.requirements.photo.width
                        ? `${exam.requirements.photo.width} × ${exam.requirements.photo.height} ${exam.requirements.photo.unit}`
                        : 'Specified in notification'}
                    </span>
                  </div>

                  <div className="py-2.5 flex justify-between">
                    <span className="text-secondary-text">File Size Limit</span>
                    <span className="font-semibold text-foreground">
                      {exam.requirements.photo.minKB} KB – {exam.requirements.photo.maxKB} KB
                    </span>
                  </div>

                  {exam.requirements.photo.backgroundRequirement && (
                    <div className="py-2.5 flex justify-between gap-4">
                      <span className="text-secondary-text shrink-0">Background</span>
                      <span className="font-semibold text-foreground text-right">
                        {exam.requirements.photo.backgroundRequirement}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Special Instructions */}
              {(exam.requirements.photo.nameRequired ||
                exam.requirements.photo.dateRequired ||
                exam.requirements.photo.notes) && (
                <div className="pt-3 border-t border-border/60 text-secondary-text space-y-1">
                  {exam.requirements.photo.nameRequired && (
                    <div className="flex items-center gap-1.5 text-foreground font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      Candidate name must be printed at bottom.
                    </div>
                  )}
                  {exam.requirements.photo.dateRequired && (
                    <div className="flex items-center gap-1.5 text-foreground font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      Date of photograph capture must be printed at bottom.
                    </div>
                  )}
                  {exam.requirements.photo.notes && (
                    <p className="mt-1 leading-relaxed">{exam.requirements.photo.notes}</p>
                  )}
                </div>
              )}
            </div>

            <div className="p-5 bg-muted/20 border-t border-border">
              {exam.requirements.photo.liveCaptureRequired ? (
                <div className="text-center text-xs text-secondary-text py-1">
                  Live photo captured directly on official portal.
                </div>
              ) : (
                <Link
                  href={`/exam-tools/studio?exam=${exam.id}&type=photo`}
                  className="block w-full py-3 px-4 bg-primary text-white text-center font-semibold text-sm rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
                >
                  Prepare Photo in Studio
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Signature Card */}
        {exam.requirements.signature && (
          <div className="border border-border rounded-2xl bg-card overflow-hidden flex flex-col shadow-sm">
            <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <PenTool className="w-5 h-5" />
                </div>
                <h2 className="font-heading text-lg font-bold">Signature</h2>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-success/15 text-success">
                Upload Required
              </span>
            </div>

            <div className="p-6 flex-grow space-y-4 text-xs">
              <div className="divide-y divide-border/60">
                <div className="py-2.5 flex justify-between">
                  <span className="text-secondary-text">Format</span>
                  <span className="font-semibold uppercase text-foreground">
                    {exam.requirements.signature.format.join(', ')}
                  </span>
                </div>

                <div className="py-2.5 flex justify-between">
                  <span className="text-secondary-text">Dimensions</span>
                  <span className="font-semibold text-foreground">
                    {exam.requirements.signature.width
                      ? `${exam.requirements.signature.width} × ${exam.requirements.signature.height} ${exam.requirements.signature.unit}`
                      : 'Specified in notification'}
                  </span>
                </div>

                <div className="py-2.5 flex justify-between">
                  <span className="text-secondary-text">File Size Limit</span>
                  <span className="font-semibold text-foreground">
                    {exam.requirements.signature.minKB} KB – {exam.requirements.signature.maxKB} KB
                  </span>
                </div>

                {exam.requirements.signature.backgroundRequirement && (
                  <div className="py-2.5 flex justify-between gap-4">
                    <span className="text-secondary-text shrink-0">Paper / Ink</span>
                    <span className="font-semibold text-foreground text-right">
                      {exam.requirements.signature.backgroundRequirement}
                    </span>
                  </div>
                )}
              </div>

              {exam.requirements.signature.notes && (
                <div className="pt-3 border-t border-border/60 text-secondary-text leading-relaxed">
                  {exam.requirements.signature.notes}
                </div>
              )}
            </div>

            <div className="p-5 bg-muted/20 border-t border-border">
              <Link
                href={`/exam-tools/studio?exam=${exam.id}&type=signature`}
                className="block w-full py-3 px-4 bg-primary text-white text-center font-semibold text-sm rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
              >
                Prepare Signature in Studio
              </Link>
            </div>
          </div>
        )}

        {/* Left Thumb Impression Card (if specified) */}
        {exam.requirements.thumb_impression && (
          <div className="border border-border rounded-2xl bg-card overflow-hidden flex flex-col shadow-sm">
            <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <h2 className="font-heading text-lg font-bold">Left Thumb Impression</h2>
              </div>
            </div>

            <div className="p-6 flex-grow space-y-4 text-xs">
              <div className="divide-y divide-border/60">
                <div className="py-2.5 flex justify-between">
                  <span className="text-secondary-text">Format</span>
                  <span className="font-semibold uppercase text-foreground">
                    {exam.requirements.thumb_impression.format.join(', ')}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-secondary-text">Dimensions</span>
                  <span className="font-semibold text-foreground">
                    {exam.requirements.thumb_impression.width} ×{' '}
                    {exam.requirements.thumb_impression.height}{' '}
                    {exam.requirements.thumb_impression.unit}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-secondary-text">File Size Limit</span>
                  <span className="font-semibold text-foreground">
                    {exam.requirements.thumb_impression.minKB} KB –{' '}
                    {exam.requirements.thumb_impression.maxKB} KB
                  </span>
                </div>
              </div>
              {exam.requirements.thumb_impression.notes && (
                <div className="pt-3 border-t border-border/60 text-secondary-text">
                  {exam.requirements.thumb_impression.notes}
                </div>
              )}
            </div>

            <div className="p-5 bg-muted/20 border-t border-border">
              <Link
                href={`/exam-tools/studio?exam=${exam.id}&type=signature`}
                className="block w-full py-3 px-4 bg-muted hover:bg-primary hover:text-white text-center font-semibold text-sm rounded-xl transition-colors"
              >
                Prepare Thumb Impression
              </Link>
            </div>
          </div>
        )}

        {/* Handwritten Declaration Card (if specified) */}
        {exam.requirements.handwritten_declaration && (
          <div className="border border-border rounded-2xl bg-card overflow-hidden flex flex-col shadow-sm">
            <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="font-heading text-lg font-bold">Handwritten Declaration</h2>
              </div>
            </div>

            <div className="p-6 flex-grow space-y-4 text-xs">
              <div className="divide-y divide-border/60">
                <div className="py-2.5 flex justify-between">
                  <span className="text-secondary-text">Format</span>
                  <span className="font-semibold uppercase text-foreground">
                    {exam.requirements.handwritten_declaration.format.join(', ')}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-secondary-text">Dimensions</span>
                  <span className="font-semibold text-foreground">
                    {exam.requirements.handwritten_declaration.width} ×{' '}
                    {exam.requirements.handwritten_declaration.height}{' '}
                    {exam.requirements.handwritten_declaration.unit}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-secondary-text">File Size Limit</span>
                  <span className="font-semibold text-foreground">
                    {exam.requirements.handwritten_declaration.minKB} KB –{' '}
                    {exam.requirements.handwritten_declaration.maxKB} KB
                  </span>
                </div>
              </div>
              {exam.requirements.handwritten_declaration.notes && (
                <div className="pt-3 border-t border-border/60 text-secondary-text">
                  {exam.requirements.handwritten_declaration.notes}
                </div>
              )}
            </div>

            <div className="p-5 bg-muted/20 border-t border-border">
              <Link
                href={`/exam-tools/studio?exam=${exam.id}&type=signature`}
                className="block w-full py-3 px-4 bg-muted hover:bg-primary hover:text-white text-center font-semibold text-sm rounded-xl transition-colors"
              >
                Prepare Declaration
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Disclaimer Box */}
      <div className="p-5 rounded-2xl bg-muted/30 border border-border text-xs text-secondary-text mb-12 flex items-start gap-3">
        <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-foreground block mb-0.5">Official Authority Disclaimer:</span>
          UtilitySpace prepares and checks files against the displayed requirements. Final
          acceptance is determined by the official examination authority. Always verify your application
          preview before final submission.
        </div>
      </div>

      {/* Cross Linking & Related Tools */}
      <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href={`/exam-tools/${categorySlug}`}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <ChevronRight className="w-3.5 h-3.5 rotate-180" /> Back to all {exam.category} exams
        </Link>
        <Link
          href="/exam-tools/studio"
          className="text-xs font-semibold text-secondary-text hover:text-foreground flex items-center gap-1"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" /> Open Custom Document Studio
        </Link>
      </div>
    </div>
  );
}
