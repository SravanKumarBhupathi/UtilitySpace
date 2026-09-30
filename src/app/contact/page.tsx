"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 md:py-16 min-h-[calc(100vh-theme(spacing.16)-theme(spacing.40))] bg-background">
      <header className="mb-10 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground mb-4">
          Contact Us
        </h1>
        <p className="text-lg text-secondary-text">
          Have a question or a suggestion? We&apos;d love to hear from you.
        </p>
      </header>

      {submitted ? (
        <Card className="border-success/50 bg-success/5">
          <CardContent className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
            <h2 className="font-heading text-2xl font-bold text-foreground">Message received!</h2>
            <p className="text-secondary-text">
              Thank you for reaching out. Please note that this is a placeholder response as backend integration is pending.
            </p>
            <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-4">
              Send another message
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-md">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  required
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  required
                  className="flex w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-secondary-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[150px] resize-y"
                  placeholder="How can we help?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full md:w-auto" size="lg">Send Message</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
