# Personal Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an Astro-based personal portfolio for Walter Sands that can be deployed to GitHub Pages and maintained through Markdown content.

**Architecture:** The site is a static Astro application with top-level pages, shared layout/components, Markdown content collections for future art/projects, and resume-derived experience content rewritten for web use. GitHub Actions builds the site and publishes the generated static output to GitHub Pages.

**Tech Stack:** Astro, TypeScript, Markdown/MDX-ready content collections, GitHub Actions, Node.js scripts for source/build verification.

## Global Constraints

- Use public-facing content only.
- Do not include street address, phone number, or email address from the source resume.
- Use LinkedIn as the only public contact link: https://www.linkedin.com/in/walter-sands-b200048b/
- Keep projects and art easy to add later through Markdown files.
- Make partially filled sections feel intentional, not unfinished.
- Use Astro with Markdown/MDX content collections and deploy the static output to GitHub Pages.
- Main navigation must include Home, Experience, Art, Projects, About, and LinkedIn.
- The art page must have two top-level gallery sections: Still Lifes and Outdoor / Plein Air.
- The projects page should be structured now but filled later.
- Before launch, verify that no private address, phone number, or email appears anywhere in the generated site.

---

## File Structure

- `package.json`: project metadata, scripts, and dependencies.
- `astro.config.mjs`: Astro static-site configuration for GitHub Pages.
- `tsconfig.json`: Astro TypeScript configuration.
- `.gitignore`: ignores dependencies and generated output.
- `.github/workflows/deploy.yml`: GitHub Pages build and deploy workflow.
- `scripts/verify-source.mjs`: scans source files for private contact data and required public constants.
- `scripts/verify-dist.mjs`: checks generated pages, navigation text, and private-contact leaks after build.
- `src/data/site.ts`: public site metadata and navigation model.
- `src/content.config.ts`: Astro content collection schemas.
- `src/content/art/*.md`: future artwork entries, seeded with non-image collection notes.
- `src/content/projects/*.md`: future project entries, seeded with one intentional empty-state entry.
- `src/layouts/BaseLayout.astro`: shared page shell.
- `src/components/SiteNav.astro`: top navigation.
- `src/components/PageHeader.astro`: reusable page title/intro header.
- `src/components/FeatureCard.astro`: homepage and index cards.
- `src/components/TimelineItem.astro`: experience entries.
- `src/components/GallerySection.astro`: art category section.
- `src/styles/global.css`: responsive visual system.
- `src/pages/index.astro`: homepage.
- `src/pages/experience.astro`: resume-derived experience page.
- `src/pages/art.astro`: two-section gallery page.
- `src/pages/projects.astro`: future project index.
- `src/pages/about.astro`: concise personal/about page.

---

### Task 1: Project Foundation And Privacy Guard

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `scripts/verify-source.mjs`
- Create: `src/data/site.ts`

**Interfaces:**
- Consumes: none.
- Produces:
  - `site` export from `src/data/site.ts` with shape `{ name: string; title: string; description: string; linkedin: string; nav: Array<{ label: string; href: string; external?: boolean }> }`.
  - `pnpm verify:source` script that exits `0` only when public metadata exists and private contact patterns are absent.

- [ ] **Step 1: Create the source verification script before metadata exists**

Create `scripts/verify-source.mjs`:

```js
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const sourceRoots = ["src", "docs/superpowers/specs"];
const requiredLinkedIn = "https://www.linkedin.com/in/walter-sands-b200048b/";
const forbiddenPatterns = [
  { name: "street address", pattern: privateAddressPattern },
  { name: "phone number", pattern: privatePhonePattern },
  { name: "personal email", pattern: personalEmailPattern },
  { name: "student email", pattern: studentEmailPattern },
  { name: "mail-to link", pattern: /mail-to:/i },
];

function collectFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) return collectFiles(path);
    if (/\.(astro|css|html|js|json|md|mjs|ts|tsx|yml|yaml)$/.test(path)) return [path];
    return [];
  });
}

const files = sourceRoots.flatMap((dir) => collectFiles(join(root, dir)));
const allText = files.map((file) => readFileSync(file, "utf8")).join("\n");
const failures = [];

for (const rule of forbiddenPatterns) {
  if (rule.pattern.test(allText)) failures.push(`Forbidden ${rule.name} found`);
}

const siteFile = join(root, "src/data/site.ts");
if (!existsSync(siteFile)) {
  failures.push("Missing src/data/site.ts");
} else {
  const siteText = readFileSync(siteFile, "utf8");
  if (!siteText.includes(requiredLinkedIn)) {
    failures.push("Missing required LinkedIn profile URL in src/data/site.ts");
  }
  for (const label of ["Home", "Experience", "Art", "Projects", "About", "LinkedIn"]) {
    if (!siteText.includes(label)) failures.push(`Missing nav label: ${label}`);
  }
}

if (failures.length > 0) {
  console.error("Source verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  if (files.length > 0) {
    console.error("Scanned files:");
    for (const file of files) console.error(`- ${relative(root, file)}`);
  }
  process.exit(1);
}

console.log("Source verification passed");
```

