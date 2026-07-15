# Walter Sands Portfolio

Astro portfolio site for Walter Sands, designed for GitHub Pages.

## Local Development

```bash
pnpm install
pnpm dev
```

## Verification

```bash
pnpm verify
```

The verification script builds the site and checks that private resume contact details are not present in source or generated HTML.

## Content

- Experience page content is seeded from a public-facing rewrite of the resume.
- Art entries live in `src/content/art/`.
- Project entries live in `src/content/projects/`.
- Public contact is LinkedIn only.
