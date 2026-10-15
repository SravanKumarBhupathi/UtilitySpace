export type DocumentRequirement = {
  documentType: 'photo' | 'signature' | 'thumb_impression' | 'handwritten_declaration' | 'other';
  format: string[]; // e.g., ['jpg', 'jpeg']
  width: number | null; // px
  height: number | null; // px
  unit: 'px' | 'cm' | 'mm';
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
  | 'UPSC'
  | 'Teaching'
  | 'Police'
  | 'State PSC'
  | 'Judiciary'
  | 'Defence'
  | 'Other';

export type VerificationStatus =
  | 'Verified for current cycle'
  | 'Verification pending'
  | 'Closed recruitment'
  | 'Historical archive'
  | 'Source unavailable'
  | 'Superseded by newer notification';

export type ExamRecord = {
  id: string;
  name: string;
  organization: string;
  category: ExamCategory;
  slug: string;
  recruitmentCycle: string;
  notificationNumber: string | null;
  requirements: Record<string, DocumentRequirement>; // 'photo' | 'signature' etc
  sourceUrl: string | null;
  applicationUrl: string | null;
  lastVerified: string;
  verificationStatus: VerificationStatus;
  notes: string | null;
  active: boolean;
};

export const EXAM_DATABASE: ExamRecord[] = [
  {
    id: 'ssc-cgl',
    name: 'SSC CGL',
    organization: 'Staff Selection Commission',
    category: 'SSC',
    slug: 'ssc-cgl',
    sourceUrl: 'https://ssc.gov.in/',
    lastVerified: '2024-06-25',
    verificationStatus: 'Verified for current cycle',
    recruitmentCycle: '2024',
    notificationNumber: 'HQ-PPI03/11/2024-PP_1',
    applicationUrl: 'https://ssc.gov.in/',
    active: true,
    notes: 'Combined Graduate Level Examination 2024. NOTE: Photograph is captured LIVE during the application via webcam or the MySSC app. Upload is only required for the signature.',
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
        notes: 'Photo must be captured LIVE. Do not upload a pre-scanned photo.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 236, // ~4cm
        height: 118, // ~2cm
        unit: 'cm', // 4cm x 2cm specified
        minKB: 10,
        maxKB: 20,
        aspectRatio: 2,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black/blue ink',
        notes: 'Dimensions are roughly 4cm x 2cm. Must not be blurred.',
      }
    }
  },
  {
    id: 'ssc-chsl',
    name: 'SSC CHSL',
    organization: 'Staff Selection Commission',
    category: 'SSC',
    slug: 'ssc-chsl',
    sourceUrl: 'https://ssc.gov.in/',
    lastVerified: '2024-04-08',
    verificationStatus: 'Verified for current cycle',
    recruitmentCycle: '2024',
    notificationNumber: 'HQ-PPI03/3/2024-PP_1',
    applicationUrl: 'https://ssc.gov.in/',
    active: true,
    notes: 'Combined Higher Secondary Level 2024. Live photo capture required.',
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
        width: 236,
        height: 118,
        unit: 'cm',
        minKB: 10,
        maxKB: 20,
        aspectRatio: 2,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black ink',
        notes: 'Must not be blurred. 4cm x 2cm.',
      }
    }
  },
  {
    id: 'rrb-ntpc-graduate',
    name: 'RRB NTPC (Graduate)',
    organization: 'Railway Recruitment Board',
    category: 'Railway',
    slug: 'rrb-ntpc-graduate',
    sourceUrl: 'https://indianrailways.gov.in/',
    lastVerified: '2024-09-02',
    verificationStatus: 'Verified for current cycle',
    recruitmentCycle: '2024',
    notificationNumber: 'CEN 05/2024',
    applicationUrl: 'https://www.rrbapply.gov.in/',
    active: true,
    notes: 'NTPC Graduate Level Posts (CEN 05/2024)',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: 320,
        height: 240, // 35mm x 45mm reversed standard or just general px
        unit: 'px', // Official sets 320x240 pixels (Width x Height) -> note that usually it's W 320 H 240 or standard 35x45
        minKB: 30,
        maxKB: 70,
        aspectRatio: 35/45, // usually 35mm x 45mm
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White/Light color background',
        notes: 'Must be a recent color passport photograph (35mm x 45mm) against a plain white background. Format: JPG/JPEG. Size: 30-70 KB.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 140, // 50mm x 20mm
        height: 60,
        unit: 'mm', // 50mm x 20mm
        minKB: 30,
        maxKB: 70,
        aspectRatio: 2.5,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with Blue/Black ink',
        notes: 'Format: JPG/JPEG. Size: 30-70 KB. Must be 50mm x 20mm or 140x60 pixels.',
      }
    }
  },
  {
    id: 'ibps-po',
    name: 'IBPS PO',
    organization: 'Institute of Banking Personnel Selection',
    category: 'Banking',
    slug: 'ibps-po',
    sourceUrl: 'https://www.ibps.in/',
    lastVerified: '2024-08-01',
    verificationStatus: 'Verified for current cycle',
    recruitmentCycle: '2024-2025',
    notificationNumber: 'CRP PO/MT-XIV',
    applicationUrl: 'https://ibpsonline.ibps.in/',
    active: true,
    notes: 'Probationary Officers / Management Trainees (CRP PO/MT-XIV). Requires photo, signature, left thumb impression, and handwritten declaration.',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: 200,
        height: 230,
        unit: 'px',
        minKB: 20,
        maxKB: 50,
        aspectRatio: 200/230,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'Light-colored, preferably white',
        notes: '4.5cm × 3.5cm. 200 x 230 pixels preferred.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 140,
        height: 60,
        unit: 'px',
        minKB: 10,
        maxKB: 20,
        aspectRatio: 140/60,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black ink',
        notes: '140 x 60 pixels preferred. Signature in CAPITAL LETTERS is NOT accepted.',
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
        notes: 'Left thumb impression. 3cm x 3cm. 240 x 240 pixels in 200 DPI preferred.',
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
        notes: '10cm x 5cm. 800 x 400 pixels in 200 DPI preferred. Must not be written in CAPITAL LETTERS.',
      }
    }
  },
  {
    id: 'sbi-po',
    name: 'SBI PO',
    organization: 'State Bank of India',
    category: 'Banking',
    slug: 'sbi-po',
    sourceUrl: 'https://sbi.co.in/web/careers',
    lastVerified: '2023-09-06',
    verificationStatus: 'Historical archive',
    recruitmentCycle: '2023',
    notificationNumber: 'CRPD/PO/2023-24/19',
    applicationUrl: null,
    active: true,
    notes: 'Probationary Officers. (Awaiting 2024 notification, showing 2023 rules). Requirements mirror IBPS generally.',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: 200,
        height: 230,
        unit: 'px',
        minKB: 20,
        maxKB: 50,
        aspectRatio: 200/230,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White or light-colored',
        notes: 'Dimensions 200 x 230 pixels.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 140,
        height: 60,
        unit: 'px',
        minKB: 10,
        maxKB: 20,
        aspectRatio: 140/60,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black ink',
        notes: 'Signature in CAPITAL LETTERS is NOT accepted.',
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
        notes: 'Left thumb impression.',
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
        notes: 'Must not be written in CAPITAL LETTERS.',
      }
    }
  },
  {
    id: 'upsc-cse',
    name: 'UPSC Civil Services',
    organization: 'Union Public Service Commission',
    category: 'UPSC',
    slug: 'upsc-cse',
    sourceUrl: 'https://upsc.gov.in/',
    lastVerified: '2024-02-14',
    verificationStatus: 'Verified for current cycle',
    recruitmentCycle: '2024',
    notificationNumber: '05/2024-CSP',
    applicationUrl: 'https://upsconline.nic.in/',
    active: true,
    notes: 'Civil Services (Preliminary) Examination 2024. Note: Name and Date of Photo are MANDATORY on the photograph.',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg'],
        width: 350,
        height: 350,
        unit: 'px',
        minKB: 20,
        maxKB: 300,
        aspectRatio: 1, // Must be square
        nameRequired: true,
        dateRequired: true,
        backgroundRequirement: 'White background',
        notes: 'Dimensions must be greater than 350x350 and less than 1000x1000 pixels. Must contain the candidate name and date of capture at the bottom. Date of capture must be within 10 days of notification.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg'],
        width: 350,
        height: 350,
        unit: 'px',
        minKB: 20,
        maxKB: 300,
        aspectRatio: null,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper',
        notes: 'Dimensions must be greater than 350x350 and less than 1000x1000 pixels.',
      }
    }
  },
  {
    id: 'ctet',
    name: 'CTET',
    organization: 'Central Board of Secondary Education',
    category: 'Teaching',
    slug: 'ctet',
    sourceUrl: 'https://ctet.nic.in/',
    lastVerified: '2024-09-17',
    verificationStatus: 'Verified for current cycle',
    recruitmentCycle: 'Dec 2024',
    notificationNumber: 'CTET-Dec-2024',
    applicationUrl: 'https://ctet.nic.in/',
    active: true,
    notes: 'Central Teacher Eligibility Test Dec 2024.',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: 250,
        height: 310, // 3.5cm x 4.5cm
        unit: 'cm', // 3.5cm x 4.5cm
        minKB: 10,
        maxKB: 100,
        aspectRatio: 3.5/4.5,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'Light background',
        notes: 'Dimensions: 3.5 cm (width) x 4.5 cm (height). Size: 10 to 100 KB.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 250,
        height: 100, // 3.5cm x 1.5cm
        unit: 'cm', // 3.5cm x 1.5cm
        minKB: 3,
        maxKB: 30,
        aspectRatio: 3.5/1.5,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper',
        notes: 'Dimensions: 3.5 cm (length) x 1.5 cm (height). Size: 3 to 30 KB.',
      }
    }
  },
  {
    id: 'nda-cds',
    name: 'UPSC NDA / CDS',
    organization: 'Union Public Service Commission',
    category: 'Defence',
    slug: 'upsc-nda',
    sourceUrl: 'https://upsc.gov.in/',
    lastVerified: '2024-05-15',
    verificationStatus: 'Verified for current cycle',
    recruitmentCycle: '2024 (II)',
    notificationNumber: '10/2024-NDA-II',
    applicationUrl: 'https://upsconline.nic.in/',
    active: true,
    notes: 'National Defence Academy and Naval Academy Examination (II) 2024. Follows standard UPSC strict photo rules.',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg'],
        width: 350,
        height: 350,
        unit: 'px',
        minKB: 20,
        maxKB: 300,
        aspectRatio: 1,
        nameRequired: true,
        dateRequired: true,
        backgroundRequirement: 'White background',
        notes: 'Square aspect ratio. Over 350x350 and under 1000x1000. Name and Date of capture MUST be printed at the bottom.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg'],
        width: 350,
        height: 350,
        unit: 'px',
        minKB: 20,
        maxKB: 300,
        aspectRatio: null,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper',
        notes: 'Dimensions must be greater than 350x350 and less than 1000x1000 pixels.',
      }
    }
  }
];

export function getExamBySlug(slug: string): ExamRecord | undefined {
  return EXAM_DATABASE.find(e => e.slug === slug);
}

export function getExamsByCategory(category: ExamCategory): ExamRecord[] {
  return EXAM_DATABASE.filter(e => e.category === category);
}

export function searchExams(query: string): ExamRecord[] {
  const q = query.toLowerCase();
  return EXAM_DATABASE.filter(e =>
    e.name.toLowerCase().includes(q) ||
    e.organization.toLowerCase().includes(q) ||
    e.category.toLowerCase().includes(q) ||
    e.slug.toLowerCase().includes(q)
  );
}

export const EXAM_CATEGORIES: ExamCategory[] = [
  'SSC', 'Railway', 'Banking', 'UPSC', 'Teaching', 'Police',
  'State PSC', 'Judiciary', 'Defence', 'Other'
];




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
      // If live capture is required, sizing limits might be 0, so bypass the check
      if (!req.liveCaptureRequired) {
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
