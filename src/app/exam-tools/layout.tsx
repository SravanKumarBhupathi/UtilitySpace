import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exam Tools – Photo, Signature & Document Preparation | UtilitySpace',
  description:
    'Officially verified photo, signature, and document preparation tools for SSC, Railway (RRB), Banking (IBPS, SBI), State PSC, and All India exams. 100% free and client-side private.',
  alternates: {
    canonical: 'https://utilityspace.online/exam-tools',
  },
  openGraph: {
    title: 'Exam Tools – Photo, Signature & Document Preparation | UtilitySpace',
    description:
      'Officially verified photo, signature, and document preparation tools for SSC, Railway (RRB), Banking (IBPS, SBI), State PSC, and All India exams. 100% free and client-side private.',
    url: 'https://utilityspace.online/exam-tools',
    siteName: 'UtilitySpace',
    type: 'website',
  },
};

export default function ExamToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
