import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | UtilitySpace",
  description: "Learn how UtilitySpace handles user privacy, local client-side tool processing, cookies, and our third-party advertising policies including Google AdSense.",
  alternates: {
    canonical: "https://utilityspace.online/privacy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.40))] bg-background">
      <header className="mb-10 pb-6 border-b border-border">
        <h1 className="font-heading text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-secondary-text">
          Last Updated: October 2026 • Effective Date: October 2026
        </p>
      </header>

      <main className="prose prose-slate dark:prose-invert max-w-none text-secondary-text space-y-6 text-base leading-relaxed">
        <p>
          At <strong>UtilitySpace</strong> (accessible from{" "}
          <Link href="https://utilityspace.online" className="text-primary hover:underline">
            https://utilityspace.online
          </Link>
          ), the privacy of our visitors is one of our main priorities. This Privacy Policy document outlines the types of information that are collected and recorded by UtilitySpace and how we use it.
        </p>

        <h2 className="font-heading text-2xl font-bold text-foreground mt-8 mb-4">
          1. 100% Client-Side Processing for Tools & Calculators
        </h2>
        <p>
          Unlike traditional web converters and utilities, the majority of tools, calculators, image editors, and text utilities on UtilitySpace execute <strong>entirely in your client browser using HTML5 Canvas, WebAssembly, and JavaScript</strong>.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Your photos, documents, and text entries are <strong>never uploaded to our servers</strong>.</li>
          <li>Calculations and conversions happen locally on your device.</li>
          <li>We have no access to the files you inspect, edit, compress, or convert.</li>
        </ul>

        <h2 className="font-heading text-2xl font-bold text-foreground mt-8 mb-4">
          2. Log Files & Standard Web Traffic Data
        </h2>
        <p>
          UtilitySpace follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users&apos; movement on the website, and gathering demographic information.
        </p>

        <h2 className="font-heading text-2xl font-bold text-foreground mt-8 mb-4">
          3. Cookies and Web Beacons
        </h2>
        <p>
          Like any other website, UtilitySpace uses &quot;cookies&quot;. These cookies are used to store information including visitors&apos; preferences (such as your Light/Dark mode choice), and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.
        </p>

        <h2 className="font-heading text-2xl font-bold text-foreground mt-8 mb-4">
          4. Google DoubleClick DART Cookie & Third-Party Advertising Partners
        </h2>
        <p>
          Google is one of our third-party vendors. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to <code>utilityspace.online</code> and other sites on the internet.
        </p>
        <div className="p-4 bg-muted/60 rounded-lg border border-border space-y-3">
          <p className="font-semibold text-foreground">Important AdSense Disclosures:</p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>
              Third-party vendors, including <strong>Google</strong>, use cookies to serve ads based on a user&apos;s prior visits to our website or other websites on the internet.
            </li>
            <li>
              Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visits to our site and/or other sites on the Internet.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                Google Ads Settings (https://www.google.com/settings/ads)
              </a>
              .
            </li>
            <li>
              Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting{" "}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                www.aboutads.info/choices/
              </a>
              .
            </li>
          </ul>
        </div>

        <h2 className="font-heading text-2xl font-bold text-foreground mt-8 mb-4">
          5. Third-Party Privacy Policies
        </h2>
        <p>
          UtilitySpace&apos;s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
        </p>
        <p>
          You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management with specific web browsers, it can be found at the browsers&apos; respective websites.
        </p>

        <h2 className="font-heading text-2xl font-bold text-foreground mt-8 mb-4">
          6. CCPA Privacy Rights (Do Not Sell My Personal Information)
        </h2>
        <p>Under the CCPA, among other rights, California consumers have the right to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Request that a business disclose the categories and specific pieces of personal data collected about consumers.</li>
          <li>Request that a business delete any personal data about the consumer that a business has collected.</li>
          <li>Request that a business that sells a consumer&apos;s personal data, not sell the consumer&apos;s personal data.</li>
        </ul>
        <p>If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us.</p>

        <h2 className="font-heading text-2xl font-bold text-foreground mt-8 mb-4">
          7. GDPR Data Protection Rights
        </h2>
        <p>We want to make sure you are fully aware of all of your data protection rights under European law. Every user is entitled to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>The right to access:</strong> You have the right to request copies of your personal data.</li>
          <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate.</li>
          <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions.</li>
          <li><strong>The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data.</li>
          <li><strong>The right to object to processing:</strong> You have the right to object to our processing of your personal data.</li>
          <li><strong>The right to data portability:</strong> You have the right to request that we transfer the data that we have collected to another organization, or directly to you.</li>
        </ul>

        <h2 className="font-heading text-2xl font-bold text-foreground mt-8 mb-4">
          8. Children&apos;s Information
        </h2>
        <p>
          Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. UtilitySpace does not knowingly collect any Personal Identifiable Information from children under the age of 13.
        </p>

        <h2 className="font-heading text-2xl font-bold text-foreground mt-8 mb-4">
          9. Contact Us
        </h2>
        <p>
          If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at:
        </p>
        <p className="font-medium text-foreground">
          Email:{" "}
          <a href="mailto:contact@utilityspace.online" className="text-primary hover:underline">
            contact@utilityspace.online
          </a>
        </p>
      </main>
    </div>
  );
}
