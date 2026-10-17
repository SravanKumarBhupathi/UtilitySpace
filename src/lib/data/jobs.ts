import { ExamCategory, VerificationStatus } from "./exams";

export type ApplicationStatus =
  | 'Applications Open'
  | 'Upcoming'
  | 'Closing Soon'
  | 'Closed';

export type JobRecord = {
  id: string;
  title: string;
  organization: string;
  category: ExamCategory;
  stateOrRegion: string | 'All India';
  qualificationSummary: string[];
  vacancyCount: number | null;
  applicationStatus: ApplicationStatus;

  // Important Dates
  notificationDate: string | null; // ISO YYYY-MM-DD
  applicationStartDate: string | null;
  applicationDeadline: string | null;
  lastUpdated: string;

  // Verification Data
  verificationStatus: VerificationStatus;
  verificationDate: string;
  officialNotificationUrl: string | null;
  applicationPortalUrl: string | null;

  // Relation to Exam Tools
  linkedExamId: string | null;
};

// Start with an empty but typed array to fulfill the contract without inventing data
export const JOB_DATABASE: JobRecord[] = [];
