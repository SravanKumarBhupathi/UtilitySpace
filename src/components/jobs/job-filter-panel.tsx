import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export type JobFilterState = {
  category: string | null;
  state: string | null;
  status: string | null;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 px-2 text-xs">
          Clear All
        </Button>
      </div>

      <div className="space-y-3">
        <Label className="text-sm text-secondary-text uppercase tracking-wider">Recruitment Status</Label>
        <div className="space-y-2">
          {['Applications Open', 'Upcoming', 'Closing Soon', 'Closed'].map(status => (
            <label key={status} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={filters.status === status}
                onChange={() => onFilterChange({...filters, status: filters.status === status ? null : status})}
                onClick={() => { if(filters.status === status) onFilterChange({...filters, status: null}) }}
                className="accent-primary"
              />
              <span>{status}</span>
            </label>
          ))}
        </div>
      </div>

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
    </div>
  );
}
