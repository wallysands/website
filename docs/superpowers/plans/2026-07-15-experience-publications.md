# Experience Publications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move publication content to a new Publications page and simplify the Experience page.

**Architecture:** Keep the existing Astro structure. Top-level navigation stays data-driven in `src/data/site.ts`; page content remains in simple `.astro` files; verification scripts assert the route and required page text.

**Tech Stack:** Astro, TypeScript, existing Node verification scripts.

## Global Constraints

- Add a new top-level `/publications/` page.
- Add Publications to the main navigation.
- Remove Publication and Skills sections from `/experience/`.
- Add Experience quick navigation links for Education and Industry.
- Reuse existing layout, header, quick-nav, and callout styles.

---

### Task 1: Update Navigation, Pages, And Verification

**Files:**
- Modify: `src/data/site.ts`
- Modify: `src/pages/experience.astro`
- Create: `src/pages/publications.astro`
- Modify: `src/pages/index.astro`
- Modify: `scripts/verify-source.mjs`
- Modify: `scripts/verify-dist.mjs`

**Interfaces:**
- Consumes: `BaseLayout`, `PageHeader`, `TimelineItem`, and the existing `.section-jump-nav` and `.callout` styles.
- Produces: `/publications/` route, Publications main navigation item, Experience section anchors `education` and `industry-experience`.

- [ ] **Step 1: Write failing verification expectations**

Update source and dist verifiers to require the Publications nav label, `src/pages/publications.astro`, `publications/index.html`, Experience quick-link markup, and publication text on the Publications page instead of the Experience page.

Run:

```bash
pnpm verify
```

Expected: verification fails because the new Publications page and nav do not exist yet.

- [ ] **Step 2: Implement navigation and page content**

Add `{ label: "Publications", href: "/publications/" }` after Experience in `src/data/site.ts`. Create `src/pages/publications.astro` with the existing publication callout. Remove Publication and Skills sections from `src/pages/experience.astro`, add the quick nav, and add ids to Education and Industry sections.

- [ ] **Step 3: Update cross-page copy**

Adjust home page Experience copy so it no longer promises publication or skills content on Experience. Link Publications through main navigation only.

- [ ] **Step 4: Verify**

Run:

```bash
pnpm verify
```

Expected: source verification, Astro check/build, and dist verification all pass.

## Self-Review Notes

- Spec coverage: The plan covers navigation, new route, Experience removals, quick links, home copy, and verification.
- Placeholder scan: No placeholders require invention.
- Type consistency: The plan uses existing page/component interfaces only.