- [ ] **Step 2: Create project configuration**

Create `package.json`:

```json
{
  "name": "walter-sands-portfolio",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "verify:source": "node scripts/verify-source.mjs",
    "verify:dist": "node scripts/verify-dist.mjs",
    "verify": "pnpm verify:source && pnpm build && pnpm verify:dist"
  },
  "dependencies": {
    "@astrojs/check": "^0.9.4",
    "astro": "^5.0.0",
    "typescript": "^5.6.0"
  },
  "devDependencies": {}
}
```

Create `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://wallysands.github.io",
  output: "static",
});
```

Create `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

Create `.gitignore`:

```gitignore
node_modules/
dist/
.astro/
.env
.env.*
```

- [ ] **Step 3: Create public site metadata**

Create `src/data/site.ts`:

```ts
export const site = {
  name: "Walter Sands",
  title: "Walter Sands | Computer Science, Visualization, Art",
  description:
    "A portfolio for Walter Sands, bringing together computer science research, software and data experience, and observational painting.",
  linkedin: "https://www.linkedin.com/in/walter-sands-b200048b/",
  nav: [
    { label: "Home", href: "/" },
    { label: "Experience", href: "/experience/" },
    { label: "Art", href: "/art/" },
    { label: "Projects", href: "/projects/" },
    { label: "About", href: "/about/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/walter-sands-b200048b/", external: true },
  ],
} as const;
```

- [ ] **Step 4: Install dependencies and verify the privacy guard passes**

Run:

```bash
pnpm install
pnpm verify:source
```

Expected:

```text
Source verification passed
```

- [ ] **Step 5: Commit**

Run:

```bash
git add package.json pnpm-lock.yaml astro.config.mjs tsconfig.json .gitignore scripts/verify-source.mjs src/data/site.ts
git commit -m "feat: add Astro project foundation"
```

---

### Task 2: Shared Layout, Navigation, And Global Styling

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/SiteNav.astro`
- Create: `src/components/PageHeader.astro`
- Create: `src/components/FeatureCard.astro`
- Create: `src/styles/global.css`
- Modify: `scripts/verify-source.mjs`

**Interfaces:**
- Consumes: `site` from `src/data/site.ts`.
- Produces:
  - `BaseLayout` props `{ title?: string; description?: string }`.
  - `PageHeader` props `{ eyebrow?: string; title: string; intro: string }`.
  - `FeatureCard` props `{ title: string; href: string; summary: string; meta?: string }`.

- [ ] **Step 1: Extend source verification to require core layout files**

Modify `scripts/verify-source.mjs` by adding this block before the final `if (failures.length > 0)`:

```js
const requiredFiles = [
  "src/layouts/BaseLayout.astro",
  "src/components/SiteNav.astro",
  "src/components/PageHeader.astro",
  "src/components/FeatureCard.astro",
  "src/styles/global.css",
];

for (const requiredFile of requiredFiles) {
  if (!existsSync(join(root, requiredFile))) failures.push(`Missing ${requiredFile}`);
}
```

- [ ] **Step 2: Run source verification and confirm it fails for missing layout files**

Run:

```bash
pnpm verify:source
```

Expected:

```text
Source verification failed:
- Missing src/layouts/BaseLayout.astro
- Missing src/components/SiteNav.astro
- Missing src/components/PageHeader.astro
- Missing src/components/FeatureCard.astro
- Missing src/styles/global.css
```

- [ ] **Step 3: Create the shared navigation**

Create `src/components/SiteNav.astro`:

