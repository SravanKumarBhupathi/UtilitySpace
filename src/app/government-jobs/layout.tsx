import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Government Jobs & Latest Recruitment Notifications | UtilitySpace',
  description: 'Explore government recruitment notifications, eligibility, important dates, exam patterns, and official application links. Prepare application documents with UtilitySpace.',
};

export default function GovernmentJobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
