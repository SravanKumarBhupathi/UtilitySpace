import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Government Jobs & Latest Recruitments | UtilitySpace',
  description: 'Discover the latest verified government job notifications, track application deadlines, and prepare your documents instantly with UtilitySpace.',
};

export default function GovernmentJobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