```astro
---
import { site } from "../data/site";
---

<header class="site-nav" aria-label="Site header">
  <a class="brand" href="/" aria-label="Walter Sands home">
    <span class="brand-mark">WS</span>
    <span>Walter Sands</span>
  </a>
  <nav aria-label="Main navigation">
    {
      site.nav.map((item) => (
        <a href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined}>
          {item.label}
        </a>
      ))
    }
  </nav>
</header>
```

- [ ] **Step 4: Create the base layout and reusable components**

Create `src/layouts/BaseLayout.astro`:

```astro
---
import SiteNav from "../components/SiteNav.astro";
import { site } from "../data/site";
import "../styles/global.css";

interface Props {
  title?: string;
  description?: string;
}

const { title = site.title, description = site.description } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
  </head>
  <body>
    <SiteNav />
    <main>
      <slot />
    </main>
  </body>
</html>
```

Create `src/components/PageHeader.astro`:

```astro
---
interface Props {
  eyebrow?: string;
  title: string;
  intro: string;
}

const { eyebrow, title, intro } = Astro.props;
---

<section class="page-header">
  {eyebrow && <p class="eyebrow">{eyebrow}</p>}
  <h1>{title}</h1>
  <p>{intro}</p>
</section>
```

Create `src/components/FeatureCard.astro`:

```astro
---
interface Props {
  title: string;
  href: string;
  summary: string;
  meta?: string;
}

const { title, href, summary, meta } = Astro.props;
---

<a class="feature-card" href={href}>
  {meta && <span>{meta}</span>}
  <h2>{title}</h2>
  <p>{summary}</p>
</a>
```

- [ ] **Step 5: Create the global stylesheet**

Create `src/styles/global.css`:

```css
:root {
  color-scheme: light;
  --ink: #23201d;
  --muted: #635d55;
  --paper: #f8f6f1;
  --panel: #ffffff;
  --line: #d8d0c4;
  --accent: #2f6f73;
  --accent-dark: #244f52;
  --warm: #a55d3b;
  --shadow: 0 14px 40px rgba(35, 32, 29, 0.08);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  line-height: 1.6;
}

a {
  color: inherit;
}

main {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: 32px 0 72px;
}

.site-nav {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: 22px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.brand,
.site-nav nav,
.feature-card {
  display: flex;
  align-items: center;
}

.brand {
  gap: 10px;
  font-weight: 700;
  text-decoration: none;
}

.brand-mark {
  width: 38px;
  height: 38px;
  border: 1px solid var(--line);
  display: grid;
  place-items: center;
  background: var(--panel);
}

.site-nav nav {
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 14px;
  color: var(--muted);
  font-size: 0.95rem;
}

.site-nav nav a {
  text-decoration: none;
}

.site-nav nav a:hover {
  color: var(--accent-dark);
}

.page-header {
  padding: 56px 0 36px;
  max-width: 780px;
}

.eyebrow {
  color: var(--warm);
  font-weight: 700;
  margin: 0 0 8px;
  text-transform: uppercase;
  font-size: 0.78rem;
  letter-spacing: 0;
}

h1,
h2,
h3 {
  line-height: 1.15;
  margin: 0;
}

h1 {
  font-size: clamp(2.5rem, 7vw, 5rem);
  max-width: 920px;
}

h2 {
  font-size: 1.45rem;
}

h3 {
  font-size: 1.1rem;
}

p {
  color: var(--muted);
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.feature-card {
  min-height: 220px;
  align-items: flex-start;
  flex-direction: column;
  justify-content: space-between;
  gap: 18px;
  padding: 24px;
  border: 1px solid var(--line);
  background: var(--panel);
  box-shadow: var(--shadow);
  text-decoration: none;
  border-radius: 8px;
}

.feature-card span {
  color: var(--warm);
  font-size: 0.85rem;
  font-weight: 700;
}

.feature-card p {
  margin: 0;
}

.section {
  padding: 42px 0;
  border-top: 1px solid var(--line);
}

.stack {
  display: grid;
  gap: 18px;
}

@media (max-width: 760px) {
  .site-nav {
    align-items: flex-start;
    flex-direction: column;
  }

  .site-nav nav {
    justify-content: flex-start;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  main {
    padding-top: 16px;
  }
}
```

- [ ] **Step 6: Verify and commit**

Run:

```bash
pnpm verify:source
pnpm astro check
```

Expected:

```text
Source verification passed
Result (0 files):
- 0 errors
- 0 warnings
- 0 hints
```

