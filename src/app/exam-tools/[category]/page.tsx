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
              className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-all flex flex-col group"
            >
              <h3 className="font-heading text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{exam.name}</h3>
              <p className="text-sm text-secondary-text mb-4 flex-grow">{exam.organization}</p>

              <div className="text-xs font-medium text-secondary-text bg-secondary/30 self-start px-2 py-1 rounded">
                View Requirements →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
