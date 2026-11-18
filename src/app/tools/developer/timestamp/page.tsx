"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Clock } from "lucide-react";

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState<string>("");
  const [dateString, setDateString] = useState<string>("");
  const [currentTime, setCurrentTime] = useState<number>(0);

  // Results
  const [parsedFromTs, setParsedFromTs] = useState<Date | null>(null);
  const [parsedFromDate, setParsedFromDate] = useState<number | null>(null);

  useEffect(() => {
    setCurrentTime(Math.floor(Date.now() / 1000));
    const timer = setInterval(() => setCurrentTime(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTimestampChange = (val: string) => {
    setTimestamp(val);
    const ts = parseInt(val, 10);
    if (!isNaN(ts)) {
      // Determine if it's seconds or ms (rough heuristic)
      const isSeconds = val.length <= 10;
      const d = new Date(isSeconds ? ts * 1000 : ts);
      setParsedFromTs(!isNaN(d.getTime()) ? d : null);
    } else {
      setParsedFromTs(null);
    }
  };

  const handleDateChange = (val: string) => {
    setDateString(val);
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      setParsedFromDate(d.getTime());
    } else {
      setParsedFromDate(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const howToSteps = [
    "To convert a timestamp to a date: enter a Unix timestamp in seconds (10 digits) or milliseconds (13 digits) into the 'Timestamp to Date' box, or click 'Now' to use the current moment.",
    "The tool will instantly parse the number and display your Local Time, universal UTC Time, and standard ISO 8601 string.",
    "To convert a date to a timestamp: enter an ISO date, RFC string, or calendar date/time into the 'Date to Timestamp' field.",
    "Instantly view and copy the calculated Epoch time in either seconds or milliseconds using the one-click copy buttons.",
  ];

  const faqs = [
    {
      question: "What is Unix Epoch time?",
      answer: "Unix Epoch time (or POSIX timestamp) represents the total number of seconds that have elapsed since 00:00:00 UTC on January 1, 1970, not counting leap seconds. It is a universal, timezone-independent standard used across computer operating systems, databases, cloud servers, and APIs to store and synchronize time.",
    },
    {
      question: "What will happen in the Year 2038 (Y2038 bug)?",
      answer: "Legacy computing systems that store Unix timestamps as 32-bit signed integers will overflow on January 19, 2038 at 03:14:07 UTC (reaching the maximum value of 2,147,483,647 seconds). Upon overflowing, the integer wraps to a negative value, causing systems to misinterpret the date as December 13, 1901. Modern 64-bit systems eliminate this issue, extending the timestamp capability to over 292 billion years.",
    },
    {
      question: "How do local timezones affect Unix timestamps?",
      answer: "A Unix timestamp is identical worldwide at any specific instant because it is based on UTC. Timezones only affect how that universal timestamp is formatted into a human-readable string on a specific device (e.g., UTC vs. EST vs. IST). This converter displays both your device's local timezone and UTC simultaneously for easy debugging.",
    },
    {
      question: "How do I distinguish between seconds and milliseconds timestamps?",
      answer: "Standard Unix timestamps in seconds are typically 10 digits long (e.g., 1704067200 for year 2024). JavaScript timestamps and high-precision APIs use milliseconds, which are 13 digits long (e.g., 1704067200000). This converter automatically detects and handles both formats seamlessly.",
    },
  ];

  const aboutText = "UtilitySpace Timestamp Converter provides fast, accurate bi-directional conversions between Unix Epoch timestamps and human-readable calendar dates. Whether you are debugging backend database records, analyzing server log files, or constructing API request payloads, this in-browser converter handles both 10-digit second and 13-digit millisecond timestamps with live UTC, local timezone, and ISO 8601 breakdowns.";

  return (
    <ToolLayout
      title="Timestamp Converter"
      description="Convert Unix timestamps to readable dates and vice-versa."
      category="Developer"
      howToSteps={howToSteps}
      faqs={faqs}
      aboutText={aboutText}
    >
      <div className="space-y-8">
        {/* Current Time Widget */}
        <div className="flex items-center justify-center p-6 bg-primary/5 rounded-xl border border-primary/20">
          <div className="text-center">
            <p className="text-sm font-semibold text-secondary-text uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" /> Current Epoch Time
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-4xl font-mono font-bold tracking-tight text-foreground">{currentTime}</span>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(currentTime.toString())}>
                <Copy className="w-5 h-5 text-secondary-text hover:text-foreground" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Timestamp to Date */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h3 className="font-heading font-semibold text-xl border-b border-border pb-2">Timestamp to Date</h3>
              <div className="space-y-2">
                <Label>Unix Timestamp (Seconds or MS)</Label>
                <div className="flex gap-2">
                  <Input
                    value={timestamp}
                    onChange={(e) => handleTimestampChange(e.target.value)}
                    placeholder="e.g. 1704067200"
                    className="font-mono"
                  />
                  <Button variant="outline" onClick={() => handleTimestampChange(currentTime.toString())}>Now</Button>
                </div>
              </div>

              {parsedFromTs && (
                <div className="space-y-3 bg-muted p-4 rounded-md animate-in fade-in">
                  <div>
                    <span className="text-xs text-secondary-text font-medium uppercase tracking-wider">Local Time</span>
                    <p className="font-medium">{parsedFromTs.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-xs text-secondary-text font-medium uppercase tracking-wider">UTC Time</span>
                    <p className="font-medium">{parsedFromTs.toUTCString()}</p>
                  </div>
                  <div>
                    <span className="text-xs text-secondary-text font-medium uppercase tracking-wider">ISO 8601</span>
                    <p className="font-mono text-sm">{parsedFromTs.toISOString()}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Date to Timestamp */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h3 className="font-heading font-semibold text-xl border-b border-border pb-2">Date to Timestamp</h3>
              <div className="space-y-2">
                <Label>Date String (ISO, RFC, etc.)</Label>
                <div className="flex gap-2">
                  <Input
                    value={dateString}
                    onChange={(e) => handleDateChange(e.target.value)}
                    placeholder="e.g. 2026-01-01T00:00:00Z"
                  />
                  <Button variant="outline" onClick={() => handleDateChange(new Date().toISOString())}>Now</Button>
                </div>
              </div>

              {parsedFromDate && (
                <div className="space-y-3 bg-muted p-4 rounded-md animate-in fade-in">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs text-secondary-text font-medium uppercase tracking-wider">Seconds</span>
                      <p className="font-mono font-medium text-lg">{Math.floor(parsedFromDate / 1000)}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(Math.floor(parsedFromDate / 1000).toString())}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center border-t border-border/50 pt-2">
                    <div>
                      <span className="text-xs text-secondary-text font-medium uppercase tracking-wider">Milliseconds</span>
                      <p className="font-mono font-medium text-lg">{parsedFromDate}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(parsedFromDate.toString())}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
}
