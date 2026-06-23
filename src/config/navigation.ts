type NavigationItem = {
  key: string;
  path: string;
  isContentType?: boolean;
};

export const NAVIGATION_CONFIG: NavigationItem[] = [
  { key: "codes", path: "/codes", isContentType: true },
  { key: "tiers", path: "/tiers", isContentType: true },
  { key: "values", path: "/values", isContentType: true },
  { key: "units", path: "/units", isContentType: true },
  { key: "items", path: "/items", isContentType: true },
  { key: "modes", path: "/modes", isContentType: true },
  { key: "guide", path: "/guide", isContentType: true },
  { key: "community", path: "/community", isContentType: true },
];

export const CONTENT_TYPES: string[] = NAVIGATION_CONFIG
  .filter((item) => item.isContentType)
  .map((item) => item.key);
