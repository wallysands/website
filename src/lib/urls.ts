const absoluteOrFragmentPattern = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;

export function withBase(href: string) {
  if (absoluteOrFragmentPattern.test(href) || !href.startsWith("/")) return href;

  const base = import.meta.env.BASE_URL ?? "/";
  if (base === "/") return href;

  return `${base.replace(/\/$/, "")}${href}`;
}
