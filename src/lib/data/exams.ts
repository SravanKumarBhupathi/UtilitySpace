export type DocumentType =
  | 'photo'
  | 'signature'
  | 'thumb_impression'
  | 'handwritten_declaration'
  | 'other';

export type DocumentRequirement = {
  documentType: DocumentType;
  format: string[]; // e.g. ['jpg', 'jpeg']
  width: number | null; // px
  height: number | null; // px
  unit: 'px' | 'cm' | 'mm' | 'inch';
  minKB: number;
  maxKB: number;
  aspectRatio: number | null;
  nameRequired: boolean;
  dateRequired: boolean;
  backgroundRequirement: string | null;
  liveCaptureRequired?: boolean;
  notes: string | null;
};

export type ExamCategory =
  | 'SSC'
  | 'Railway'
  | 'Banking'
  | 'State Recruitment'
  | 'All India';

export type VerificationStatus =
  | 'Verified for current cycle'
  | 'Verification pending'
  | 'Historical archive'
  | 'Closed recruitment'
  | 'Source unavailable';

export type ExamRecord = {
  id: string;
  name: string;
  organization: string;
  category: ExamCategory;
  slug: string;
  recruitmentCycle: string;
  notificationNumber: string | null;
  requirements: Record<string, DocumentRequirement>; // 'photo' | 'signature' | etc.
  sourceUrl: string | null;
  applicationUrl: string | null;
  lastVerified: string;
  verificationStatus: VerificationStatus;
  notes: string | null;
  active: boolean;
};

export const EXAM_CATEGORIES: ExamCategory[] = [
  'SSC',
  'Railway',
  'Banking',
  'State Recruitment',
  'All India',
];

export const CATEGORY_DESCRIPTIONS: Record<ExamCategory, string> = {
  SSC: 'Staff Selection Commission exams including CGL, CHSL, MTS, and GD Constable with verified signature requirements and live-photo guidelines.',
  Railway: 'Railway Recruitment Board (RRB) exams including NTPC Graduate & Undergraduate, ALP, and Technician with 35mm×45mm verified dimensions.',
  Banking: 'Institute of Banking Personnel Selection (IBPS) and State Bank of India (SBI) PO and Clerk recruitment document presets.',
  'State Recruitment': 'State Public Service Commissions including APPSC Group 1 and Group 2 recruitment presets.',
  'All India': 'All India recruitment and competitive exams including UPSC Civil Services, NDA/CDS, and CTET with official photo and signature guidelines.',
};