Run:

```bash
git add scripts/verify-source.mjs src/layouts/BaseLayout.astro src/components/SiteNav.astro src/components/PageHeader.astro src/components/FeatureCard.astro src/styles/global.css
git commit -m "feat: add shared portfolio layout"
```

---

### Task 3: Content Collections And Seed Content

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/art/still-lifes.md`
- Create: `src/content/art/outdoor-plein-air.md`
- Create: `src/content/projects/selected-projects.md`
- Create: `src/components/GallerySection.astro`
- Modify: `scripts/verify-source.mjs`

**Interfaces:**
- Consumes: none.
- Produces:
  - Astro collections named `art` and `projects`.
  - `GallerySection` props `{ title: string; summary: string; entries: Array<{ title: string; data: { year?: number; medium?: string; status: string; category: string; description?: string } }> }`.

- [ ] **Step 1: Extend source verification for content requirements**

Modify `scripts/verify-source.mjs` by adding these checks before the final failure block:

```js
const contentFiles = [
  "src/content.config.ts",
  "src/content/art/still-lifes.md",
  "src/content/art/outdoor-plein-air.md",
  "src/content/projects/selected-projects.md",
  "src/components/GallerySection.astro",
];

for (const contentFile of contentFiles) {
  if (!existsSync(join(root, contentFile))) failures.push(`Missing ${contentFile}`);
}

const contentText = files.map((file) => readFileSync(file, "utf8")).join("\n");
for (const requiredText of ["Still Lifes", "Outdoor / Plein Air", "selected projects"]) {
  if (!contentText.includes(requiredText)) failures.push(`Missing content phrase: ${requiredText}`);
}
```

- [ ] **Step 2: Run source verification and confirm it fails for missing content**

Run:

```bash
pnpm verify:source
```

Expected: FAIL with missing `src/content.config.ts`, art Markdown, project Markdown, and `GallerySection.astro`.

- [ ] **Step 3: Create content collection schemas**

Create `src/content.config.ts`:

```ts
import { defineCollection, z } from "astro:content";

const art = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    category: z.enum(["still-life", "outdoor-plein-air"]),
    year: z.number().optional(),
    medium: z.string().optional(),
    image: z.string().optional(),
    status: z.enum(["planned", "available"]),
    description: z.string().optional(),
  }),
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    year: z.string().optional(),
    tools: z.array(z.string()).default([]),
    links: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    status: z.enum(["planned", "available"]),
    image: z.string().optional(),
  }),
});

export const collections = { art, projects };
```

- [ ] **Step 4: Create seed art and project content**

Create `src/content/art/still-lifes.md`:

```md
---
title: "Still Lifes"
category: "still-life"
status: "planned"
description: "A future collection of still life paintings and studies."
---

Still life work will be added here once images are selected.
```

Create `src/content/art/outdoor-plein-air.md`:

```md
---
title: "Outdoor / Plein Air"
category: "outdoor-plein-air"
status: "planned"
description: "A future collection of outdoor and plein air paintings."
---

Outdoor and plein air work will be added here once images are selected.
```

Create `src/content/projects/selected-projects.md`:

```md
---
title: "Selected Projects"
summary: "Technical and creative projects will be added as they are selected."
status: "planned"
tools: []
---

Selected projects will be added here with problem, process, tools, outcome, and links. This selected projects section is intentionally ready before the final project list is chosen.
```

- [ ] **Step 5: Create gallery section component**

Create `src/components/GallerySection.astro`:

```astro
---
interface GalleryEntry {
  title: string;
  data: {
    year?: number;
    medium?: string;
    status: string;
    category: string;
    description?: string;
  };
}

interface Props {
  title: string;
  summary: string;
  entries: GalleryEntry[];
}

const { title, summary, entries } = Astro.props;
---

<section class="section gallery-section">
  <div class="section-heading">
    <h2>{title}</h2>
    <p>{summary}</p>
  </div>
  <div class="gallery-grid">
    {
      entries.map((entry) => (
        <article class="gallery-item">
          <div class="art-frame" aria-hidden="true"></div>
          <div>
            <h3>{entry.title}</h3>
            <p>{entry.data.description}</p>
            <span>{entry.data.status === "planned" ? "Images to be added" : entry.data.medium}</span>
          </div>
        </article>
      ))
    }
  </div>
