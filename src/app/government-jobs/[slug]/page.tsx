import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getJobBySlug, JOB_DATABASE } from '@/lib/data/jobs';
import { ChevronRight, Share2, ExternalLink, FileText, ShieldCheck, AlertCircle, Calendar, MapPin, Users, BriefcaseBusiness, CheckCircle2, Clock, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  params: {
    slug: string;
  };
}

// Phase 5: SEO
export function generateMetadata({ params }: Props): Metadata {
  const job = getJobBySlug(params.slug);

  if (!job) {
    return { title: 'Recruitment Not Found' };
  }

  return {
    title: `${job.title} Recruitment Notification | UtilitySpace`,
    description: `Official recruitment details, eligibility, exam pattern, and application link for ${job.title} by ${job.organization}. Prepare application documents instantly.`,
  };
}



export function generateStaticParams() {
  if (JOB_DATABASE.length === 0) {
    return [{ slug: 'dummy-placeholder' }];
  }
  return JOB_DATABASE.map((job) => ({
    slug: job.slug,
  }));
}



export default function JobDetailPage({ params }: Props) {
  const job = getJobBySlug(params.slug);

  if (!job) {
    notFound();
  }

  const isVerified = job.verificationStatus === 'Verified for current cycle';
  const isClosed = job.applicationStatus === 'closed' || job.applicationStatus === 'archived';

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
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-1 text-sm text-secondary-text mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4 shrink-0" />
        <Link href="/government-jobs" className="hover:text-primary transition-colors">Government Jobs</Link>
        <ChevronRight className="h-4 w-4 shrink-0" />
        <span className="text-foreground font-medium truncate">{job.title}</span>
      </nav>

      {/* A. RECRUITMENT HEADER */}
      <header className="mb-10 pb-8 border-b border-border">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">{job.category}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold tracking-wider uppercase whitespace-nowrap ${
            job.applicationStatus === 'open' ? 'bg-green-500/10 text-green-600' :
            job.applicationStatus === 'closing_soon' ? 'bg-amber-500/10 text-amber-600' :
            job.applicationStatus === 'upcoming' ? 'bg-blue-500/10 text-blue-600' :
            'bg-secondary/20 text-secondary-foreground'
          }`}>
            {job.applicationStatus.replace('_', ' ')}
          </span>
        </div>

        <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
          {job.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-secondary-text mb-6">
          <div className="flex items-center">
            <BriefcaseBusiness className="w-5 h-5 mr-2 shrink-0" />
            <span className="font-medium text-foreground">{job.organization}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 mr-2 shrink-0" />
            <span>{job.stateOrRegion}</span>
          </div>
          {job.vacancyCount !== null && (
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 shrink-0" />
              <span>{job.vacancyCount.toLocaleString()} Vacancies</span>
            </div>
          )}
        </div>

        {/* M. SOURCE AND VERIFICATION INFORMATION */}
        <div className={`p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border ${
          isVerified ? 'bg-green-500/5 border-green-500/20' : 'bg-amber-500/5 border-amber-500/20'
        }`}>
          <div className="flex items-start gap-3">
            {isVerified ? (
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
            )}
            <div>
              <p className={`font-semibold ${isVerified ? 'text-green-800 dark:text-green-300' : 'text-amber-800 dark:text-amber-300'}`}>
                {job.verificationStatus}
              </p>
              <div className="text-xs text-secondary-text mt-1 space-y-0.5">
                <p>Checked against official source: {job.verificationDate}</p>
                {job.lastUpdated && <p>Page last updated: {job.lastUpdated}</p>}
              </div>
            </div>
          </div>

<div className="flex gap-3 shrink-0 w-full sm:w-auto mt-4 sm:mt-0 flex-col sm:flex-row">
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20 hover:bg-[#25D366]/20"
            >
              <Share2 className="w-4 h-4 mr-2" /> Share via WhatsApp
            </Button>
            {job.officialNotificationUrl && (
              <a href={job.officialNotificationUrl} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                <Button variant="outline" className="w-full">
                  <FileText className="w-4 h-4 mr-2" /> Notification
                </Button>
              </a>
            )}
            {job.applicationPortalUrl && !isClosed && (
              <a href={job.applicationPortalUrl} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                <Button className="w-full">
                  Apply Now <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">

          {/* B. IMPORTANT DATES */}
          <section>
            <h2 className="text-2xl font-bold font-heading mb-6 border-b border-border/50 pb-2">Important Dates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-lg p-4 flex gap-3">
                <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-secondary-text mb-1">Notification Release</p>
                  <p className="font-semibold">{job.notificationReleaseDate ? new Date(job.notificationReleaseDate).toLocaleDateString() : 'Not announced officially'}</p>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-secondary-text mb-1">Application Starts</p>
                  <p className="font-semibold">{job.applicationStartDate ? new Date(job.applicationStartDate).toLocaleDateString() : 'Not announced officially'}</p>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 flex gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-secondary-text mb-1">Application Deadline</p>
                  <p className="font-semibold">{job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'Not announced officially'}</p>
                </div>
              </div>
              {job.feePaymentDeadline && (
                <div className="bg-card border border-border rounded-lg p-4 flex gap-3">
                  <Calendar className="w-5 h-5 text-secondary-text shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-secondary-text mb-1">Fee Payment Deadline</p>
                    <p className="font-semibold">{new Date(job.feePaymentDeadline).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
              {job.examinationDate && (
                <div className="bg-card border border-border rounded-lg p-4 flex gap-3">
                  <Calendar className="w-5 h-5 text-secondary-text shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-secondary-text mb-1">Examination Date</p>
                    <p className="font-semibold">{job.examinationDate}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* D. ELIGIBILITY */}
          <section>
            <h2 className="text-2xl font-bold font-heading mb-6 border-b border-border/50 pb-2">Eligibility Criteria</h2>
            {job.eligibilityCriteria ? (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Education</h3>
                  <ul className="list-disc pl-5 space-y-1 text-secondary-text">
                    {job.eligibilityCriteria.education.map((item, i) => <li key={i}>{item}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Age Limit</h3>
                  <p className="text-secondary-text">{job.eligibilityCriteria.ageLimit}</p>
                </div>
                {job.eligibilityCriteria.experience && (
                  <div>
                    <h3 className="font-semibold mb-2">Experience</h3>
                    <p className="text-secondary-text">{job.eligibilityCriteria.experience}</p>
                  </div>
                )}
              </div>
            ) : job.eligibility ? (
              <div className="prose prose-sm dark:prose-invert max-w-none text-secondary-text">
                {job.eligibility}
              </div>
            ) : (
              <p className="text-secondary-text italic">Eligibility conditions are not yet provided in the official notification.</p>
            )}
          </section>

          {/* C. VACANCY DETAILS */}
          {job.vacancyDistribution && (
            <section>
              <h2 className="text-2xl font-bold font-heading mb-6 border-b border-border/50 pb-2">Vacancy Details</h2>
              <div className="overflow-x-auto border border-border rounded-lg">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-secondary-text font-medium border-b border-border">
                    <tr>
                      <th className="px-4 py-3">Category / Post</th>
                      <th className="px-4 py-3 text-right">Count</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {job.vacancyDistribution.breakdown.map((item, i) => (
                      <tr key={i} className="hover:bg-muted/30">
                        <td className="px-4 py-3">{item.label}</td>
                        <td className="px-4 py-3 text-right font-medium">{item.count.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted/30 font-semibold border-t border-border">
                    <tr>
                      <td className="px-4 py-3">Total</td>
                      <td className="px-4 py-3 text-right">{job.vacancyDistribution.total.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              {job.vacancyDistribution.note && <p className="text-xs text-secondary-text mt-2">{job.vacancyDistribution.note}</p>}
            </section>
          )}

          {/* E. EXAM PATTERN */}
          {job.examStages && job.examStages.length > 0 ? (
            <section>
              <h2 className="text-2xl font-bold font-heading mb-6 border-b border-border/50 pb-2">Exam Pattern</h2>
              <div className="space-y-8">
                {job.examStages.map((stage, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                       <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-sm">{idx + 1}</span>
                       {stage.stageName}
                    </h3>
                    <div className="overflow-x-auto border border-border rounded-lg">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-muted/50 text-secondary-text font-medium border-b border-border">
                          <tr>
                            <th className="px-4 py-3">Subject / Section</th>
                            <th className="px-4 py-3 text-center">Questions</th>
                            <th className="px-4 py-3 text-center">Marks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {stage.subjects.map((subj, i) => (
                            <tr key={i} className="hover:bg-muted/30">
                              <td className="px-4 py-3">{subj.name}</td>
                              <td className="px-4 py-3 text-center">{subj.questions}</td>
                              <td className="px-4 py-3 text-center">{subj.marks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-secondary-text">
                      {stage.duration && <span className="bg-muted px-2 py-1 rounded">Duration: {stage.duration}</span>}
                      {stage.negativeMarking && <span className="bg-muted px-2 py-1 rounded">Negative Marking: {stage.negativeMarking}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : job.examPattern && (
            <section>
              <h2 className="text-2xl font-bold font-heading mb-6 border-b border-border/50 pb-2">Exam Pattern</h2>
              <div className="prose prose-sm dark:prose-invert max-w-none text-secondary-text">
                {job.examPattern}
              </div>
            </section>
          )}

          {/* F. APPLICATION FEE */}
          {job.applicationFeeDetails && job.applicationFeeDetails.length > 0 ? (
            <section>
              <h2 className="text-2xl font-bold font-heading mb-6 border-b border-border/50 pb-2">Application Fee</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {job.applicationFeeDetails.map((fee, i) => (
                  <div key={i} className="border border-border p-4 rounded-lg bg-card">
                    <p className="text-secondary-text text-sm mb-1">{fee.category}</p>
                    <p className="text-xl font-semibold">
                       {typeof fee.amount === 'number' ? `₹${fee.amount}` : fee.amount}
                    </p>
                    {fee.note && <p className="text-xs text-secondary-text mt-2">{fee.note}</p>}
                  </div>
                ))}
              </div>
            </section>
          ) : job.applicationFees && (
            <section>
              <h2 className="text-2xl font-bold font-heading mb-6 border-b border-border/50 pb-2">Application Fee</h2>
              <p className="text-secondary-text">{job.applicationFees}</p>
            </section>
          )}

          {/* G. SALARY AND BENEFITS */}
          {job.salaryInformation && (
            <section>
              <h2 className="text-2xl font-bold font-heading mb-6 border-b border-border/50 pb-2">Salary Information</h2>
              <p className="text-secondary-text">{job.salaryInformation}</p>
            </section>
          )}

          {/* H. SELECTION PROCESS */}
          {job.selectionProcessSteps && job.selectionProcessSteps.length > 0 ? (
            <section>
              <h2 className="text-2xl font-bold font-heading mb-6 border-b border-border/50 pb-2">Selection Process</h2>
              <ul className="space-y-4">
                 {job.selectionProcessSteps.map((step, i) => (
                   <li key={i} className="flex items-start">
                     <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex shrink-0 items-center justify-center text-sm font-bold mr-3 mt-0.5">{i + 1}</span>
                     <span className="text-secondary-text">{step}</span>
                   </li>
                 ))}
              </ul>
            </section>
          ) : job.selectionProcess && (
            <section>
              <h2 className="text-2xl font-bold font-heading mb-6 border-b border-border/50 pb-2">Selection Process</h2>
              <p className="text-secondary-text">{job.selectionProcess}</p>
            </section>
          )}

        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-1 space-y-8">

           {/* K. PHOTO AND SIGNATURE PREPARATION */}
           <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 sticky top-24">
             <h3 className="font-heading font-bold text-xl mb-3 text-foreground">Prepare Your Photo & Signature</h3>
             <p className="text-secondary-text text-sm mb-6">
               Use UtilitySpace to prepare image files according to the requirements specified in this recruitment notification. Confirm conditions before submitting.
             </p>

             {job.linkedExamId ? (
                <Link href={`/exam-tools/studio?exam=${job.linkedExamId}&type=photo`} className="block w-full">
                  <Button className="w-full justify-between group">
                    Start Preparation <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
             ) : (
                <div className="space-y-3">
                  <Link href="/exam-tools/custom?type=photo" className="block w-full">
                    <Button variant="outline" className="w-full justify-start text-secondary-text">
                      Custom Photo Workflow
                    </Button>
                  </Link>
                  <p className="text-xs text-secondary-text text-center italic">
                    Enter dimensions manually from the official notification.
                  </p>
                </div>
             )}
           </div>

           {/* L. RELATED RECRUITMENTS */}
           {/* Not explicitly rendering fake related recs, waiting for data linking */}

        </div>
      </div>
    </div>
  );
}
