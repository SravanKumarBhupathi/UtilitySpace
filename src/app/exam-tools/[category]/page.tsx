import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { EXAM_CATEGORIES, getExamsByCategory } from '@/lib/data/exams';
import { ChevronRight } from 'lucide-react';

interface Props {
  params: {
    category: string;
  };
}

export function generateMetadata({ params }: Props): Metadata {
  const normalizedCategory = params.category.replace(/-/g, ' ');
  const categoryName = EXAM_CATEGORIES.find(c => c.toLowerCase() === normalizedCategory.toLowerCase());

  if (!categoryName) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${categoryName} Exam Document Preparation | UtilitySpace`,
    description: `Resize and compress photos and signatures for ${categoryName} exams.`,
  };
}

// Generate static params for SSG
export function generateStaticParams() {
  return EXAM_CATEGORIES.map((category) => ({
    category: category.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export default function ExamCategoryPage({ params }: Props) {
  const normalizedCategory = params.category.replace(/-/g, ' ');
  const categoryName = EXAM_CATEGORIES.find(c => c.toLowerCase() === normalizedCategory.toLowerCase());

  if (!categoryName) {
    notFound();
  }

  const exams = getExamsByCategory(categoryName);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <nav className="flex items-center space-x-1 text-sm text-secondary-text mb-8">
        <Link href="/exam-tools" className="hover:text-primary transition-colors">
          Exam Tools
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{categoryName}</span>
      </nav>

      <header className="mb-10">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground mb-3">
          {categoryName} Exams
        </h1>
        <p className="text-lg text-secondary-text">
          Select your exam to automatically load the correct photo and signature requirements.
        </p>
      </header>

      {exams.length === 0 ? (
        <div className="p-8 text-center border border-border rounded-lg bg-card text-secondary-text">
          No specific exams found in this category yet. You can use our <Link href="/exam-tools/custom" className="text-primary hover:underline">Custom Tools</Link> to prepare your documents.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <Link
              key={exam.id}
              href={`/exam-tools/${params.category}/${exam.slug}`}
              className="block group"
            >
              <div className="bg-card hover:bg-card/90 border border-border rounded-xl p-6 transition-all duration-200 h-full flex flex-col hover:border-primary/50 hover:shadow-sm">
                <div className="flex items-start justify-between mb-2">
                   <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">{exam.name}</h3>
                   <span className="text-xs bg-muted px-2 py-1 rounded-md whitespace-nowrap">{exam.recruitmentCycle}</span>
                </div>
                <p className="text-sm text-secondary-text mb-4 line-clamp-2 flex-grow">{exam.organization}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                   {exam.verificationStatus === 'Verified for current cycle' ? (
                     <span className="text-[10px] uppercase font-bold tracking-wider bg-green-500/10 text-green-600 px-2 py-1 rounded">Verified Active</span>
                   ) : exam.verificationStatus === 'Historical archive' ? (
                     <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-500/10 text-amber-600 px-2 py-1 rounded">Historical</span>
                   ) : (
                     <span className="text-[10px] uppercase font-bold tracking-wider bg-muted text-secondary-text px-2 py-1 rounded">Pending</span>
                   )}
                </div>

                <div className="flex items-center text-sm font-medium text-primary">
                  Prepare Documents <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