export const EXAM_DATABASE: ExamRecord[] = [
  // --- SSC Category ---
  {
    id: 'ssc-cgl',
    name: 'SSC CGL',
    organization: 'Staff Selection Commission',
    category: 'SSC',
    slug: 'ssc-cgl',
    sourceUrl: 'https://ssc.gov.in/',
    lastVerified: '2024-06-25',
    verificationStatus: 'Historical archive',
    recruitmentCycle: '2024',
    notificationNumber: 'HQ-PPI03/11/2024-PP_1',
    applicationUrl: 'https://ssc.gov.in/',
    active: true,
    notes: 'Combined Graduate Level Examination 2024. Mandatory note: SSC requires live photograph capture via webcam or the official MySSC app. Upload is only required for signature.',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: null,
        height: null,
        unit: 'px',
        minKB: 0,
        maxKB: 0,
        aspectRatio: null,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'Plain background with good ambient lighting',
        liveCaptureRequired: true,
        notes: 'Photo must be captured LIVE through the application portal webcam or the MySSC mobile app. Do not upload a scanned photo.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 4, // 4.0 cm width
        height: 2, // 2.0 cm height
        unit: 'cm',
        minKB: 10,
        maxKB: 20,
        aspectRatio: 2,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black/dark blue ink',
        notes: 'Dimensions: roughly 4.0 cm width × 2.0 cm height. File size: 10 KB to 20 KB. Must not be blurred or signed in capital letters.',
      },
    },
  },
  {
    id: 'ssc-chsl',
    name: 'SSC CHSL',
    organization: 'Staff Selection Commission',
    category: 'SSC',
    slug: 'ssc-chsl',
    sourceUrl: 'https://ssc.gov.in/',
    lastVerified: '2024-04-08',
    verificationStatus: 'Historical archive',
    recruitmentCycle: '2024',
    notificationNumber: 'HQ-PPI03/3/2024-PP_1',
    applicationUrl: 'https://ssc.gov.in/',
    active: true,
    notes: 'Combined Higher Secondary Level (10+2) Examination 2024. Live photograph capture is mandatory on the new SSC portal. Signature upload required.',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: null,
        height: null,
        unit: 'px',
        minKB: 0,
        maxKB: 0,
        aspectRatio: null,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'Plain light background',
        liveCaptureRequired: true,
        notes: 'Mandatory live webcam capture via portal or MySSC app.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 4,
        height: 2,
        unit: 'cm',
        minKB: 10,
        maxKB: 20,
        aspectRatio: 2,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black ink',
        notes: 'Dimensions: 4.0 cm (width) × 2.0 cm (height). File size: 10 KB to 20 KB.',
      },
    },
  },
  {
    id: 'ssc-mts',
    name: 'SSC MTS & Havaldar',
    organization: 'Staff Selection Commission',
    category: 'SSC',
    slug: 'ssc-mts',
    sourceUrl: 'https://ssc.gov.in/',
    lastVerified: '2024-06-27',
    verificationStatus: 'Historical archive',
    recruitmentCycle: '2024',
    notificationNumber: 'HQ-PPI03/7/2024-PP_1',
    applicationUrl: 'https://ssc.gov.in/',
    active: true,
    notes: 'Multi-Tasking (Non-Technical) Staff, and Havaldar (CBIC & CBN) Examination 2024. Live photograph capture required.',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: null,
        height: null,
        unit: 'px',
        minKB: 0,
        maxKB: 0,
        aspectRatio: null,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'Plain background',
        liveCaptureRequired: true,
        notes: 'Live photo capture mandatory.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 4,
        height: 2,
        unit: 'cm',
        minKB: 10,
        maxKB: 20,
        aspectRatio: 2,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black ink',
        notes: 'Dimensions: 4.0 cm × 2.0 cm. File size: 10 KB to 20 KB.',
      },
    },
  },
  {
    id: 'ssc-gd',
    name: 'SSC GD Constable',
    organization: 'Staff Selection Commission',
    category: 'SSC',
    slug: 'ssc-gd',
    sourceUrl: 'https://ssc.gov.in/',
    lastVerified: '2024-09-05',
    verificationStatus: 'Historical archive',
    recruitmentCycle: '2025',
    notificationNumber: 'HQ-PPI03/12/2024-PP_1',
    applicationUrl: 'https://ssc.gov.in/',
    active: true,
    notes: 'Constable (GD) in CAPFs, SSF, and Rifleman (GD) in Assam Rifles Examination 2025. Live photo capture required.',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: null,
        height: null,
        unit: 'px',
        minKB: 0,
        maxKB: 0,
        aspectRatio: null,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'Plain light background',
        liveCaptureRequired: true,
        notes: 'Live webcam or app photo capture.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 4,
        height: 2,
        unit: 'cm',
        minKB: 10,
        maxKB: 20,
        aspectRatio: 2,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black/blue ink',
        notes: 'Dimensions: 4.0 cm × 2.0 cm. File size: 10 KB to 20 KB.',
      },
    },
  },

  // --- Railway Category ---
  {
    id: 'rrb-ntpc-graduate',
    name: 'RRB NTPC (Graduate)',
    organization: 'Railway Recruitment Board',
    category: 'Railway',
    slug: 'rrb-ntpc-graduate',
    sourceUrl: 'https://www.rrbapply.gov.in/',
    lastVerified: '2024-09-02',
    verificationStatus: 'Historical archive',
    recruitmentCycle: '2024',
    notificationNumber: 'CEN 05/2024',
    applicationUrl: 'https://www.rrbapply.gov.in/',
    active: true,
    notes: 'Non-Technical Popular Categories Graduate Posts (CEN 05/2024). Color passport photo on plain white background taken within last 6 months.',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: 35,
        height: 45,
        unit: 'mm',
        minKB: 30,
        maxKB: 70,
        aspectRatio: 35 / 45,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'Plain white background',
        notes: 'Dimensions: 35mm × 45mm. File size: 30 KB to 70 KB. Face must occupy 75% of photograph. Spectacles and caps not allowed.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 50,
        height: 20,
        unit: 'mm',
        minKB: 30,
        maxKB: 70,
        aspectRatio: 50 / 20,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black/blue ballpoint pen',
        notes: 'Dimensions: 50mm × 20mm. File size: 30 KB to 70 KB. Must be running handwriting; capital or block letters are strictly rejected.',
      },
    },
  },
  {
    id: 'rrb-ntpc-undergraduate',
    name: 'RRB NTPC (Undergraduate)',
    organization: 'Railway Recruitment Board',
    category: 'Railway',
    slug: 'rrb-ntpc-undergraduate',
    sourceUrl: 'https://www.rrbapply.gov.in/',
    lastVerified: '2024-09-14',
    verificationStatus: 'Historical archive',
    recruitmentCycle: '2024',
    notificationNumber: 'CEN 06/2024',
    applicationUrl: 'https://www.rrbapply.gov.in/',
    active: true,
    notes: 'Non-Technical Popular Categories Undergraduate Posts (CEN 06/2024).',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: 35,
        height: 45,
        unit: 'mm',
        minKB: 30,
        maxKB: 70,
        aspectRatio: 35 / 45,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'Plain white background',
        notes: 'Dimensions: 35mm × 45mm. File size: 30 KB to 70 KB.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 50,
        height: 20,
        unit: 'mm',
        minKB: 30,
        maxKB: 70,
        aspectRatio: 50 / 20,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black/blue pen',
        notes: 'Dimensions: 50mm × 20mm. File size: 30 KB to 70 KB. Running hand only.',
      },
    },
  },
  {
    id: 'rrb-alp',
    name: 'RRB ALP (Assistant Loco Pilot)',
    organization: 'Railway Recruitment Board',
    category: 'Railway',
    slug: 'rrb-alp',
    sourceUrl: 'https://www.rrbapply.gov.in/',
    lastVerified: '2024-01-20',
    verificationStatus: 'Historical archive',
    recruitmentCycle: '2024',
    notificationNumber: 'CEN 01/2024',
    applicationUrl: 'https://www.rrbapply.gov.in/',
    active: true,
    notes: 'Recruitment of Assistant Loco Pilot (CEN 01/2024).',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: 35,
        height: 45,
        unit: 'mm',
        minKB: 30,
        maxKB: 70,
        aspectRatio: 35 / 45,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'Plain white background',
        notes: '35mm × 45mm color photo. File size: 30 KB to 70 KB.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 50,
        height: 20,
        unit: 'mm',
        minKB: 30,
        maxKB: 70,
        aspectRatio: 50 / 20,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black/blue ink',
        notes: 'Running handwriting. File size: 30 KB to 70 KB.',
      },
    },
  },
  {
    id: 'rrb-technician',
    name: 'RRB Technician',
    organization: 'Railway Recruitment Board',
    category: 'Railway',
    slug: 'rrb-technician',
    sourceUrl: 'https://www.rrbapply.gov.in/',
    lastVerified: '2024-03-09',
    verificationStatus: 'Historical archive',
    recruitmentCycle: '2024',
    notificationNumber: 'CEN 02/2024',
    applicationUrl: 'https://www.rrbapply.gov.in/',
    active: true,
    notes: 'Recruitment of Technician Gr I Signal and Technician Gr III (CEN 02/2024).',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: 35,
        height: 45,
        unit: 'mm',
        minKB: 30,
        maxKB: 70,
        aspectRatio: 35 / 45,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'Plain white background',
        notes: '35mm × 45mm. File size: 30 KB to 70 KB.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 50,
        height: 20,
        unit: 'mm',
        minKB: 30,
        maxKB: 70,
        aspectRatio: 50 / 20,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black/blue pen',
        notes: '50mm × 20mm, 30 KB to 70 KB.',
      },
    },
  },
  {
    id: 'rrb-group-d',
    name: 'RRB Group D (Level 1)',
    organization: 'Railway Recruitment Board',
    category: 'Railway',
    slug: 'rrb-group-d',
    sourceUrl: 'https://indianrailways.gov.in/',
    lastVerified: '2024-11-01',
    verificationStatus: 'Verification pending',
    recruitmentCycle: 'Upcoming Cycle',
    notificationNumber: null,
    applicationUrl: 'https://www.rrbapply.gov.in/',
    active: true,
    notes: 'Requirements not yet officially verified for the upcoming recruitment cycle. CEN notification awaited. Please check the official recruitment notification before uploading.',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: null,
        height: null,
        unit: 'mm',
        minKB: 0,
        maxKB: 0,
        aspectRatio: null,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: null,
        notes: 'Requirements not yet officially verified. Expected standard: 35mm × 45mm, 30–70 KB on white background. Check official CEN upon release.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: null,
        height: null,
        unit: 'mm',
        minKB: 0,
        maxKB: 0,
        aspectRatio: null,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: null,
        notes: 'Requirements not yet officially verified. Expected standard: running handwriting on white paper, 30–70 KB. Check official notification.',
      },
    },
  },

  // --- Banking Category ---
  {
    id: 'ibps-po',
    name: 'IBPS PO / MT',
    organization: 'Institute of Banking Personnel Selection',
    category: 'Banking',
    slug: 'ibps-po',
    sourceUrl: 'https://www.ibps.in/',
    lastVerified: '2024-08-01',
    verificationStatus: 'Historical archive',
    recruitmentCycle: '2024-25',
    notificationNumber: 'CRP PO/MT-XIV',
    applicationUrl: 'https://www.ibps.in/',
    active: true,
    notes: 'Common Recruitment Process for Probationary Officers / Management Trainees (CRP PO/MT-XIV).',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: 200,
        height: 230,
        unit: 'px',
        minKB: 20,
        maxKB: 50,
        aspectRatio: 200 / 230,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'Light colour, preferably white background',
        notes: 'Dimensions: 200 × 230 pixels (preferred, roughly 4.5cm × 3.5cm). File size: 20 KB to 50 KB.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 140,
        height: 60,
        unit: 'px',
        minKB: 10,
        maxKB: 20,
        aspectRatio: 140 / 60,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black ink pen',
        notes: 'Dimensions: 140 × 60 pixels. File size: 10 KB to 20 KB. Capital letters strictly not accepted.',
      },
      thumb_impression: {
        documentType: 'thumb_impression',
        format: ['jpg', 'jpeg'],
        width: 240,
        height: 240,
        unit: 'px',
        minKB: 20,
        maxKB: 50,
        aspectRatio: 1,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black or blue ink',
        notes: 'Dimensions: 240 × 240 pixels (3 cm × 3 cm). File size: 20 KB to 50 KB.',
      },
      handwritten_declaration: {
        documentType: 'handwritten_declaration',
        format: ['jpg', 'jpeg'],
        width: 800,
        height: 400,
        unit: 'px',
        minKB: 50,
        maxKB: 100,
        aspectRatio: 2,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black ink in English only',
        notes: 'Dimensions: 800 × 400 pixels (10 cm × 5 cm). File size: 50 KB to 100 KB. Must be written in the applicant’s own handwriting in English.',
      },
    },
  },
  {
    id: 'ibps-clerk',
    name: 'IBPS Clerk',
    organization: 'Institute of Banking Personnel Selection',
    category: 'Banking',
    slug: 'ibps-clerk',
    sourceUrl: 'https://www.ibps.in/',
    lastVerified: '2024-06-30',
    verificationStatus: 'Historical archive',
    recruitmentCycle: '2024-25',
    notificationNumber: 'CRP CSA-XIV',
    applicationUrl: 'https://www.ibps.in/',
    active: true,
    notes: 'Common Recruitment Process for Customer Service Associates (Clerical cadre) CRP CSA-XIV.',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: 200,
        height: 230,
        unit: 'px',
        minKB: 20,
        maxKB: 50,
        aspectRatio: 200 / 230,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'Light colour, preferably white',
        notes: 'Dimensions: 200 × 230 pixels. File size: 20 KB to 50 KB.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 140,
        height: 60,
        unit: 'px',
        minKB: 10,
        maxKB: 20,
        aspectRatio: 140 / 60,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black ink',
        notes: 'Dimensions: 140 × 60 pixels. File size: 10 KB to 20 KB. No block letters.',
      },
      thumb_impression: {
        documentType: 'thumb_impression',
        format: ['jpg', 'jpeg'],
        width: 240,
        height: 240,
        unit: 'px',
        minKB: 20,
        maxKB: 50,
        aspectRatio: 1,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black or blue ink',
        notes: 'Dimensions: 240 × 240 pixels. File size: 20 KB to 50 KB.',
      },
      handwritten_declaration: {
        documentType: 'handwritten_declaration',
        format: ['jpg', 'jpeg'],
        width: 800,
        height: 400,
        unit: 'px',
        minKB: 50,
        maxKB: 100,
        aspectRatio: 2,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black ink',
        notes: 'Dimensions: 800 × 400 pixels. File size: 50 KB to 100 KB.',
      },
    },
  },
  {
    id: 'sbi-po',
    name: 'SBI PO',
    organization: 'State Bank of India',
    category: 'Banking',
    slug: 'sbi-po',
    sourceUrl: 'https://sbi.co.in/web/careers',
    lastVerified: '2024-09-10',
    verificationStatus: 'Historical archive',
    recruitmentCycle: '2024-25',
    notificationNumber: 'CRPD/PO/2024-25',
    applicationUrl: 'https://sbi.co.in/web/careers',
    active: true,
    notes: 'Recruitment of Probationary Officers in State Bank of India.',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: 200,
        height: 230,
        unit: 'px',
        minKB: 20,
        maxKB: 50,
        aspectRatio: 200 / 230,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'Light colour, preferably white',
        notes: 'Dimensions: 200 × 230 pixels. File size: 20 KB to 50 KB.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 140,
        height: 60,
        unit: 'px',
        minKB: 10,
        maxKB: 20,
        aspectRatio: 140 / 60,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black ink',
        notes: 'Dimensions: 140 × 60 pixels. File size: 10 KB to 20 KB. Capital letters not accepted.',
      },
      thumb_impression: {
        documentType: 'thumb_impression',
        format: ['jpg', 'jpeg'],
        width: 240,
        height: 240,
        unit: 'px',
        minKB: 20,
        maxKB: 50,
        aspectRatio: 1,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black/blue ink',
        notes: 'Dimensions: 240 × 240 pixels. File size: 20 KB to 50 KB.',
      },
      handwritten_declaration: {
        documentType: 'handwritten_declaration',
        format: ['jpg', 'jpeg'],
        width: 800,
        height: 400,
        unit: 'px',
        minKB: 50,
        maxKB: 100,
        aspectRatio: 2,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black ink',
        notes: 'Dimensions: 800 × 400 pixels. File size: 50 KB to 100 KB.',
      },
    },
  },
  {
    id: 'sbi-clerk',
    name: 'SBI Clerk (Junior Associate)',
    organization: 'State Bank of India',
    category: 'Banking',
    slug: 'sbi-clerk',
    sourceUrl: 'https://sbi.co.in/web/careers',
    lastVerified: '2024-01-15',
    verificationStatus: 'Historical archive',
    recruitmentCycle: '2024',
    notificationNumber: 'CRPD/CR/2023-24/27',
    applicationUrl: 'https://sbi.co.in/web/careers',
    active: true,
    notes: 'Recruitment of Junior Associates (Customer Support & Sales) in SBI.',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: 200,
        height: 230,
        unit: 'px',
        minKB: 20,
        maxKB: 50,
        aspectRatio: 200 / 230,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'Light colour, preferably white',
        notes: 'Dimensions: 200 × 230 pixels. File size: 20 KB to 50 KB.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 140,
        height: 60,
        unit: 'px',
        minKB: 10,
        maxKB: 20,
        aspectRatio: 140 / 60,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black ink',
        notes: 'Dimensions: 140 × 60 pixels. File size: 10 KB to 20 KB.',
      },
    },
  },

  // --- State Recruitment Category ---
  {
    id: 'appsc-group-2',
    name: 'APPSC Group 2',
    organization: 'Andhra Pradesh Public Service Commission',
    category: 'State Recruitment',
    slug: 'appsc-group-2',
    sourceUrl: 'https://psc.ap.gov.in/',
    lastVerified: '2023-12-07',
    verificationStatus: 'Historical archive',
    recruitmentCycle: '2023-24',
    notificationNumber: 'Notification No. 11/2023',
    applicationUrl: 'https://psc.ap.gov.in/',
    active: true,
    notes: 'Recruitment to Group-II Services in Andhra Pradesh. Official photo (3.5cm × 4.5cm, up to 50KB) and signature (3.5cm × 1.5cm, up to 30KB).',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: 3.5,
        height: 4.5,
        unit: 'cm',
        minKB: 10,
        maxKB: 50,
        aspectRatio: 3.5 / 4.5,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'Light/white background with clear contrast',
        notes: 'Dimensions: 3.5 cm (width) × 4.5 cm (height). File size: up to 50 KB (minimum 10 KB).',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 3.5,
        height: 1.5,
        unit: 'cm',
        minKB: 5,
        maxKB: 30,
        aspectRatio: 3.5 / 1.5,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black/blue ink',
        notes: 'Dimensions: 3.5 cm (width) × 1.5 cm (height). File size: up to 30 KB (minimum 5 KB).',
      },
    },
  },
  {
    id: 'appsc-group-1',
    name: 'APPSC Group 1',
    organization: 'Andhra Pradesh Public Service Commission',
    category: 'State Recruitment',
    slug: 'appsc-group-1',
    sourceUrl: 'https://psc.ap.gov.in/',
    lastVerified: '2024-01-01',
    verificationStatus: 'Historical archive',
    recruitmentCycle: '2024',
    notificationNumber: 'Notification No. 12/2023',
    applicationUrl: 'https://psc.ap.gov.in/',
    active: true,
    notes: 'Recruitment to Group-I Services in Andhra Pradesh.',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: 3.5,
        height: 4.5,
        unit: 'cm',
        minKB: 10,
        maxKB: 50,
        aspectRatio: 3.5 / 4.5,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'Light/white background',
        notes: 'Dimensions: 3.5 cm × 4.5 cm. File size: up to 50 KB.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 3.5,
        height: 1.5,
        unit: 'cm',
        minKB: 5,
        maxKB: 30,
        aspectRatio: 3.5 / 1.5,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black ink',
        notes: 'Dimensions: 3.5 cm × 1.5 cm. File size: up to 30 KB.',
      },
    },
  },

  // --- All India Category ---
  {
    id: 'upsc-cse',
    name: 'UPSC Civil Services (CSE)',
    organization: 'Union Public Service Commission',
    category: 'All India',
    slug: 'upsc-cse',
    sourceUrl: 'https://upsconline.nic.in/',
    lastVerified: '2024-02-14',
    verificationStatus: 'Historical archive',
    recruitmentCycle: '2024',
    notificationNumber: '05/2024-CSP',
    applicationUrl: 'https://upsconline.nic.in/',
    active: true,
    notes: 'Civil Services Examination 2024. Strict UPSC rules: photo must be square (350×350 to 1000×1000 px), name of candidate and date on which photograph was taken must be clearly printed at the bottom.',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: 350,
        height: 350,
        unit: 'px',
        minKB: 20,
        maxKB: 300,
        aspectRatio: 1,
        nameRequired: true,
        dateRequired: true,
        backgroundRequirement: 'Plain white background; 3/4th face visibility',
        notes: 'Dimensions: minimum 350 × 350 pixels up to 1000 × 1000 pixels. File size: 20 KB to 300 KB. Candidate name and date of photo capture MUST be printed on the photo.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 350,
        height: 350,
        unit: 'px',
        minKB: 20,
        maxKB: 300,
        aspectRatio: 1,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black ink',
        notes: 'Dimensions: minimum 350 × 350 pixels up to 1000 × 1000 pixels. File size: 20 KB to 300 KB.',
      },
    },
  },
  {
    id: 'upsc-nda',
    name: 'UPSC NDA / CDS',
    organization: 'Union Public Service Commission',
    category: 'All India',
    slug: 'upsc-nda',
    sourceUrl: 'https://upsconline.nic.in/',
    lastVerified: '2024-05-15',
    verificationStatus: 'Historical archive',
    recruitmentCycle: '2024 (II)',
    notificationNumber: '10/2024-NDA-II',
    applicationUrl: 'https://upsconline.nic.in/',
    active: true,
    notes: 'National Defence Academy and Naval Academy Examination (II) 2024. Standard UPSC rules apply: square photo with printed name and date.',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: 350,
        height: 350,
        unit: 'px',
        minKB: 20,
        maxKB: 300,
        aspectRatio: 1,
        nameRequired: true,
        dateRequired: true,
        backgroundRequirement: 'Plain white background',
        notes: 'Dimensions: 350 × 350 to 1000 × 1000 px. File size: 20 KB to 300 KB. Name and Date of capture MUST be printed at bottom.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 350,
        height: 350,
        unit: 'px',
        minKB: 20,
        maxKB: 300,
        aspectRatio: 1,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black ink',
        notes: 'Dimensions: 350 × 350 to 1000 × 1000 px. File size: 20 KB to 300 KB.',
      },
    },
  },
  {
    id: 'ctet',
    name: 'CTET',
    organization: 'Central Board of Secondary Education',
    category: 'All India',
    slug: 'ctet',
    sourceUrl: 'https://ctet.nic.in/',
    lastVerified: '2024-09-17',
    verificationStatus: 'Historical archive',
    recruitmentCycle: 'Dec 2024',
    notificationNumber: 'CTET-Dec-2024',
    applicationUrl: 'https://ctet.nic.in/',
    active: true,
    notes: 'Central Teacher Eligibility Test Dec 2024.',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: 3.5,
        height: 4.5,
        unit: 'cm',
        minKB: 10,
        maxKB: 100,
        aspectRatio: 3.5 / 4.5,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'Light/white background with 80% face coverage',
        notes: 'Dimensions: 3.5 cm (width) × 4.5 cm (height). File size: 10 KB to 100 KB.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 3.5,
        height: 1.5,
        unit: 'cm',
        minKB: 3,
        maxKB: 30,
        aspectRatio: 3.5 / 1.5,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black ink',
        notes: 'Dimensions: 3.5 cm (width) × 1.5 cm (height). File size: 3 KB to 30 KB.',
      },
    },
  },
];

