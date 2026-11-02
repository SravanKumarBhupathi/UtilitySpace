import type { Metadata } from "next";
import { Mail, Clock, ShieldCheck } from "lucide-react";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us | UtilitySpace",
  description: "Get in touch with the UtilitySpace team. Send feedback, report tool bugs, or suggest new calculators and utilities.",
  alternates: {
    canonical: "https://utilityspace.online/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.40))] bg-background">
      <header className="mb-10 text-center">
        <h1 className="font-heading text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
          Contact UtilitySpace
        </h1>
        <p className="text-lg text-secondary-text max-w-xl mx-auto">
          Have a suggestion, found a bug in one of our tools, or want to request a new utility? We&apos;d love to hear from you.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="p-6 bg-card rounded-xl border border-border text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-semibold text-foreground mb-1">Direct Email</h3>
          <p className="text-sm text-secondary-text mb-2">Write directly to our inbox</p>
          <a href="mailto:contact@utilityspace.online" className="text-primary hover:underline font-medium text-sm">
            contact@utilityspace.online
          </a>
        </div>

        <div className="p-6 bg-card rounded-xl border border-border text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-semibold text-foreground mb-1">Response Time</h3>
          <p className="text-sm text-secondary-text mb-2">We value your inquiries</p>
          <span className="text-foreground font-medium text-sm">Typically 24–48 Hours</span>
        </div>

        <div className="p-6 bg-card rounded-xl border border-border text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-semibold text-foreground mb-1">Privacy Focused</h3>
          <p className="text-sm text-secondary-text mb-2">Your information is safe</p>
          <span className="text-foreground font-medium text-sm">Never shared or sold</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <ContactForm />
      </div>
    </div>
  );
}
