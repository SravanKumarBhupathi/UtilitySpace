import { VerificationStatus } from "./exams";

export type ApplicationStatus =
  | 'upcoming'
  | 'open'
  | 'closing_soon'
  | 'closed'
  | 'archived'
  | 'unverified';

export type JobCategory =
  | 'SSC'
  | 'Railway'
  | 'Banking & Insurance'
  | 'State Government'
  | 'Teaching'
  | 'Police & Defence'
  | 'Public Service Commission'
  | 'Other Government Jobs';


export interface VacancyDistribution {
  total: number;
  breakdown: Array<{ label: string; count: number }>;
  note?: string;
}

export interface ExamStage {
  stageName: string;
  subjects: Array<{ name: string; questions: number | string; marks: number | string }>;
  duration?: string;
  negativeMarking?: string;
  qualifyingCriteria?: string;
}

export interface ApplicationFee {
  category: string;
  amount: string | number;
  note?: string;
}

export interface EligibilityCriteria {
  education: string[];
  ageLimit: string;
  ageRelaxation?: string[];
  nationality?: string;
  experience?: string;
  otherConditions?: string[];
}

export type JobRecord = {

  id: string;
  slug: string;
  title: string;
  organization: string; // Recruiting authority
  category: JobCategory;
  stateOrRegion: string | 'All India';
  qualificationSummary: string[];
  vacancyCount: number | null;
  applicationStatus: ApplicationStatus;

  // Important Dates
  notificationReleaseDate: string | null; // ISO YYYY-MM-DD
  applicationStartDate: string | null;
  applicationDeadline: string | null;
  lastUpdated: string; // Last substantive update date

  // Verification Data
  verificationStatus: VerificationStatus;
  verificationDate: string;
  officialNotificationUrl: string | null;
  applicationPortalUrl: string | null;


  // Advanced Details (Structured)
  vacancyDistribution?: VacancyDistribution | null;
  eligibilityCriteria?: EligibilityCriteria | null;
  examStages?: ExamStage[] | null;
  applicationFeeDetails?: ApplicationFee[] | null;
  feePaymentDeadline?: string | null;
  correctionWindowDates?: string | null;
  examinationDate?: string | null;
  admitCardDate?: string | null;
  selectionProcessSteps?: string[] | null;

  // Legacy or simplified Details (keeping for backwards compatibility)
  eligibility: string | null;
  examPattern: string | null;
  applicationFees: string | null;
  selectionProcess: string | null;
  salaryInformation: string | null;


  // Relation to Exam Tools
  linkedExamId: string | null;
};

export const JOB_CATEGORIES: JobCategory[] = [
  'SSC',
  'Railway',
  'Banking & Insurance',
  'State Government',
  'Teaching',
  'Police & Defence',
  'Public Service Commission',
  'Other Government Jobs'
];

// Start with an empty but typed array to fulfill the contract without inventing data
export const JOB_DATABASE: JobRecord[] = [];


export function getJobBySlug(slug: string): JobRecord | undefined {
  return JOB_DATABASE.find(job => job.slug === slug);
}
