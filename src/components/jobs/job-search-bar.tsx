import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface JobSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function JobSearchBar({ value, onChange, placeholder = "Search for recruitments, exams, or departments..." }: JobSearchBarProps) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-secondary-text" />
      </div>
      <Input
        type="text"
        className="pl-10 h-12 w-full text-base bg-card border-border/80 shadow-sm focus-visible:ring-primary/50"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
