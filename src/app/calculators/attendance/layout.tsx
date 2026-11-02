import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attendance Calculator — Track College & School Attendance",
  description: "Calculate your class attendance percentage and see how many classes you can skip or need to attend to meet minimum attendance criteria.",
  alternates: {
    canonical: "https://utilityspace.online/calculators/attendance",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