</section>
```

- [ ] **Step 6: Add gallery styles**

Append to `src/styles/global.css`:

```css
.section-heading {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: end;
  margin-bottom: 22px;
}

.section-heading p {
  max-width: 520px;
  margin: 0;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.gallery-item {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 18px;
  padding: 18px;
  border: 1px solid var(--line);
  background: var(--panel);
  border-radius: 8px;
}

.art-frame {
  min-height: 150px;
  background:
    linear-gradient(135deg, rgba(47, 111, 115, 0.16), rgba(165, 93, 59, 0.14)),
    var(--paper);
  border: 1px solid var(--line);
}

.gallery-item span {
  color: var(--warm);
  font-weight: 700;
  font-size: 0.85rem;
}

@media (max-width: 760px) {
  .section-heading {
    align-items: start;
    flex-direction: column;
  }

  .gallery-grid,
  .gallery-item {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 7: Verify and commit**

Run:

```bash
pnpm verify:source
pnpm astro check
```

Expected: source verification passes and Astro reports no errors.

Run:

```bash
git add scripts/verify-source.mjs src/content.config.ts src/content src/components/GallerySection.astro src/styles/global.css
git commit -m "feat: add portfolio content collections"
```

---

### Task 4: Build The Site Pages

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/experience.astro`
- Create: `src/pages/art.astro`
- Create: `src/pages/projects.astro`
- Create: `src/pages/about.astro`
- Create: `src/components/TimelineItem.astro`
- Create: `scripts/verify-dist.mjs`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes:
  - `BaseLayout`, `PageHeader`, `FeatureCard`, `GallerySection`.
  - Astro content collections `art` and `projects`.
- Produces:
  - Static routes `/`, `/experience/`, `/art/`, `/projects/`, and `/about/`.
  - `pnpm verify:dist` that checks generated HTML after build.

- [ ] **Step 1: Create dist verification script before pages exist**

Create `scripts/verify-dist.mjs`:

```js
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
const requiredPages = [
  "index.html",
  "experience/index.html",
  "art/index.html",
  "projects/index.html",
  "about/index.html",
];
const forbiddenPatterns = [
  { name: "street address", pattern: privateAddressPattern },
  { name: "phone number", pattern: privatePhonePattern },
  { name: "personal email", pattern: personalEmailPattern },
  { name: "student email", pattern: studentEmailPattern },
  { name: "mail-to link", pattern: /mail-to:/i },
];
const requiredText = [
  "Walter Sands",
  "Experience",
  "Art",
  "Projects",
  "About",
  "LinkedIn",
  "Still Lifes",
  "Outdoor / Plein Air",
  "Drawing in the Flow",
  "Interactive Visualization Lab",
];

function collectFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) return collectFiles(path);
    if (path.endsWith(".html")) return [path];
    return [];
  });
}

const failures = [];
for (const page of requiredPages) {
  if (!existsSync(join(dist, page))) failures.push(`Missing dist page: ${page}`);
}

const files = collectFiles(dist);
const allText = files.map((file) => readFileSync(file, "utf8")).join("\n");

for (const rule of forbiddenPatterns) {
  if (rule.pattern.test(allText)) failures.push(`Forbidden ${rule.name} found in dist`);
}

for (const text of requiredText) {
  if (!allText.includes(text)) failures.push(`Missing required text in dist: ${text}`);
}

if (failures.length > 0) {
  console.error("Dist verification failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  if (files.length > 0) {
    console.error("Scanned HTML files:");
    for (const file of files) console.error(`- ${relative(root, file)}`);
  }
  process.exit(1);
}

console.log("Dist verification passed");
```

- [ ] **Step 2: Build and confirm dist verification fails because pages do not exist**

Run:

```bash
pnpm build
pnpm verify:dist
```

Expected: `pnpm build` fails because no pages have been created, or `pnpm verify:dist` fails with missing dist pages.

- [ ] **Step 3: Create timeline component**

Create `src/components/TimelineItem.astro`:

```astro
---
interface Props {
  title: string;
  org: string;
  date: string;
  details: string[];
  tools?: string;
}

const { title, org, date, details, tools } = Astro.props;
---

<article class="timeline-item">
  <div>
    <p class="eyebrow">{date}</p>
    <h3>{title}</h3>
    <p class="org">{org}</p>
  </div>
  <div>
    <ul>
      {details.map((detail) => <li>{detail}</li>)}
    </ul>
    {tools && <p class="tools">Used: {tools}</p>}
  </div>
