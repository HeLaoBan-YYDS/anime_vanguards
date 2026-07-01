"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { AdBanner } from "@/components/ads/adsterra-banner";

type StickyTopAdProps = {
  adKey?: string;
};

export function StickyTopAd({ adKey }: StickyTopAdProps) {
  const [dismissed, setDismissed] = useState(false);
  const closeAd = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDismissed(true);
  };

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
            className="absolute right-1 top-1 z-50 grid size-5 cursor-pointer place-items-center rounded-sm bg-transparent text-foreground drop-shadow transition-colors hover:bg-background/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            onClick={closeAd}
            onPointerDown={closeAd}
          >
            <X className="size-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
