import Link from 'next/link';
import { Metadata } from 'next';
import { Search, Camera, PenTool, Settings, FileCheck2 } from 'lucide-react';
import { EXAM_CATEGORIES, EXAM_DATABASE } from '@/lib/data/exams';

export const metadata: Metadata = {
  title: 'Exam Document Studio',
  description: 'Prepare your exam documents in seconds. Resize, crop, compress, and validate photos and signatures for exam applications directly in your browser.',
};

export default function ExamToolsLandingPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Hero Section */}
      <section className="text-center mb-16 max-w-3xl mx-auto">
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
          Prepare Your Exam Documents in Seconds
        </h1>
        <p className="text-lg md:text-xl text-secondary-text mb-8">
          Resize, crop, compress and validate photos and signatures for exam applications — directly in your browser.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <Link
            href="#select-exam"
            className="w-full sm:w-auto px-8 py-3 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors"
          >
            Select Your Exam
          </Link>
          <Link
            href="/exam-tools/custom"
            className="w-full sm:w-auto px-8 py-3 bg-card border border-border text-foreground font-medium rounded-md hover:bg-muted transition-colors"
          >
            Custom Requirements
          </Link>
        </div>

        {/* Privacy Strip */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-secondary-text">
          <span className="flex items-center gap-1.5"><FileCheck2 className="w-4 h-4 text-success" /> Free to use</span>
          <span className="flex items-center gap-1.5"><FileCheck2 className="w-4 h-4 text-success" /> No account required</span>
          <span className="flex items-center gap-1.5"><FileCheck2 className="w-4 h-4 text-success" /> Your files stay on your device</span>
        </div>
      </section>

      {/* Select Exam Section */}
      <section id="select-exam" className="mb-16">
        <h2 className="font-heading text-2xl font-semibold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {EXAM_CATEGORIES.map((category) => {
            const count = EXAM_DATABASE.filter(e => e.category === category).length;
            return (
              <Link
                key={category}
                href={`/exam-tools/${category.toLowerCase().replace(/\s+/g, '-')}`}
                className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 hover:shadow-sm transition-all text-center flex flex-col items-center justify-center min-h-[100px]"
              >
                <span className="font-medium text-foreground mb-1">{category}</span>
                <span className="text-xs text-secondary-text">{count} Exams</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Popular Exams */}
      <section className="mb-16">
        <h2 className="font-heading text-2xl font-semibold mb-6">Popular Exams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXAM_DATABASE.slice(0, 6).map((exam) => (
            <Link
              key={exam.id}
              href={`/exam-tools/${exam.category.toLowerCase().replace(/\s+/g, '-')}/${exam.slug}`}
              className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-all flex flex-col"
            >
              <div className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">{exam.category}</div>
              <h3 className="font-heading text-lg font-semibold mb-1">{exam.name}</h3>
              <p className="text-sm text-secondary-text line-clamp-2">{exam.organization}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Tools */}
      <section className="mb-16">
        <h2 className="font-heading text-2xl font-semibold mb-6">Quick Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/exam-tools/custom?type=photo" className="flex items-start gap-4 p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-all">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Prepare Photo</h3>
              <p className="text-sm text-secondary-text">Resize, crop, and compress passport photos with custom requirements.</p>
            </div>
          </Link>
          <Link href="/exam-tools/custom?type=signature" className="flex items-start gap-4 p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-all">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <PenTool className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Prepare Signature</h3>
              <p className="text-sm text-secondary-text">Clean up, resize, and compress signature images for uploads.</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
