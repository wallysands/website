# Experience Publications Design

## Purpose

Refine the portfolio information architecture by moving publication content out of Experience and into its own top-level Publications page.

## Requirements

- Add a new top-level `/publications/` page.
- Add Publications to the main navigation.
- Remove the Publication section from `/experience/`.
- Remove the Skills section from `/experience/`.
- Add the same quick navigation pattern used on the Art page to `/experience/`.
- Experience quick navigation should link to Education and Industry sections.
- Preserve the existing Current Focus, Education, Industry Experience, and publication copy.

## Design

Use the existing Astro page and navigation conventions. `src/data/site.ts` remains the source of truth for top-level navigation. `src/pages/experience.astro` keeps the current focus content, then provides section jump links to `#education` and `#industry-experience`. `src/pages/publications.astro` uses `BaseLayout`, `PageHeader`, and the existing callout styling for the IEEE VIS 2025 publication.

## Verification

Run the existing project verification command:

```bash
pnpm verify
```

The generated site should include `/publications/`, show Publications in navigation, omit the Skills section from Experience, and keep the Experience quick links functional.
