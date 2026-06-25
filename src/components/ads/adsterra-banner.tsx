import { cn } from "@/lib/utils";

const AD_IFRAME_SANDBOX = "allow-scripts allow-same-origin allow-popups";

const adBannerTypes = {
  "banner-320x50": {
    width: 320,
    height: 50,
  },
} as const;

export type AdBannerType = keyof typeof adBannerTypes;

type AdBannerProps = {
  type: AdBannerType;
  adKey?: string;
  eager?: boolean;
  className?: string;
  title?: string;
};

export const adsterraBannerPlacements = {
  "160x300": {
    key: "",
    width: 160,
    height: 300,
    src: "/ads/banner-160x300.html",
  },
  "160x600": {
    key: "",
    width: 160,
    height: 600,
    src: "/ads/banner-160x600.html",
  },
  "300x250": {
    key: "",
    width: 300,
    height: 250,
    src: "/ads/banner-300x250.html",
  },
  "320x50": {
    key: "",
    width: 320,
    height: 50,
    src: "/ads/banner-320x50.html",
  },
  "468x60": {
    key: "",
    width: 468,
    height: 60,
    src: "/ads/banner-468x60.html",
  },
  "728x90": {
    key: "",
    width: 728,
    height: 90,
    src: "/ads/banner-728x90.html",
  },
} as const;

export type AdsterraBannerPlacement = keyof typeof adsterraBannerPlacements;

type AdsterraBannerProps = {
  placement: AdsterraBannerPlacement;
  className?: string;
  title?: string;
};

function getAdsterraSrcDoc(adKey: string, width: number, height: number) {
  const serializedKey = JSON.stringify(adKey).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=${width},height=${height},initial-scale=1" />
    <style>
      html,
      body {
        width: ${width}px;
        height: ${height}px;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background: transparent;
      }
    </style>
  </head>
  <body>
    <script type="text/javascript">
      const adsterraKey = ${serializedKey};
      const adsterraWidth = ${width};
      const adsterraHeight = ${height};

      if (adsterraKey) {
        var atOptions = {
          key: adsterraKey,
          format: "iframe",
          height: adsterraHeight,
          width: adsterraWidth,
          params: {}
        };

        const invokeScript = document.createElement("script");
        invokeScript.type = "text/javascript";
        invokeScript.src =
          "https://www.highperformanceformat.com/" + adsterraKey + "/invoke.js";
        document.body.appendChild(invokeScript);
      }
    </script>
  </body>
</html>`;
}

export function AdBanner({
  type,
  adKey,
  eager = false,
  className,
  title = "Advertisement",
}: AdBannerProps) {
  const key = adKey?.trim();
  const ad = adBannerTypes[type];

  if (!key) {
    return null;
  }

  return (
    <div className={cn("flex w-full items-center justify-center", className)}>
      <iframe
        height={ad.height}
        loading={eager ? "eager" : "lazy"}
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox={AD_IFRAME_SANDBOX}
        scrolling="no"
        srcDoc={getAdsterraSrcDoc(key, ad.width, ad.height)}
        style={{
          border: "none",
          display: "block",
          height: ad.height,
          overflow: "hidden",
          width: ad.width,
        }}
        title={title}
        width={ad.width}
      />
    </div>
  );
}

export function AdsterraBanner({
  placement,
  className,
  title = "Advertisement",
}: AdsterraBannerProps) {
  const ad = adsterraBannerPlacements[placement];

  if (!ad.key.trim()) {
    return null;
  }

  return (
    <div className={cn("flex w-full items-center justify-center", className)}>
      <iframe
        height={ad.height}
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox={AD_IFRAME_SANDBOX}
        scrolling="no"
        src={ad.src}
        style={{
          border: "none",
          display: "block",
          height: ad.height,
          overflow: "hidden",
          width: ad.width,
        }}
        title={title}
        width={ad.width}
      />
    </div>
  );
}
