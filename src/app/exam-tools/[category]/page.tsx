import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  EXAM_CATEGORIES,
  CATEGORY_DESCRIPTIONS,
  getExamsByCategory,
  categoryToSlug,
  slugToCategory,
} from '@/lib/data/exams';
import {
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  SlidersHorizontal,
  ArrowRight,
  Camera,
  PenTool,
  Lock,
} from 'lucide-react';

interface Props {
  params: {
    category: string;
  };
}

export function generateMetadata({ params }: Props): Metadata {
  const categoryName = slugToCategory(params.category);

  if (!categoryName) {
    return { title: 'Category Not Found | UtilitySpace' };
  }

  const title = `${categoryName} Exam Document Preparation – Photo & Signature Presets | UtilitySpace`;
  const description = `Prepare, resize, and compress photos and signatures for ${categoryName} exams according to official government recruitment notifications. 100% free and client-side private.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://utilityspace.online/exam-tools/${params.category}`,
    },
    openGraph: {
      title,
      description,
      url: `https://utilityspace.online/exam-tools/${params.category}`,
      siteName: 'UtilitySpace',
      type: 'website',
    },
  };
}

// Generate static params for SSG
export function generateStaticParams() {
  return EXAM_CATEGORIES.map((category) => ({
    category: categoryToSlug(category),
  }));
}

export default function ExamCategoryPage({ params }: Props) {
  const categoryName = slugToCategory(params.category);

  if (!categoryName) {
    notFound();
  }

  const exams = getExamsByCategory(categoryName);
  const description = CATEGORY_DESCRIPTIONS[categoryName];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} Exam Document Preparation — UtilitySpace`,
    description,
    url: `https://utilityspace.online/exam-tools/${params.category}`,
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-secondary-text mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/exam-tools" className="hover:text-primary transition-colors">
          Exam Tools
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">{categoryName}</span>
      </nav>

      {/* Header */}
      <header className="mb-10 pb-6 border-b border-border">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" /> Verified Category Presets
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
          {categoryName} Exam Document Preparation
        </h1>
        <p className="text-base md:text-lg text-secondary-text max-w-3xl leading-relaxed">
          {description}
        </p>
      </header>

      {/* Exam Presets Grid */}
      {exams.length === 0 ? (
        <div className="p-12 text-center border border-border rounded-2xl bg-card text-secondary-text max-w-xl mx-auto">
          <p className="mb-4">
            No exams are currently active in this category. You can use our Custom Document Studio to prepare documents for any application.
          </p>
          <Link
            href="/exam-tools/studio"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-medium rounded-xl text-sm"
          >
            <SlidersHorizontal className="w-4 h-4" /> Open Custom Studio
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-card hover:bg-card/90 border border-border rounded-2xl p-6 transition-all duration-200 flex flex-col hover:border-primary/50 hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs bg-muted px-2.5 py-1 rounded-md font-semibold text-secondary-text">
                  {exam.recruitmentCycle}
                </span>
                <span
                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    exam.verificationStatus === 'Verified for current cycle'
                      ? 'bg-success/15 text-success'
                      : exam.verificationStatus === 'Verification pending'
                      ? 'bg-amber-500/15 text-amber-600'
                      : 'bg-muted text-secondary-text'
                  }`}
                >
                  {exam.verificationStatus === 'Historical archive'
                    ? `Historical Archive (${exam.recruitmentCycle})`
                    : exam.verificationStatus}
                </span>
              </div>

              <h2 className="font-heading font-bold text-xl text-foreground mb-1">
                {exam.name}
              </h2>
              <p className="text-xs font-medium text-primary mb-3">{exam.organization}</p>
              <p className="text-xs text-secondary-text mb-6 flex-grow leading-relaxed line-clamp-3">
                {exam.notes || 'Officially verified recruitment notification specifications.'}
              </p>

              {/* Document Type CTAs */}
              <div className="space-y-2 pt-4 border-t border-border/60">
                <Link
                  href={`/exam-tools/${params.category}/${exam.slug}`}
                  className="w-full flex items-center justify-between py-2 px-3 rounded-lg bg-muted/60 hover:bg-muted text-foreground text-xs font-semibold transition-colors"
                >
                  <span>View All Requirements</span>
                  <ChevronRight className="w-4 h-4 text-secondary-text" />
                </Link>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {exam.requirements.photo && (
                    <Link
                      href={`/exam-tools/studio?exam=${exam.id}&type=photo`}
                      className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary text-xs font-semibold transition-colors text-center"
                    >
                      <Camera className="w-3.5 h-3.5" /> Photo
                    </Link>
                  )}
                  {exam.requirements.signature && (
                    <Link
                      href={`/exam-tools/studio?exam=${exam.id}&type=signature`}
                      className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary text-xs font-semibold transition-colors text-center"
                    >
                      <PenTool className="w-3.5 h-3.5" /> Signature
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Studio Banner */}
      <div className="p-8 rounded-3xl bg-muted/30 border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-heading font-bold text-xl text-foreground mb-1">
            Need custom dimensions or another exam?
          </h3>
          <p className="text-sm text-secondary-text">
            Use our general-purpose Custom Document Studio to resize photos or signatures to exact mm, cm, px, and KB limits.
          </p>
        </div>
        <Link
          href="/exam-tools/studio"
          className="px-6 py-3 bg-primary text-white font-semibold rounded-xl text-sm shrink-0 hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
        >
          <SlidersHorizontal className="w-4 h-4" /> Open Custom Studio
        </Link>
      </div>
    </div>
  );
}
