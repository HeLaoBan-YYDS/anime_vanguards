"use client";

import { useState, type SyntheticEvent } from "react";
import { X } from "lucide-react";

import { AdBanner, type AdBannerType } from "@/components/ads/adsterra-banner";

type StickyAdPlacement = "top" | "left-sidebar" | "right-sidebar";

type StickyAdProps = {
  placement: StickyAdPlacement;
  type: AdBannerType;
  adKey?: string;
  eager?: boolean;
};

const placementConfig = {
  top: {
    outerElement: "div",
    outerClassName: "sticky top-20 z-20 py-2",
    containerClassName: "mx-auto max-w-4xl",
    frameClassName: "relative mx-auto w-fit max-w-full overflow-hidden",
    bannerWrapperClassName: undefined,
    bannerClassName: "w-auto",
    closeButtonClassName:
      "absolute right-1 top-1 z-50 grid size-5 cursor-pointer place-items-center rounded-sm bg-transparent text-foreground drop-shadow transition-colors hover:bg-background/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    dataAttribute: undefined,
    closeSelector: undefined,
  },
  "left-sidebar": {
    outerElement: "aside",
    outerClassName:
      "pointer-events-none fixed left-4 top-0 z-30 hidden h-full w-[136px] lg:block 2xl:left-[max(1rem,_calc((100vw_-_80rem)_/_2_-_9.5rem))]",
    containerClassName: "sticky top-20 z-20 py-2",
    frameClassName: "pointer-events-auto relative h-[510px] w-[136px]",
    bannerWrapperClassName: "origin-top-left scale-[0.85]",
    bannerClassName: "w-auto pointer-events-auto",
    closeButtonClassName:
      "pointer-events-auto absolute right-3 top-1 z-50 grid size-7 cursor-pointer place-items-center rounded-sm bg-transparent text-foreground drop-shadow transition-colors hover:bg-background/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    dataAttribute: "data-left-sidebar-ad",
    closeSelector: "[data-left-sidebar-ad]",
  },
  "right-sidebar": {
    outerElement: "aside",
    outerClassName: "pointer-events-none fixed right-0 top-0 z-30 hidden h-full w-40 lg:block",
    containerClassName: "sticky top-20 z-20 py-2",
    frameClassName: "pointer-events-auto relative w-fit",
    bannerWrapperClassName: undefined,
    bannerClassName: "w-auto",
    closeButtonClassName:
      "pointer-events-auto absolute right-1 top-1 z-50 grid size-7 cursor-pointer place-items-center rounded-sm bg-transparent text-foreground drop-shadow transition-colors hover:bg-background/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    dataAttribute: "data-right-sidebar-ad",
    closeSelector: "[data-right-sidebar-ad]",
  },
} as const;

const closeButtonHandlers = [
  "onClick",
  "onClickCapture",
  "onMouseDown",
  "onMouseDownCapture",
  "onMouseUp",
  "onPointerDown",
  "onPointerDownCapture",
  "onPointerUp",
  "onTouchEnd",
  "onTouchStart",
  "onTouchStartCapture",
] as const;

export function StickyAd({ placement, type, adKey, eager = true }: StickyAdProps) {
  const [dismissed, setDismissed] = useState(false);
  const key = adKey?.trim();
  const config = placementConfig[placement];
  const Outer = config.outerElement;
  const dataAttributes = config.dataAttribute ? { [config.dataAttribute]: "" } : undefined;
  const closeAd = (event: SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (config.closeSelector) {
      event.currentTarget.closest<HTMLElement>(config.closeSelector)?.style.setProperty("display", "none");
    }
    setDismissed(true);
  };
  const closeHandlers = Object.fromEntries(closeButtonHandlers.map((handlerName) => [handlerName, closeAd]));
  const ad = <AdBanner type={type} adKey={key} eager={eager} className={config.bannerClassName} />;

  if (!key || dismissed) {
    return null;
  }

  return (
    <Outer {...dataAttributes} className={config.outerClassName}>
      <div className={config.containerClassName}>
        <div className={config.frameClassName}>
          {config.bannerWrapperClassName ? <div className={config.bannerWrapperClassName}>{ad}</div> : ad}
          <button
            type="button"
            aria-label="Close advertisement"
            className={config.closeButtonClassName}
            {...closeHandlers}
          >
            <X className="pointer-events-none size-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </Outer>
  );
}