</article>
```

- [ ] **Step 4: Create homepage**

Create `src/pages/index.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import FeatureCard from "../components/FeatureCard.astro";
---

<BaseLayout>
  <section class="hero">
    <p class="eyebrow">Portfolio</p>
    <h1>Computer science, visualization, and observational art.</h1>
    <p>
      Walter Sands is a computer science PhD student at the University of Minnesota working across mixed reality,
      scientific visualization, software systems, and data. This site gathers research, industry experience, artwork,
      and projects in one place.
    </p>
  </section>

  <section class="grid" aria-label="Portfolio sections">
    <FeatureCard title="Experience" href="/experience/" meta="Research and practice" summary="PhD research, education, publication, industry roles, and technical skills." />
    <FeatureCard title="Art" href="/art/" meta="Still life and plein air" summary="A home for still lifes and outdoor painting collections as images are selected." />
    <FeatureCard title="Projects" href="/projects/" meta="Selected work" summary="A structured space for future technical and creative project writeups." />
  </section>

  <section class="section current-focus">
    <h2>Current focus</h2>
    <p>
      Research in the Interactive Visualization Lab explores mixed reality interfaces for scientific visualization and
      collaboration, including systems where a VR headset user can work alongside a robot in the same room.
    </p>
  </section>
</BaseLayout>
```

- [ ] **Step 5: Create experience page**

Create `src/pages/experience.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import PageHeader from "../components/PageHeader.astro";
import TimelineItem from "../components/TimelineItem.astro";
---

<BaseLayout title="Experience | Walter Sands">
  <PageHeader
    eyebrow="Experience"
    title="Research, software, data, and visualization."
    intro="A web-native summary of academic work, publication, industry roles, and technical skills."
  />

  <section class="section">
    <h2>Current Focus</h2>
    <p>
      Walter is pursuing a PhD in Computer Science at the University of Minnesota and researching as part of the
      Interactive Visualization Lab. His current work spans mixed reality, VR, scientific visualization, and a robotics
      collaboration focused on enabling a VR headset user to work alongside a robot in the same room.
    </p>
    <p class="tools">Used: Unity, C#, ROS2, Docker</p>
  </section>

  <section class="section stack">
    <h2>Education</h2>
    <TimelineItem title="PhD Computer Science" org="University of Minnesota" date="2025-current" details={["Research in the Interactive Visualization Lab.", "Coursework includes Computer Graphics, Intelligent MR Systems, and Game Engine Architecture."]} />
    <TimelineItem title="M.S. Data Science" org="University of Minnesota" date="Completed 2025" details={["Capstone used VR to create a sketch-based interface for visualizing and interacting with fluid flow simulations.", "Coursework included 3D Drawing in eXtended Reality, Virtual Reality and 3D Interaction, Computer Vision, Deep Learning, and Applied Regression Analysis."]} tools="Unity, C#, ParaView" />
    <TimelineItem title="B.S. Computer Science, Mathematics minor" org="University of Minnesota Duluth" date="Completed 2019" details={["Undergraduate study in computer science with a mathematics minor."]} />
  </section>

  <section class="section">
    <h2>Publication</h2>
    <article class="callout">
      <h3>Drawing in the Flow: A Data-Aware Mixed-Reality Sketching Interface for Illustrative 3D Flow Visualization</h3>
      <p>Short paper published at IEEE VIS 2025 using a sketch-based interface to author scientific visualizations of 3D fluid flow data.</p>
      <p class="tools">DOI: 10.1109/VIS60296.2025.00067</p>
    </article>
  </section>

  <section class="section stack">
    <h2>Industry Experience</h2>
    <TimelineItem title="Associate Consultant" org="Daugherty Business Solutions, Minneapolis, MN" date="February 2022-August 2023" details={["Supported data science teams working on anomaly detection, model assessment, production data preparation, and internal software projects.", "Developed a cloud native serverless API with AWS API Gateway and Lambda, deployed with Terraform.", "Converted a project from Perl to Python and abstracted database connection/query methods for multiple environments."]} tools="Python, SQL/BigQuery, Airflow, GCP, Scala, AWS, Postgres, Terraform" />
    <TimelineItem title="Data Engineer" org="phData, Minneapolis, MN" date="March 2020-May 2021" details={["Collaborated with onshore and offshore team members to provide 24-hour client support for clusters and ETL pipelines.", "Automated cluster resource monitoring and notifications, improved testing/support processes, and conducted knowledge transfers."]} tools="Python, Bash, HiveSQL, Airflow, Hadoop, NodeJS" />
    <TimelineItem title="Software Developer" org="Output Technology Inc., Brooklyn Park, MN" date="June 2016-August 2019" details={["Created and maintained warehouse efficiency and usage logging programs.", "Developed a modular framework for deploying only the components needed at a specific location."]} tools="C++, MySQL" />
  </section>

  <section class="section">
    <h2>Skills</h2>
    <div class="skill-grid">
      <p><strong>Languages</strong><br />Python, C#, SQL, C++/C, Bash</p>
      <p><strong>Software/tools</strong><br />Visual Studio Code, Unity3D, NumPy, Pandas, PyTest, Git, ROS2, Docker, Airflow</p>
      <p><strong>Databases</strong><br />BigQuery, Postgres, Hive, MySQL</p>
      <p><strong>Cloud</strong><br />GCP, AWS</p>
      <p><strong>Operating systems</strong><br />Windows, Linux, Mac</p>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 6: Create art, projects, and about pages**

