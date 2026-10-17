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
export const JOB_DATABASE: JobRecord[] = [
  {
    id: 'rrb-ntpc-graduate-2024',
    slug: 'rrb-ntpc-graduate-2024',
    title: 'RRB NTPC (Graduate) Recruitment 2024',
    organization: 'Railway Recruitment Board',
    category: 'Railway',
    stateOrRegion: 'All India',
    qualificationSummary: ['Bachelor\'s Degree'],
    vacancyCount: 8113,
    applicationStatus: 'archived',

    notificationReleaseDate: '2024-09-02',
    applicationStartDate: '2024-09-14',
    applicationDeadline: '2024-10-13',
    lastUpdated: '2024-10-14',

    verificationStatus: 'Historical archive',
    verificationDate: '2024-10-14',
    officialNotificationUrl: 'https://indianrailways.gov.in/railwayboard/uploads/directorate/mgt_ser/Indian_Medical_Services/CEN_05_2024_NTPC_Grad_Eng.pdf',
    applicationPortalUrl: 'https://www.rrbapply.gov.in/',

    eligibilityCriteria: {
      education: [
        'Bachelor\'s Degree from a recognized University or equivalent.'
      ],
      ageLimit: '18 to 36 years as on 01.01.2025 (includes 3 years COVID relaxation)',
      ageRelaxation: [
        'OBC (Non-Creamy Layer): 3 years',
        'SC/ST: 5 years',
        'PwBD: 10 years'
      ],
      nationality: 'Indian Citizen'
    },

    vacancyDistribution: {
      total: 8113,
      breakdown: [
        { label: 'Chief Commercial cum Ticket Supervisor', count: 1736 },
        { label: 'Station Master', count: 994 },
        { label: 'Goods Train Manager', count: 3144 },
        { label: 'Junior Account Assistant cum Typist', count: 1507 },
        { label: 'Senior Clerk cum Typist', count: 732 }
      ],
      note: 'Vacancies are distributed across various RRB zones.'
    },

    applicationFeeDetails: [
      { category: 'UR/OBC', amount: 500, note: '₹400 refunded after appearing in CBT-1' },
      { category: 'SC/ST/Ex-SM/PwBD/Female/Transgender/Minorities/EBC', amount: 250, note: '₹250 refunded after appearing in CBT-1' }
    ],

    feePaymentDeadline: '2024-10-15',
    correctionWindowDates: '2024-10-16 to 2024-10-25',
    examinationDate: null,
    admitCardDate: null,

    selectionProcessSteps: [
      '1st Stage Computer Based Test (CBT-1)',
      '2nd Stage Computer Based Test (CBT-2)',
      'Computer Based Aptitude Test (CBAT) / Typing Skill Test (TST) as applicable',
      'Document Verification (DV)',
      'Medical Examination'
    ],

    examStages: [
      {
        stageName: 'CBT 1 (Common for all posts)',
        subjects: [
          { name: 'General Awareness', questions: 40, marks: 40 },
          { name: 'Mathematics', questions: 30, marks: 30 },
          { name: 'General Intelligence and Reasoning', questions: 30, marks: 30 }
        ],
        duration: '90 Minutes',
        negativeMarking: '1/3rd for each incorrect answer'
      }
    ],

    salaryInformation: 'Level 5 & 6 of 7th CPC Pay Matrix (Initial Pay: ₹29,200 to ₹35,400 depending on the post)',

    eligibility: null,
    examPattern: null,
    applicationFees: null,
    selectionProcess: null,

    linkedExamId: 'rrb-ntpc-graduate'
  },
  {
    id: 'ssc-cgl-2024',
    slug: 'ssc-cgl-2024',
    title: 'SSC Combined Graduate Level Examination (CGL) 2024',
    organization: 'Staff Selection Commission',
    category: 'SSC',
    stateOrRegion: 'All India',
    qualificationSummary: ['Bachelor\'s Degree'],
    vacancyCount: 17727,
    applicationStatus: 'archived',

    notificationReleaseDate: '2024-06-24',
    applicationStartDate: '2024-06-24',
    applicationDeadline: '2024-07-24',
    lastUpdated: '2024-07-25',

    verificationStatus: 'Historical archive',
    verificationDate: '2024-07-25',
    officialNotificationUrl: 'https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_CGLE_2024_05_07_24.pdf',
    applicationPortalUrl: 'https://ssc.gov.in/',

    eligibilityCriteria: {
      education: [
        'Bachelor\'s Degree from a recognized University or equivalent.',
        'Final year students could apply provided they acquired the qualification before 01-08-2024.'
      ],
      ageLimit: '18-27 years, 20-30 years, 18-30 years, or 18-32 years depending on the specific post (as on 01-08-2024)',
      ageRelaxation: [
        'SC/ST: 5 years',
        'OBC: 3 years',
        'PwBD (Unreserved): 10 years'
      ]
    },

    vacancyDistribution: {
      total: 17727,
      breakdown: [
        { label: 'Tentative Vacancies', count: 17727 }
      ],
      note: 'Final vacancies will be updated in due course on the SSC portal.'
    },

    applicationFeeDetails: [
      { category: 'General/OBC/EWS (Male)', amount: 100 },
      { category: 'Women/SC/ST/PwBD/ESM', amount: 0, note: 'Exempted from fee payment' }
    ],

    feePaymentDeadline: '2024-07-25',
    correctionWindowDates: '2024-08-10 to 2024-08-11',
    examinationDate: 'Sep-Oct 2024 (Tier-I), Dec 2024 (Tier-II Tentative)',
    admitCardDate: null,

    selectionProcessSteps: [
      'Tier-I: Computer Based Examination',
      'Tier-II: Computer Based Examination',
      'Document Verification',
      'Medical Examination'
    ],

    examStages: [
      {
        stageName: 'Tier-I (Computer Based Examination)',
        subjects: [
          { name: 'General Intelligence and Reasoning', questions: 25, marks: 50 },
          { name: 'General Awareness', questions: 25, marks: 50 },
          { name: 'Quantitative Aptitude', questions: 25, marks: 50 },
          { name: 'English Comprehension', questions: 25, marks: 50 }
        ],
        duration: '1 Hour',
        negativeMarking: '0.50 marks for each wrong answer'
      }
    ],

    salaryInformation: 'Pay Levels 4 to 8 (₹25,500 to ₹1,51,100) depending on the post.',

    eligibility: null,
    examPattern: null,
    applicationFees: null,
    selectionProcess: null,

    linkedExamId: 'ssc-cgl'
  },
  {
    id: 'ctet-dec-2024',
    slug: 'ctet-dec-2024',
    title: 'Central Teacher Eligibility Test (CTET) Dec 2024',
    organization: 'Central Board of Secondary Education (CBSE)',
    category: 'Teaching',
    stateOrRegion: 'All India',
    qualificationSummary: ['B.Ed', 'D.El.Ed', 'Senior Secondary'],
    vacancyCount: null,
    applicationStatus: 'archived',

    notificationReleaseDate: '2024-09-17',
    applicationStartDate: '2024-09-17',
    applicationDeadline: '2024-10-16',
    lastUpdated: '2024-10-10',

    verificationStatus: 'Historical archive',
    verificationDate: '2024-10-10',
    officialNotificationUrl: 'https://ctet.nic.in/wp-content/uploads/2024/09/InformationBulletinCTET-Dec2024.pdf',
    applicationPortalUrl: 'https://ctet.nic.in/',

    eligibilityCriteria: {
      education: [
        'Paper I (Classes I to V): Senior Secondary (or its equivalent) with at least 50% marks and passed or appearing in final year of 2-year Diploma in Elementary Education.',
        'Paper II (Classes VI to VIII): Graduation and passed or appearing in final year of 2-year Diploma in Elementary Education OR B.Ed.'
      ],
      ageLimit: 'No age limit for CTET. Certification determines eligibility for recruitment.',
    },

    applicationFeeDetails: [
      { category: 'General/OBC (Only Paper I or II)', amount: 1000 },
      { category: 'General/OBC (Both Paper I and II)', amount: 1200 },
      { category: 'SC/ST/Diff. Abled (Only Paper I or II)', amount: 500 },
      { category: 'SC/ST/Diff. Abled (Both Paper I and II)', amount: 600 }
    ],

    feePaymentDeadline: '2024-10-16',
    correctionWindowDates: '2024-10-21 to 2024-10-25',
    examinationDate: '2024-12-01 (1st December 2024)',
    admitCardDate: 'Two days before examination',

    selectionProcessSteps: [
      'Submission of Online Application',
      'Download of Admit Card',
      'Appear for OMR Based Written Examination (Paper 1 / Paper 2)',
      'Declaration of Results'
    ],

    examStages: [
      {
        stageName: 'Paper I (for Classes I to V)',
        subjects: [
          { name: 'Child Development and Pedagogy', questions: 30, marks: 30 },
          { name: 'Language I (compulsory)', questions: 30, marks: 30 },
          { name: 'Language II (compulsory)', questions: 30, marks: 30 },
          { name: 'Mathematics', questions: 30, marks: 30 },
          { name: 'Environmental Studies', questions: 30, marks: 30 }
        ],
        duration: '2 hours 30 minutes',
        negativeMarking: 'No negative marking',
        qualifyingCriteria: '60% or more marks to qualify. Concessions may apply for SC/ST/OBC.'
      }
    ],

    salaryInformation: 'Not applicable. CTET is an eligibility test, not a recruitment for a specific post.',

    eligibility: null,
    examPattern: null,
    applicationFees: null,
    selectionProcess: null,

    linkedExamId: 'ctet'
  },
  {
    id: 'ibps-po-2024',
    slug: 'ibps-po-2024',
    title: 'IBPS Probationary Officer / Management Trainee (CRP-PO/MT-XIV)',
    organization: 'Institute of Banking Personnel Selection',
    category: 'Banking & Insurance',
    stateOrRegion: 'All India',
    qualificationSummary: ['Bachelor\'s Degree'],
    vacancyCount: 4455,
    applicationStatus: 'archived',

    notificationReleaseDate: '2024-08-01',
    applicationStartDate: '2024-08-01',
    applicationDeadline: '2024-08-28',
    lastUpdated: '2024-08-29',

    verificationStatus: 'Historical archive',
    verificationDate: '2024-08-29',
    officialNotificationUrl: 'https://www.ibps.in/wp-content/uploads/Detailed_Advt_CRP_PO_XIV.pdf',
    applicationPortalUrl: 'https://ibpsonline.ibps.in/',

    eligibilityCriteria: {
      education: [
        'A Degree (Graduation) in any discipline from a University recognized by the Govt. Of India.'
      ],
      ageLimit: '20 to 30 Years as on 01.08.2024',
      ageRelaxation: [
        'SC/ST: 5 years',
        'OBC (Non-Creamy Layer): 3 years',
        'PwBD: 10 years'
      ]
    },

    vacancyDistribution: {
      total: 4455,
      breakdown: [
        { label: 'Bank of Baroda', count: 0 },
        { label: 'Bank of India', count: 885 },
        { label: 'Bank of Maharashtra', count: 0 },
        { label: 'Canara Bank', count: 750 },
        { label: 'Central Bank of India', count: 2000 },
        { label: 'Indian Overseas Bank', count: 260 },
        { label: 'Punjab National Bank', count: 200 },
        { label: 'UCO Bank', count: 360 }
      ],
      note: 'Certain banks have not reported vacancies yet (NR).'
    },

    applicationFeeDetails: [
      { category: 'General / OBC / EWS', amount: 850, note: 'Inclusive of GST' },
      { category: 'SC/ST/PwBD', amount: 175, note: 'Intimation Charges only' }
    ],

    feePaymentDeadline: '2024-08-28',
    examinationDate: 'October 2024 (Prelims)',
    admitCardDate: 'October 2024',

    selectionProcessSteps: [
      'Preliminary Examination (Online)',
      'Main Examination (Online)',
      'Interview'
    ],

    examStages: [
      {
        stageName: 'Preliminary Examination',
        subjects: [
          { name: 'English Language', questions: 30, marks: 30 },
          { name: 'Quantitative Aptitude', questions: 35, marks: 35 },
          { name: 'Reasoning Ability', questions: 35, marks: 35 }
        ],
        duration: '60 Minutes (20 minutes per section)',
        negativeMarking: '0.25 marks for each wrong answer'
      }
    ],

    salaryInformation: 'Basic Pay is ₹36,000/- (in the scale of 36000-1490/7-46430-1740/2-49910-1990/7-63840) plus DA, HRA, CCA etc.',

    eligibility: null,
    examPattern: null,
    applicationFees: null,
    selectionProcess: null,

    linkedExamId: 'ibps-po'
  },
  {
    id: 'upsc-cse-2024',
    slug: 'upsc-cse-2024',
    title: 'UPSC Civil Services Examination 2024',
    organization: 'Union Public Service Commission',
    category: 'Public Service Commission',
    stateOrRegion: 'All India',
    qualificationSummary: ['Bachelor\'s Degree'],
    vacancyCount: 1056,
    applicationStatus: 'archived',

    notificationReleaseDate: '2024-02-14',
    applicationStartDate: '2024-02-14',
    applicationDeadline: '2024-03-05',
    lastUpdated: '2024-03-06',

    verificationStatus: 'Historical archive',
    verificationDate: '2024-03-06',
    officialNotificationUrl: 'https://upsc.gov.in/sites/default/files/Notif-CSP-24-engl-140224.pdf',
    applicationPortalUrl: 'https://upsconline.nic.in/',

    eligibilityCriteria: {
      education: [
        'A candidate must hold a Graduate degree of any of the Universities incorporated by an Act of the central or State Legislature in India or other educational institutions established by an Act of Parliament.'
      ],
      ageLimit: '21 to 32 Years as on 01.08.2024',
      ageRelaxation: [
        'SC/ST: 5 years',
        'OBC: 3 years',
        'PwBD: 10 years'
      ],
      nationality: 'For IAS and IPS, candidate must be a citizen of India.'
    },

    vacancyDistribution: {
      total: 1056,
      breakdown: [
        { label: 'Total Expected Vacancies', count: 1056 }
      ],
      note: 'Includes 40 vacancies reserved for Persons with Benchmark Disability Category.'
    },

    applicationFeeDetails: [
      { category: 'General / OBC', amount: 100 },
      { category: 'Female / SC / ST / PwBD', amount: 0, note: 'Exempted' }
    ],

    feePaymentDeadline: '2024-03-05',
    correctionWindowDates: '2024-03-06 to 2024-03-12',
    examinationDate: '2024-06-16 (Preliminary Exam)',
    admitCardDate: 'Typically 3 weeks before exam',

    selectionProcessSteps: [
      'Civil Services (Preliminary) Examination (Objective type)',
      'Civil Services (Main) Examination (Written)',
      'Interview / Personality Test'
    ],

    examStages: [
      {
        stageName: 'Preliminary Examination',
        subjects: [
          { name: 'General Studies Paper I', questions: 100, marks: 200 },
          { name: 'General Studies Paper II (CSAT)', questions: 80, marks: 200 }
        ],
        duration: '2 Hours per paper',
        negativeMarking: '1/3rd of the marks assigned to that question',
        qualifyingCriteria: 'Paper II (CSAT) is qualifying in nature with minimum qualifying marks fixed at 33%.'
      }
    ],

    salaryInformation: 'As per 7th CPC guidelines for Group A services (IAS, IPS, IFS, etc.)',

    eligibility: null,
    examPattern: null,
    applicationFees: null,
    selectionProcess: null,

    linkedExamId: 'upsc-cse'
  }
];

export function getJobBySlug(slug: string): JobRecord | undefined {
  return JOB_DATABASE.find(job => job.slug === slug);
}
