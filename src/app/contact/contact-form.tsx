"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail, Send } from "lucide-react";

export function ContactForm() {
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
    <>
      {submitted ? (
        <Card className="border-primary/30 bg-primary/5 shadow-sm">
          <CardContent className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Thank You for Reaching Out!
            </h2>
            <p className="text-secondary-text max-w-md mx-auto">
              We have received your message and will review it promptly. Our team typically responds within 24 to 48 business hours.
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setMessage("");
                }}
              >
                Send Another Message
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm border-border">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  required
                  placeholder="e.g. Alex Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  className="flex w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-secondary-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[140px] resize-y"
                  placeholder="How can we help you? Describe a bug, suggest a new tool, or send general feedback..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full md:w-auto gap-2" size="lg">
                <Send className="w-4 h-4" /> Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
