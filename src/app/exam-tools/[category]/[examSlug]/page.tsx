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

  const reqs = exam.requirements.photo || exam.requirements.signature;
  const dims = reqs && reqs.width && reqs.height ? `${reqs.width}x${reqs.height}px` : 'exact dimensions';
  const size = reqs ? `${reqs.minKB}-${reqs.maxKB}KB` : 'required size';

  return {
    title: `${exam.name} Photo & Signature Resizer | UtilitySpace`,
    description: `Prepare your application documents for ${exam.name} ${exam.recruitmentCycle} (${exam.organization}). Resize to ${dims} and compress to ${size} as per the official notification.`,
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
          <span className="text-sm bg-primary/10 px-2 py-0.5 rounded font-medium">{exam.recruitmentCycle}</span>
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
          {exam.name} Document Requirements
        </h1>
        <p className="text-lg text-secondary-text">
          {exam.organization}
        </p>

        {exam.notes && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm text-secondary-text border border-border flex items-start gap-3">
             <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
             <p>{exam.notes}</p>
          </div>
        )}
      </header>

      {/* Verification Status Banner */}
      <div className={`mb-8 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border ${
        exam.verificationStatus === 'Verified for current cycle'
          ? 'bg-green-500/10 border-green-500/20 text-green-800 dark:text-green-300'
          : 'bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300'
      }`}>
        <div className="flex items-start gap-3">
          {exam.verificationStatus === 'Verified for current cycle' ? (
            <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="font-semibold">{exam.verificationStatus}</p>
            <p className="text-sm opacity-80">Last verified: {new Date(exam.lastVerified).toLocaleDateString()}</p>
          </div>
        </div>
        {exam.sourceUrl && (
          <a
            href={exam.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm font-medium hover:underline shrink-0"
          >
            Official Source <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        )}
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
