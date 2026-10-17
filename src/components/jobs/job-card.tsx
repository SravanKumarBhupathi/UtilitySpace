import React from 'react';
import Link from 'next/link';
import { JobRecord } from '@/lib/data/jobs';
import { ShieldCheck, Share2, AlertCircle, MapPin, Calendar, Users, GraduationCap, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

export function JobCard({ job }: { job: JobRecord }) {
  const isClosingSoon = job.applicationStatus === 'closing_soon';
  const isOpen = job.applicationStatus === 'open';

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const eligibilitySummary = job.qualificationSummary.length > 0
      ? job.qualificationSummary.join(', ')
      : 'See official notification';

    const vacancyCount = job.vacancyCount !== null
      ? job.vacancyCount.toLocaleString()
      : 'See official notification';

    const deadline = job.applicationDeadline
      ? new Date(job.applicationDeadline).toLocaleDateString()
      : 'Check official notification';

    const applyLinkText = job.applicationPortalUrl
      ? `

📝 Apply Link:
${job.applicationPortalUrl}`
      : '';

    const message = `📢 ${job.title}

🏢 Organization: ${job.organization}

🎓 Eligibility: ${eligibilitySummary}

📌 Vacancies: ${vacancyCount}

📅 Last Date to Apply: ${deadline}

🔗 Full Job Details:
https://utilityspace.online/government-jobs/${job.slug}${applyLinkText}

Please verify eligibility and important dates in the official notification before applying.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <Card className="flex flex-col h-full hover:border-primary/50 transition-colors group">
      <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
        <div className="flex justify-between items-start mb-2 gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text">{job.organization}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wider uppercase whitespace-nowrap ${
            isOpen ? 'bg-green-500/10 text-green-600' :
            isClosingSoon ? 'bg-amber-500/10 text-amber-600' :
            'bg-secondary/20 text-secondary-foreground'
          }`}>
            {job.applicationStatus}
          </span>
        </div>
        <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
          {job.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4 flex-grow space-y-3 text-sm">
        <div className="flex items-center text-secondary-text">
          <MapPin className="w-4 h-4 mr-2 shrink-0" />
          <span className="truncate">{job.stateOrRegion}</span>
        </div>

        {job.vacancyCount !== null && (
          <div className="flex items-center text-secondary-text">
            <Users className="w-4 h-4 mr-2 shrink-0" />
            <span>{job.vacancyCount.toLocaleString()} Vacancies</span>
          </div>
        )}

        <div className="flex items-start text-secondary-text">
          <GraduationCap className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
          <span className="line-clamp-2">{job.qualificationSummary.join(', ')}</span>
        </div>

        {job.applicationDeadline && (
          <div className={`flex items-center mt-2 font-medium ${isClosingSoon ? 'text-amber-600' : 'text-secondary-text'}`}>
            <Calendar className="w-4 h-4 mr-2 shrink-0" />
            <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
          </div>
        )}
      </CardContent>

<CardFooter className="pt-4 pb-4 border-t border-border/50 flex flex-col items-stretch gap-3 bg-muted/10">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5 text-xs text-secondary-text">
            {job.verificationStatus === 'Verified for current cycle' ? (
               <ShieldCheck className="w-4 h-4 text-green-500" />
            ) : (
               <AlertCircle className="w-4 h-4 text-amber-500" />
            )}
            <span className="truncate max-w-[120px]" title={job.verificationStatus}>
               {job.verificationStatus === 'Verified for current cycle' ? 'Verified' : 'Unverified'}
            </span>
          </div>

          <Link
            href={`/government-jobs/${job.id}`}
            className="text-sm font-medium text-primary flex items-center hover:underline"
          >
            View Details <ChevronRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20 hover:bg-[#25D366]/20 hover:text-[#25D366] transition-colors"
          onClick={handleWhatsAppShare}
          aria-label="Share on WhatsApp"
        >
          <Share2 className="w-4 h-4 mr-2" /> Share on WhatsApp
        </Button>
      </CardFooter>
    </Card>
  );
}
