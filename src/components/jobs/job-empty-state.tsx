import React from 'react';
import { SearchX, FileText, BriefcaseBusiness } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function JobEmptyState({ onClear }: { onClear?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border rounded-xl bg-card">
      <SearchX className="w-12 h-12 text-secondary-text mb-4 opacity-50" />
      <h3 className="text-xl font-bold mb-2">No jobs found</h3>
      <p className="text-secondary-text max-w-md mx-auto mb-6">
        We couldn&apos;t find any official recruitments matching your current filters. Try adjusting your search criteria or check back later.
      </p>
      {onClear && (
        <Button variant="outline" onClick={onClear}>
          Clear All Filters
        </Button>
      )}
    </div>
  );
}

export function JobNoDataState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-border rounded-xl bg-card">
      <BriefcaseBusiness className="w-16 h-16 text-primary mb-4 opacity-80" />
      <h3 className="text-2xl font-heading font-bold mb-3">Recruitment Database Updates</h3>
      <p className="text-secondary-text max-w-lg mx-auto mb-6">
        We&apos;re preparing verified recruitment notifications. Please check back soon.
      </p>
      <Link href="/">
         <Button>Browse Job Categories</Button>
      </Link>
    </div>
  );
}
