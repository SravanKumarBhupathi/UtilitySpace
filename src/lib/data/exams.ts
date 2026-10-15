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
    sourceUrl: 'https://ssc.nic.in/',
    lastVerified: '2024-01-15',
    verificationStatus: 'Historical archive',
    recruitmentCycle: '2023-2024',
    notificationNumber: null,
    applicationUrl: null,
    active: true,
    notes: 'Combined Graduate Level Examination',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: 350,
        height: 450,
        unit: 'px',
        minKB: 20,
        maxKB: 50,
        aspectRatio: 350/450,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'Light or white background',
        notes: 'Photo should be taken without spectacles or cap. Date and Name are not strictly required on the photo anymore, but check current notification.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 400,
        height: 200,
        unit: 'px',
        minKB: 10,
        maxKB: 20,
        aspectRatio: 2,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with black/blue ink',
        notes: 'Signature must not be blurred.',
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
    lastVerified: '2024-01-20',
    verificationStatus: 'Historical archive',
    recruitmentCycle: '2023-2024',
    notificationNumber: null,
    applicationUrl: null,
    active: true,
    notes: 'Probationary Officer/Management Trainee',
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
        backgroundRequirement: 'Light background',
        notes: 'Recent passport size photograph.',
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
        notes: 'Signature in capital letters is NOT accepted.',
      }
    }
  },
  {
    id: 'upsc-civil-services',
    name: 'UPSC Civil Services',
    organization: 'Union Public Service Commission',
    category: 'UPSC',
    slug: 'upsc-civil-services',
    sourceUrl: 'https://upsc.gov.in/',
    lastVerified: '2024-02-10',
    verificationStatus: 'Historical archive',
    recruitmentCycle: '2023-2024',
    notificationNumber: null,
    applicationUrl: null,
    active: true,
    notes: 'Civil Services (Preliminary) Examination',
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
        backgroundRequirement: 'Light background',
        notes: 'Name of candidate and date of photograph must be clearly printed at the bottom. Photo should not be more than 10 days old from start of application.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg'],
        width: 350,
        height: 350, // UPSC often specifies min 350x350 and max 1000x1000 for both, but usually it's just a square or proportional bounds.
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
    id: 'rrb-ntpc',
    name: 'RRB NTPC',
    organization: 'Railway Recruitment Board',
    category: 'Railway',
    slug: 'rrb-ntpc',
    sourceUrl: 'https://indianrailways.gov.in/',
    lastVerified: '2024-02-05',
    verificationStatus: 'Verification pending',
    recruitmentCycle: '2023-2024',
    notificationNumber: null,
    applicationUrl: null,
    active: true,
    notes: 'Non Technical Popular Categories',
    requirements: {
      photo: {
        documentType: 'photo',
        format: ['jpg', 'jpeg'],
        width: 320,
        height: 380, // roughly 35mm x 45mm at ~200dpi
        unit: 'px',
        minKB: 20,
        maxKB: 50,
        aspectRatio: 35/45,
        nameRequired: true,
        dateRequired: true,
        backgroundRequirement: 'White/Light Color',
        notes: 'Name and date should be printed on the photograph.',
      },
      signature: {
        documentType: 'signature',
        format: ['jpg', 'jpeg'],
        width: 400,
        height: 150, // roughly 50mm x 20mm
        unit: 'px',
        minKB: 10,
        maxKB: 40,
        aspectRatio: 50/20,
        nameRequired: false,
        dateRequired: false,
        backgroundRequirement: 'White paper with Black/Blue ink',
        notes: 'Running handwriting required. Block letters not allowed.',
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

    if (exam.verificationStatus === 'Verified for current cycle' && !exam.sourceUrl) {
      errors.push(`Exam ${exam.id} is marked as verified but has no sourceUrl.`);
    }

    if (!exam.recruitmentCycle) {
      errors.push(`Exam ${exam.id} is missing a recruitment cycle.`);
    }

    for (const [key, req] of Object.entries(exam.requirements)) {
      if (req.minKB >= req.maxKB) {
        errors.push(`Exam ${exam.id} requirement ${key} has minKB >= maxKB.`);
      }
      if (req.width !== null && req.width <= 0) {
        errors.push(`Exam ${exam.id} requirement ${key} has invalid width.`);
      }
      if (req.height !== null && req.height <= 0) {
        errors.push(`Exam ${exam.id} requirement ${key} has invalid height.`);
      }
    }
  }

  return errors;
}
