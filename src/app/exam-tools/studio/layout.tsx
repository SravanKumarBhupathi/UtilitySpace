import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Custom Document Studio – Photo & Signature Resizer | UtilitySpace',
  description:
    'Free client-side tool to resize, crop, enhance, and compress passport photos and signatures to exact pixels, cm, mm, DPI, and KB limits for any exam or portal.',
  alternates: {
    canonical: 'https://utilityspace.online/exam-tools/studio',
  },
  openGraph: {
    title: 'Custom Document Studio – Photo & Signature Resizer | UtilitySpace',
    description:
      'Free client-side tool to resize, crop, enhance, and compress passport photos and signatures to exact pixels, cm, mm, DPI, and KB limits for any exam or portal.',
    url: 'https://utilityspace.online/exam-tools/studio',
    siteName: 'UtilitySpace',
    type: 'website',
  },
};

export default function ExamStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