export function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

export function slugToCategory(slug: string): ExamCategory | undefined {
  const normalized = slug.toLowerCase();
  return EXAM_CATEGORIES.find((cat) => categoryToSlug(cat) === normalized);
}

export function getExamBySlug(slug: string): ExamRecord | undefined {
  return EXAM_DATABASE.find((e) => e.slug === slug);
}

export function getExamById(id: string): ExamRecord | undefined {
  return EXAM_DATABASE.find((e) => e.id === id);
}

export function getExamsByCategory(category: ExamCategory): ExamRecord[] {
  return EXAM_DATABASE.filter((e) => e.category === category);
}

export function searchExams(query: string): ExamRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return EXAM_DATABASE.filter((e) => e.active);
  return EXAM_DATABASE.filter(
    (e) =>
      e.active &&
      (e.name.toLowerCase().includes(q) ||
        e.organization.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.slug.toLowerCase().includes(q) ||
        (e.notificationNumber && e.notificationNumber.toLowerCase().includes(q)))
  );
}

export function validateExamDatabase(): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const exam of EXAM_DATABASE) {
    if (ids.has(exam.id)) {
      errors.push(`Duplicate exam ID found: ${exam.id}`);
    }
    ids.add(exam.id);

    if (!exam.recruitmentCycle) {
      errors.push(`Exam ${exam.id} is missing a recruitment cycle.`);
    }

    if (exam.verificationStatus === 'Verified for current cycle' && !exam.sourceUrl) {
      errors.push(`Exam ${exam.id} is marked as verified but has no sourceUrl.`);
    }

    Object.entries(exam.requirements).forEach(([docKey, req]) => {
      // If live capture is required or verification is pending, sizing limits might be 0, so bypass the check
      if (!req.liveCaptureRequired && exam.verificationStatus !== 'Verification pending') {
        if (req.minKB >= req.maxKB && req.maxKB !== 0) {
          errors.push(`Exam ${exam.id} requirement ${docKey} has minKB >= maxKB.`);
        }
      }
      if (req.width !== null && req.width <= 0) {
        errors.push(`Exam ${exam.id} requirement ${docKey} has invalid width.`);
      }
      if (req.height !== null && req.height <= 0) {
        errors.push(`Exam ${exam.id} requirement ${docKey} has invalid height.`);
      }
    });
  }

  return errors;
}
