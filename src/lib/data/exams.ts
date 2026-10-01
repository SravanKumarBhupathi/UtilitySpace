export type DocumentRequirement = {
  documentType: 'photo' | 'signature' | 'thumb_impression' | 'other';
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

export type ExamRecord = {
  id: string;
  name: string;
  organization: string;
  category: ExamCategory;
  slug: string;
  requirements: Record<string, DocumentRequirement>; // 'photo' | 'signature' etc
  sourceUrl: string | null;
  lastVerified: string;
  verificationStatus: 'Verified' | 'Needs verification' | 'Information may have changed';
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
    verificationStatus: 'Verified',
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
    verificationStatus: 'Verified',
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
    verificationStatus: 'Verified',
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
    verificationStatus: 'Needs verification',
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
