import { AdBanner } from "@/components/ads/adsterra-banner";

type StickySidebarAdProps = {
  adKey?: string;
};

export function StickySidebarAd({ adKey }: StickySidebarAdProps) {
  const key = adKey?.trim();

  if (!key) {
    return null;
  }

  return (
    <aside className="pointer-events-none fixed left-4 top-0 hidden h-full w-[136px] lg:block 2xl:left-[max(1rem,_calc((100vw_-_80rem)_/_2_-_9.5rem))]">
      <div className="sticky top-20 z-20 py-2">
        <div className="relative h-[510px] w-[136px]">
          <div className="origin-top-left scale-[0.85]">
            <AdBanner type="banner-160x600" adKey={key} dismissible eager className="w-auto pointer-events-auto" />
          </div>
        </div>
      </div>
    </aside>
  );
}
