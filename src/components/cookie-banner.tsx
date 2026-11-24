"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, Shield, X, Check, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);
  const [adsAllowed, setAdsAllowed] = useState(true);

  useEffect(() => {
    setMounted(true);
    try {
      const consent = localStorage.getItem("utilityspace_cookie_consent");
      if (!consent) {
        // Show after a brief delay for smoother UX
        const timer = setTimeout(() => setShowBanner(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage may fail in restricted/private browsing modes
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem("utilityspace_cookie_consent", "all");
      localStorage.setItem(
        "utilityspace_cookie_preferences",
        JSON.stringify({ essential: true, analytics: true, ads: true, timestamp: Date.now() })
      );
    } catch {}
    setShowBanner(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem("utilityspace_cookie_consent", "essential");
      localStorage.setItem(
        "utilityspace_cookie_preferences",
        JSON.stringify({ essential: true, analytics: false, ads: false, timestamp: Date.now() })
      );
    } catch {}
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    try {
      localStorage.setItem("utilityspace_cookie_consent", "custom");
      localStorage.setItem(
        "utilityspace_cookie_preferences",
        JSON.stringify({ essential: true, analytics: analyticsAllowed, ads: adsAllowed, timestamp: Date.now() })
      );
    } catch {}
    setShowBanner(false);
  };

  if (!mounted || !showBanner) {
    return null;
  }

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-0 inset-x-0 z-50 p-4 md:p-6 bg-card/95 backdrop-blur-md border-t border-border shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
    >
      <div className="container mx-auto max-w-7xl">
        {!showPreferences ? (
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 max-w-4xl">
              <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0 mt-0.5">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="font-heading font-semibold text-foreground text-sm md:text-base">
                  We value your privacy and data transparency
                </p>
                <p className="text-xs md:text-sm text-secondary-text leading-relaxed">
                  UtilitySpace uses standard cookies to ensure website security, remember your theme preferences, and deliver relevant advertisements via Google AdSense. In compliance with Google&apos;s EU User Consent Policy and global data protection standards (GDPR & CCPA), your files and calculations remain 100% private on your device. Learn more in our{" "}
                  <Link href="/privacy" className="text-primary underline hover:text-primary/80">
                    Privacy Policy
                  </Link>.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreferences(true)}
                className="text-xs font-medium border-border hover:bg-muted text-foreground"
              >
                <Settings2 className="w-3.5 h-3.5 mr-1.5" />
                Preferences
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEssentialOnly}
                className="text-xs font-medium border-border hover:bg-muted text-foreground"
              >
                Essential Only
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              >
                <Check className="w-3.5 h-3.5 mr-1.5" />
                Accept All
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-bold text-foreground text-base">
                  Cookie & Privacy Preferences
                </h3>
              </div>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-secondary-text hover:text-foreground p-1 rounded-md"
                aria-label="Close preferences"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-muted/40 rounded-lg border border-border space-y-1">
                <div className="flex items-center justify-between font-semibold text-foreground">
                  <span>Essential Cookies</span>
                  <span className="text-[10px] uppercase tracking-wider bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                    Always Active
                  </span>
                </div>
                <p className="text-secondary-text text-[11px] leading-relaxed">
                  Required for site navigation, light/dark mode persistence, and basic security functions.
                </p>
              </div>

              <div className="p-3 bg-muted/40 rounded-lg border border-border space-y-1">
                <div className="flex items-center justify-between font-semibold text-foreground">
                  <span>Analytics Cookies</span>
                  <input
                    type="checkbox"
                    checked={analyticsAllowed}
                    onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
                    aria-label="Allow analytics cookies"
                  />
                </div>
                <p className="text-secondary-text text-[11px] leading-relaxed">
                  Helps us understand how visitors interact with our calculators and tools so we can improve them.
                </p>
              </div>

              <div className="p-3 bg-muted/40 rounded-lg border border-border space-y-1">
                <div className="flex items-center justify-between font-semibold text-foreground">
                  <span>Advertising Cookies</span>
                  <input
                    type="checkbox"
                    checked={adsAllowed}
                    onChange={(e) => setAdsAllowed(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary accent-primary"
                    aria-label="Allow advertising cookies"
                  />
                </div>
                <p className="text-secondary-text text-[11px] leading-relaxed">
                  Enables Google AdSense to serve personalized, non-intrusive advertisements to keep our tools free.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreferences(false)}
                className="text-xs"
              >
                Back
              </Button>
              <Button
                size="sm"
                onClick={handleSavePreferences}
                className="text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Save Preferences
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
