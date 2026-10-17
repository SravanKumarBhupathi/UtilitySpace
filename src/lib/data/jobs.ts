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

  // Details
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