Create `src/pages/art.astro`:

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../layouts/BaseLayout.astro";
import PageHeader from "../components/PageHeader.astro";
import GallerySection from "../components/GallerySection.astro";

const artEntries = await getCollection("art");
const stillLifes = artEntries.filter((entry) => entry.data.category === "still-life");
const pleinAir = artEntries.filter((entry) => entry.data.category === "outdoor-plein-air");
---

<BaseLayout title="Art | Walter Sands">
  <PageHeader
    eyebrow="Art"
    title="Still lifes and outdoor painting."
    intro="A quiet gallery structure for observational work. Images will be added as collections are selected."
  />
  <GallerySection title="Still Lifes" summary="Paintings and studies built around close looking, arrangement, and light." entries={stillLifes} />
  <GallerySection title="Outdoor / Plein Air" summary="Outdoor work made from direct observation of landscape, weather, and place." entries={pleinAir} />
</BaseLayout>
```

Create `src/pages/projects.astro`:

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../layouts/BaseLayout.astro";
import PageHeader from "../components/PageHeader.astro";

const projects = await getCollection("projects");
---

<BaseLayout title="Projects | Walter Sands">
  <PageHeader
    eyebrow="Projects"
    title="Selected projects will live here."
    intro="This page is ready for technical and creative project writeups once the final set is chosen."
  />
  <section class="section project-list">
    {
      projects.map((project) => (
        <article class="callout">
          <h2>{project.data.title}</h2>
          <p>{project.data.summary}</p>
          <p class="tools">{project.data.status === "planned" ? "Project details to be added" : project.data.tools.join(", ")}</p>
        </article>
      ))
    }
  </section>
</BaseLayout>
```

Create `src/pages/about.astro`:

```astro
---
import BaseLayout from "../layouts/BaseLayout.astro";
import PageHeader from "../components/PageHeader.astro";
---

<BaseLayout title="About | Walter Sands">
  <PageHeader
    eyebrow="About"
    title="A practice across code, visualization, and looking closely."
    intro="Walter's work connects computer science research, software and data systems, and observational painting."
  />
  <section class="section about-copy">
    <p>
      Walter Sands is a computer science PhD student at the University of Minnesota with interests in computer graphics,
      mixed reality, scientific visualization, robotics collaboration, and practical software systems. His professional
      background includes data engineering, consulting, warehouse software, cloud systems, and visualization tools.
    </p>
    <p>
      Alongside technical work, Walter maintains an art practice focused on still lifes and outdoor/plein air painting.
      The portfolio is structured to let those threads sit together: careful systems work, visual exploration, and direct
      observation.
    </p>
  </section>
</BaseLayout>
```

- [ ] **Step 7: Add page-specific styles**

Append to `src/styles/global.css`:

