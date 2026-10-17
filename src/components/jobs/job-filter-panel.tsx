import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ApplicationStatus, JobCategory } from '@/lib/data/jobs';

export type JobFilterState = {
  category: JobCategory | string | null;
  state: string | null;
  status: ApplicationStatus | null;
};

interface JobFilterPanelProps {
  filters: JobFilterState;
  onFilterChange: (filters: JobFilterState) => void;
  availableCategories: string[];
  availableStates: string[];
}

export function JobFilterPanel({ filters, onFilterChange, availableCategories, availableStates }: JobFilterPanelProps) {

  const handleReset = () => {
    onFilterChange({ category: null, state: null, status: null });
  };

  const statusLabels: Record<ApplicationStatus, string> = {
    'open': 'Application Open',
    'upcoming': 'Upcoming',
    'closing_soon': 'Closing Soon',
    'closed': 'Application Closed',
    'archived': 'Archived',
    'unverified': 'Unverified'
  };

  const visibleStatuses: ApplicationStatus[] = ['open', 'upcoming', 'closing_soon', 'closed'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 px-2 text-xs">
          Clear All
        </Button>
      </div>

      <div className="space-y-3">
        <Label className="text-sm text-secondary-text uppercase tracking-wider">Application Status</Label>
        <div className="space-y-2">
          {visibleStatuses.map(status => (
            <label key={status} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={filters.status === status}
                onChange={() => onFilterChange({...filters, status: filters.status === status ? null : status})}
                onClick={() => { if(filters.status === status) onFilterChange({...filters, status: null}) }}
                className="accent-primary"
              />
              <span>{statusLabels[status]}</span>
            </label>
          ))}
        </div>
      </div>

      {availableCategories.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm text-secondary-text uppercase tracking-wider">Category</Label>
          <div className="space-y-2">
            {availableCategories.map(cat => (
              <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === cat}
                  onChange={() => onFilterChange({...filters, category: filters.category === cat ? null : cat})}
                  onClick={() => { if(filters.category === cat) onFilterChange({...filters, category: null}) }}
                  className="accent-primary"
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {availableStates.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm text-secondary-text uppercase tracking-wider">State / Region</Label>
          <div className="space-y-2">
            {availableStates.map(state => (
              <label key={state} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="state"
                  checked={filters.state === state}
                  onChange={() => onFilterChange({...filters, state: filters.state === state ? null : state})}
                  onClick={() => { if(filters.state === state) onFilterChange({...filters, state: null}) }}
                  className="accent-primary"
                />
                <span>{state}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
