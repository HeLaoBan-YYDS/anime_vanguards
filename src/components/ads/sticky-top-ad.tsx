"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { AdBanner } from "@/components/ads/adsterra-banner";

type StickyTopAdProps = {
  adKey?: string;
};

export function StickyTopAd({ adKey }: StickyTopAdProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!adKey || dismissed) {
    return null;
  }

  return (
    <div className="sticky top-20 z-20 py-2">
      <div className="mx-auto max-w-4xl">
        <div className="relative mx-auto w-fit max-w-full overflow-hidden">
          <AdBanner type="banner-320x50" adKey={adKey} eager className="w-auto" />
          <button
            type="button"
            aria-label="关闭广告"
            className="absolute right-1 top-1 z-10 grid size-6 place-items-center rounded-md bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => setDismissed(true)}
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