```css
.hero {
  min-height: 58vh;
  display: grid;
  align-content: center;
  gap: 18px;
  padding: 48px 0 56px;
}

.hero p:not(.eyebrow) {
  max-width: 760px;
  font-size: 1.12rem;
}

.current-focus {
  max-width: 820px;
}

.timeline-item {
  display: grid;
  grid-template-columns: minmax(190px, 260px) 1fr;
  gap: 26px;
  padding: 24px 0;
  border-top: 1px solid var(--line);
}

.timeline-item ul {
  margin: 0;
  padding-left: 20px;
  color: var(--muted);
}

.org,
.tools {
  color: var(--accent-dark);
  font-weight: 700;
}

.callout {
  padding: 24px;
  border: 1px solid var(--line);
  background: var(--panel);
  border-radius: 8px;
  box-shadow: var(--shadow);
}

.skill-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.project-list,
.about-copy {
  max-width: 780px;
}

@media (max-width: 760px) {
  .hero {
    min-height: auto;
  }

  .timeline-item,
  .skill-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 8: Build, verify dist, and commit**

Run:

```bash
pnpm verify
```

Expected:

```text
Source verification passed
Dist verification passed
```

Run:

```bash
git add scripts/verify-dist.mjs src/pages src/components/TimelineItem.astro src/styles/global.css
git commit -m "feat: build portfolio pages"
```

---

### Task 5: GitHub Pages Workflow And Repository Readiness

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`
- Modify: `astro.config.mjs`

**Interfaces:**
- Consumes: `pnpm verify` from earlier tasks.
- Produces:
  - GitHub Actions workflow that deploys `dist` to GitHub Pages.
  - README with local development and deployment instructions.

- [ ] **Step 1: Create GitHub Pages workflow**

Before creating the workflow, confirm the current branch is `main`:

```bash
git branch --show-current
```

Expected:

```text
main
```

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Verify and build
        run: pnpm verify

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Create README**

Create `README.md`:

```md
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
```

- [ ] **Step 3: Confirm Astro site URL before first push**

Use the GitHub Pages user-site repository name `wallysands.github.io`. Keep `astro.config.mjs` as:

```js
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://wallysands.github.io",
  output: "static",
});
```

If the repository is later changed to a project-site repository, update this plan before implementation rather than guessing the `base` path.

- [ ] **Step 4: Verify and commit**

Run:

```bash
pnpm verify
```

Expected: source verification, Astro check/build, and dist verification all pass.

Run:

```bash
git add .github/workflows/deploy.yml README.md astro.config.mjs
git commit -m "ci: add GitHub Pages deployment"
```

---

### Task 6: Final Local QA

**Files:**
- Modify only files that fail QA.

**Interfaces:**
- Consumes: the full site built in Tasks 1-5.
- Produces: verified local site ready to push to GitHub.

- [ ] **Step 1: Run full verification**

Run:

```bash
pnpm verify
```

Expected:

```text
Source verification passed
Dist verification passed
```

Astro check/build must complete with zero errors.

- [ ] **Step 2: Start local preview**

Run:

```bash
pnpm preview -- --host 127.0.0.1
```

Expected: Astro prints a local preview URL such as `http://127.0.0.1:4321/`.

- [ ] **Step 3: Inspect pages in a browser**

Open the preview URL and check:

- Home has a first-screen portfolio entry point, not a marketing landing page.
- Navigation includes Home, Experience, Art, Projects, About, and LinkedIn.
- Experience page includes Current Focus, Education, Publication, Industry Experience, and Skills.
- Art page has Still Lifes and Outdoor / Plein Air sections.
- Projects page looks intentional before project entries are chosen.
- About page connects computer science, visualization, data/software, and art practice.
- Mobile width does not create overlapping text or broken navigation.

- [ ] **Step 4: Run a final private-contact scan**

Run:

```bash
pnpm verify:source
pnpm verify:dist
rg -n "<private-contact-regression-pattern>|mail-to:" .
```

Expected:

```text
Source verification passed
Dist verification passed
```

The `rg` command must not find private contact literals in tracked site content. Verifier scripts should construct any private regression patterns without storing the literal contact details in the repository.

- [ ] **Step 5: Commit QA fixes if any were needed**

If files changed during QA, run:

```bash
git add .
git commit -m "fix: polish portfolio QA issues"
```

If no files changed, do not create an empty commit.

---

## Self-Review Notes

- Spec coverage: Tasks cover Astro setup, Markdown content collections, home/experience/art/projects/about pages, LinkedIn-only public contact, GitHub Pages deployment, responsive styling, and privacy verification.
- Placeholder scan: The plan intentionally uses planned content states for art/projects, but there are no plan placeholders requiring implementer invention.
- Type consistency: `site`, collection schemas, component props, and verification script names are defined before they are consumed.

