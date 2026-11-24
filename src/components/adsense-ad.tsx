"use client";

import { useEffect, useRef } from "react";

interface AdSenseAdProps {
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  responsive?: boolean;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export function AdSenseAd({
  slot,
  format = "auto",
  responsive = true,
  className = "",
}: AdSenseAdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (!adsenseClientId || !slot) return;

    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error("AdSense render error:", err);
    }
  }, [adsenseClientId, slot]);

  // If no AdSense client ID is configured yet, do not render intrusive blank frames in production
  if (!adsenseClientId || !slot) {
    if (process.env.NODE_ENV === "development") {
      return (
        <aside
          aria-label="Advertisement placeholder"
          className={`w-full my-6 p-4 rounded-xl border border-dashed border-border/80 bg-muted/20 text-center text-xs text-secondary-text ${className}`}
        >
          <div className="uppercase tracking-widest text-[10px] font-semibold text-secondary-text/60 mb-1">
            Advertisement Space
          </div>
          <p className="text-[11px]">
            Google AdSense slot will render here once <code>NEXT_PUBLIC_ADSENSE_CLIENT_ID</code> and slot ID are configured.
          </p>
        </aside>
      );
    }
    return null;
  }

  return (
    <aside
      aria-label="Advertisement"
      ref={adRef}
      className={`w-full my-6 text-center overflow-hidden ${className}`}
    >
      <div className="uppercase tracking-widest text-[10px] font-semibold text-secondary-text/60 mb-1.5">
        Advertisement
      </div>
      <div className="min-h-[100px] flex items-center justify-center bg-muted/10 rounded-lg">
        <ins
          className="adsbygoogle block"
          style={{ display: "block" }}
          data-ad-client={adsenseClientId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    </aside>
  );
}
