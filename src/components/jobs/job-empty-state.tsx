import React from 'react';
import { SearchX, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      <FileText className="w-16 h-16 text-primary mb-4 opacity-80" />
      <h3 className="text-2xl font-heading font-bold mb-3">Recruitment Database Updates</h3>
      <p className="text-secondary-text max-w-lg mx-auto mb-6">
        We are currently verifying official government recruitment notifications. Only verified data is published to ensure you receive accurate and trustworthy application requirements.
      </p>
    </div>
  );
}
