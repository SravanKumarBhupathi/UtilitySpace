import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { EXAM_DATABASE, getExamBySlug } from '@/lib/data/exams';
import { ChevronRight, ExternalLink, ShieldCheck, AlertCircle, Info } from 'lucide-react';

interface Props {
  params: {
    category: string;
    examSlug: string;
  };
}

export function generateMetadata({ params }: Props): Metadata {
  const exam = getExamBySlug(params.examSlug);

  if (!exam) {
    return { title: 'Exam Not Found' };
  }

  return {
    title: `${exam.name} Photo & Signature Resizer | UtilitySpace`,
    description: `Prepare your photo and signature for ${exam.name} (${exam.organization}). Get exact ${exam.requirements.photo.width}x${exam.requirements.photo.height}px and ${exam.requirements.photo.minKB}-${exam.requirements.photo.maxKB}KB files.`,
  };
}

export function generateStaticParams() {
  return EXAM_DATABASE.map((exam) => ({
    category: exam.category.toLowerCase().replace(/\s+/g, '-'),
    examSlug: exam.slug,
  }));
}

export default function ExamRequirementsPage({ params }: Props) {
  const exam = getExamBySlug(params.examSlug);

  if (!exam) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <nav className="flex flex-wrap items-center space-x-1 text-sm text-secondary-text mb-8">
        <Link href="/exam-tools" className="hover:text-primary transition-colors">
          Exam Tools
        </Link>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        <Link href={`/exam-tools/${params.category}`} className="hover:text-primary transition-colors">
          {exam.category}
        </Link>
        <ChevronRight className="h-4 w-4 flex-shrink-0" />
        <span className="text-foreground font-medium truncate">{exam.name}</span>
      </nav>

      <header className="mb-10 pb-6 border-b border-border">
        <div className="flex items-center gap-3 mb-2 text-primary">
          <span className="text-sm font-semibold uppercase tracking-wider">{exam.category}</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
          {exam.name} Document Requirements
        </h1>
        <p className="text-lg text-secondary-text">
          {exam.organization}
        </p>

        {exam.notes && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm text-secondary-text border border-border">
            {exam.notes}
          </div>
        )}
      </header>

      {/* Verification Status Banner */}
      <div className={`mb-8 p-4 rounded-lg flex items-start gap-3 border ${
        exam.verificationStatus === 'Verified'
          ? 'bg-success/10 border-success/20 text-success-foreground'
          : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400'
      }`}>
        {exam.verificationStatus === 'Verified' ? (
          <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        )}
        <div className="text-sm">
          <p className="font-semibold mb-1">
            Status: {exam.verificationStatus}
            <span className="text-opacity-70 font-normal ml-2">(Last checked: {exam.lastVerified})</span>
          </p>
          <p className="opacity-90">
            {exam.verificationStatus === 'Verified'
              ? 'These requirements match the official notification.'
              : 'Please double-check these requirements with the current official notification.'}
          </p>
          {exam.sourceUrl && (
            <a
              href={exam.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-primary hover:underline font-medium"
            >
              Official Website <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Photo Card */}
        {exam.requirements.photo && (
          <div className="border border-border rounded-xl bg-card overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border bg-muted/30">
              <h2 className="font-heading text-xl font-semibold flex items-center gap-2">
                Photograph
              </h2>
            </div>
            <div className="p-6 flex-grow space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-y-3">
                <span className="text-secondary-text">Format</span>
                <span className="font-medium uppercase">{exam.requirements.photo.format.join(', ')}</span>

                <span className="text-secondary-text">Dimensions</span>
                <span className="font-medium">{exam.requirements.photo.width} × {exam.requirements.photo.height} {exam.requirements.photo.unit}</span>

                <span className="text-secondary-text">File Size</span>
                <span className="font-medium">{exam.requirements.photo.minKB} KB – {exam.requirements.photo.maxKB} KB</span>

                {exam.requirements.photo.backgroundRequirement && (
                  <>
                    <span className="text-secondary-text">Background</span>
                    <span className="font-medium">{exam.requirements.photo.backgroundRequirement}</span>
                  </>
                )}
              </div>

              {(exam.requirements.photo.nameRequired || exam.requirements.photo.dateRequired || exam.requirements.photo.notes) && (
                <div className="pt-4 border-t border-border/50">
                  <div className="flex gap-2 items-start text-secondary-text">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      {exam.requirements.photo.nameRequired && <div className="text-foreground">Name must be printed on photo.</div>}
                      {exam.requirements.photo.dateRequired && <div className="text-foreground">Date must be printed on photo.</div>}
                      {exam.requirements.photo.notes && <div className="mt-1">{exam.requirements.photo.notes}</div>}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 bg-muted/20 border-t border-border">
              <Link
                href={`/exam-tools/studio?exam=${exam.id}&type=photo`}
                className="block w-full py-3 px-4 bg-primary text-white text-center font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                Prepare Photo
              </Link>
            </div>
          </div>
        )}

        {/* Signature Card */}
        {exam.requirements.signature && (
          <div className="border border-border rounded-xl bg-card overflow-hidden flex flex-col">
            <div className="p-6 border-b border-border bg-muted/30">
              <h2 className="font-heading text-xl font-semibold flex items-center gap-2">
                Signature
              </h2>
            </div>
            <div className="p-6 flex-grow space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-y-3">
                <span className="text-secondary-text">Format</span>
                <span className="font-medium uppercase">{exam.requirements.signature.format.join(', ')}</span>

                <span className="text-secondary-text">Dimensions</span>
                <span className="font-medium">{exam.requirements.signature.width} × {exam.requirements.signature.height} {exam.requirements.signature.unit}</span>

                <span className="text-secondary-text">File Size</span>
                <span className="font-medium">{exam.requirements.signature.minKB} KB – {exam.requirements.signature.maxKB} KB</span>

                {exam.requirements.signature.backgroundRequirement && (
                  <>
                    <span className="text-secondary-text">Requirements</span>
                    <span className="font-medium">{exam.requirements.signature.backgroundRequirement}</span>
                  </>
                )}
              </div>

              {exam.requirements.signature.notes && (
                <div className="pt-4 border-t border-border/50">
                  <div className="flex gap-2 items-start text-secondary-text">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="mt-0.5">{exam.requirements.signature.notes}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 bg-muted/20 border-t border-border">
              <Link
                href={`/exam-tools/studio?exam=${exam.id}&type=signature`}
                className="block w-full py-3 px-4 bg-primary text-white text-center font-medium rounded-md hover:bg-primary/90 transition-colors"
              >
                Prepare Signature
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
