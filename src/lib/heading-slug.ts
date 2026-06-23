const NON_HEADING_ID_CHARS = /[^\p{L}\p{N}\s_-]/gu;
const WHITESPACE = /\s+/g;
const REPEATED_DASHES = /-+/g;

function hashText(value: string) {
  let hash = 0;

  for (const char of value) {
    hash = Math.imul(hash, 31) + (char.codePointAt(0) ?? 0);
    hash >>>= 0;
  }

  return hash.toString(36);
}

export function toHeadingId(value: string): string {
  const id = value
    .normalize("NFKC")
    .toLowerCase()
    .replace(NON_HEADING_ID_CHARS, "")
    .trim()
    .replace(WHITESPACE, "-")
    .replace(REPEATED_DASHES, "-")
    .replace(/^-|-$/g, "");

  return id || `section-${hashText(value) || "heading"}`;
}
