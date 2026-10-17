"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Filter, X, BriefcaseBusiness, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JOB_DATABASE, JobRecord } from '@/lib/data/jobs';
import { JobCard } from '@/components/jobs/job-card';
import { JobSearchBar } from '@/components/jobs/job-search-bar';
import { JobFilterPanel, JobFilterState } from '@/components/jobs/job-filter-panel';
import { JobEmptyState, JobNoDataState } from '@/components/jobs/job-empty-state';
import { DocumentPreparationCTA } from '@/components/jobs/document-preparation-cta';

export default function GovernmentJobsLandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState<JobFilterState>({
    category: null,
    state: null,
    status: null
  });

  const availableCategories = useMemo(() => Array.from(new Set(JOB_DATABASE.map(j => j.category))), []);
  const availableStates = useMemo(() => Array.from(new Set(JOB_DATABASE.map(j => j.stateOrRegion))), []);

  const filteredJobs = useMemo(() => {
    return JOB_DATABASE.filter(job => {
      const matchSearch = !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.organization.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = !filters.category || job.category === filters.category;
      const matchState = !filters.state || job.stateOrRegion === filters.state;
      const matchStatus = !filters.status || job.applicationStatus === filters.status;

      return matchSearch && matchCategory && matchState && matchStatus;
    });
  }, [searchQuery, filters]);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="max-w-2xl">
          <nav className="flex items-center space-x-1 text-sm text-secondary-text mb-4">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">Government Jobs</span>
          </nav>
          <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-4 flex items-center gap-3">
             <BriefcaseBusiness className="w-8 h-8 md:w-10 md:h-10 text-primary" />
             Government Jobs
          </h1>
          <p className="text-lg text-secondary-text">
            Discover latest verified government recruitments, track application deadlines, and prepare your documents instantly.
          </p>
        </div>
        <div className="w-full md:w-96 shrink-0">
           <JobSearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between bg-card border border-border p-3 rounded-lg shadow-sm">
          <span className="font-medium text-sm">
             {filteredJobs.length} {filteredJobs.length === 1 ? 'Result' : 'Results'}
          </span>
          <Button variant="outline" size="sm" onClick={() => setIsMobileFilterOpen(true)} className="relative">
            <Filter className="w-4 h-4 mr-2" /> Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Sidebar / Filters */}
        <div className={`lg:col-span-1 space-y-8 ${isMobileFilterOpen ? 'fixed inset-0 z-50 bg-background p-6 overflow-y-auto' : 'hidden lg:block'}`}>
          {isMobileFilterOpen && (
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-xl font-bold font-heading">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileFilterOpen(false)}>
                <X className="w-6 h-6" />
              </Button>
            </div>
          )}

          <JobFilterPanel
            filters={filters}
            onFilterChange={setFilters}
            availableCategories={availableCategories}
            availableStates={availableStates}
          />

          <div className="hidden lg:block">
            <DocumentPreparationCTA />
          </div>

          {isMobileFilterOpen && (
            <Button className="w-full mt-8 lg:hidden" onClick={() => setIsMobileFilterOpen(false)}>
              Show {filteredJobs.length} Results
            </Button>
          )}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <div className="hidden lg:flex items-center justify-between mb-6 pb-2 border-b border-border/50">
            <h2 className="text-xl font-semibold font-heading text-foreground">
              {searchQuery || activeFilterCount > 0 ? 'Search Results' : 'Latest Notifications'}
            </h2>
            <span className="text-sm font-medium text-secondary-text bg-muted px-3 py-1 rounded-full">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'}
            </span>
          </div>

          {JOB_DATABASE.length === 0 ? (
            <JobNoDataState />
          ) : filteredJobs.length === 0 ? (
            <JobEmptyState onClear={() => { setSearchQuery(''); setFilters({category: null, state: null, status: null}); }} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
              {filteredJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

          <div className="mt-8 lg:hidden block">
            <DocumentPreparationCTA />
          </div>
        </div>
      </div>
    </div>
  );
}
