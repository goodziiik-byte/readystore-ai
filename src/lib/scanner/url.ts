export function normalizeUrl(input: string): URL {
  const trimmed = input.trim();

  if (trimmed === "") {
    throw new Error("Enter a store URL.");
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const parsed = new URL(withProtocol);

  if (! ["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported.");
  }

  parsed.hash = "";

  return parsed;
}

export function sameOrigin(base: URL, href: string): string | null {
  try {
    const next = new URL(href, base);

    if (next.origin !== base.origin) {
      return null;
    }

    next.hash = "";

    return next.toString();
  } catch {
    return null;
  }
}
