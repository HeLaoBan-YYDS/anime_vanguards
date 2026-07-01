"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { AdBanner } from "@/components/ads/adsterra-banner";

type StickyRightSidebarAdProps = {
  adKey?: string;
};

export function StickyRightSidebarAd({ adKey }: StickyRightSidebarAdProps) {
  const [dismissed, setDismissed] = useState(false);
  const key = adKey?.trim();
  const closeAd = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.closest<HTMLElement>("[data-right-sidebar-ad]")?.style.setProperty("display", "none");
    setDismissed(true);
  };

  if (!key || dismissed) {
    return null;
  }

  return (
    <aside
      data-right-sidebar-ad
      className="pointer-events-none fixed right-0 top-0 z-30 hidden h-full w-40 lg:block"
    >
      <div className="sticky top-20 z-20 py-2">
        <div className="pointer-events-auto relative w-fit">
          <AdBanner type="banner-160x300" adKey={key} eager className="w-auto" />
          <button
            type="button"
            aria-label="Close advertisement"
            className="pointer-events-auto absolute -right-1 -top-1 z-50 grid size-7 cursor-pointer place-items-center rounded-sm bg-transparent text-foreground drop-shadow transition-colors hover:bg-background/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            onClick={closeAd}
            onClickCapture={closeAd}
            onMouseDown={closeAd}
            onMouseDownCapture={closeAd}
            onMouseUp={closeAd}
            onPointerDown={closeAd}
            onPointerDownCapture={closeAd}
            onPointerUp={closeAd}
            onTouchEnd={closeAd}
            onTouchStart={closeAd}
            onTouchStartCapture={closeAd}
          >
            <X className="pointer-events-none size-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
}
