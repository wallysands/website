# Ray Tracer And Tournament Searcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two complete portfolio project entries for the Ray Tracer and 2-Handicap Tournament Searcher.

**Architecture:** Keep the implementation content-first by adding two Astro content collection markdown files and local project assets. Update the existing source and dist verification scripts first so the new pages, assets, required phrases, GitHub link, and Notion-link prohibition are enforced.

**Tech Stack:** Astro 5 content collections, Markdown, global CSS, Node verifier scripts, Python/pypdf/Pillow for PDF image extraction.

## Global Constraints

- The public website must not link to the Notion ray tracer page.
- The public website may link to `https://github.com/wallysands/TournamentSearch`.
- Do not use the local WSL path in public content.
- Do not commit temporary signed Notion asset URLs.
- Preserve the existing Astro content model, current navigation, palette, and page layout.
- Avoid unrelated refactors.
- Keep copy concise and portfolio-oriented rather than assignment-report oriented.
- Update verifier expectations before adding the content that satisfies them.

---

## File Structure

- Modify `scripts/verify-source.mjs`: add expected assets and required content checks for `ray-tracer` and `two-handicap-tournament-searcher`.
- Modify `scripts/verify-dist.mjs`: add required generated pages, expected rendered text, required image URLs, and the TournamentSearch GitHub link.
- Create `src/content/projects/ray-tracer.md`: Ray Tracer project content.
- Create `src/content/projects/two-handicap-tournament-searcher.md`: Tournament Searcher project content.
- Create `public/projects/tournament-searcher/graph-11.jpg`: graph figure extracted from poster.
- Create `public/projects/tournament-searcher/graph-20.jpg`: graph figure extracted from poster and used as thumbnail.
- Create `public/projects/tournament-searcher/graph-24.jpg`: graph figure extracted from poster.
- Create `public/projects/tournament-searcher/graph-28.jpg`: graph figure extracted from poster.
- Create `public/projects/ray-tracer/spheres1-result.png`: first result render saved locally from the ray tracer report.
- Create `public/projects/ray-tracer/spheres2-result.png`: second result render saved locally from the ray tracer report.
- Modify `src/styles/global.css`: only if needed, add a small grid variant for compact project figures.

## Task 1: Verifier Expectations

**Files:**
- Modify: `scripts/verify-source.mjs`
- Modify: `scripts/verify-dist.mjs`

**Interfaces:**
- Consumes: current verifier arrays and phrase checks in both scripts.
- Produces: failing verification checks for both new project pages before content/assets are added.

- [ ] **Step 1: Update source verifier expected project assets**

In `scripts/verify-source.mjs`, replace the existing `expectedProjectAssets` declaration with this exact array:

```js
const expectedProjectAssets = [
  "public/projects/jello-jump/player-texture.jpg",
  "public/projects/jello-jump/game-with-audio-and-closer-camera.mp4",
  "public/projects/jello-jump/jump-stretch-squash.png",
  "public/projects/jello-jump/diagonal-stretching.png",
  "public/projects/jello-jump/wall-impact.png",
  "public/projects/tournament-searcher/graph-11.jpg",
  "public/projects/tournament-searcher/graph-20.jpg",
  "public/projects/tournament-searcher/graph-24.jpg",
  "public/projects/tournament-searcher/graph-28.jpg",
  "public/projects/ray-tracer/spheres1-result.png",
  "public/projects/ray-tracer/spheres2-result.png",
];
```

- [ ] **Step 2: Update source verifier required project phrases**

In `scripts/verify-source.mjs`, replace the required text loop that currently starts with:

```js
for (const requiredText of ["Still Lifes", "Outdoor / Plein Air", "Selected projects", "Jello Jump", "squash and stretch", "Affine transformation sketches"]) {
```

with this exact loop:

```js
for (const requiredText of [
  "Still Lifes",
  "Outdoor / Plein Air",
  "Selected projects",
  "Jello Jump",
  "squash and stretch",
  "Affine transformation sketches",
  "Ray Tracer",
  "recursive reflection and refraction",
  "OpenMP",
  "2-Handicap Tournament Searcher",
  "recursive backtracking",
  "symmetric tournament",
  "https://github.com/wallysands/TournamentSearch",
]) {
  if (!allText.includes(requiredText)) failures.push(`Missing content phrase: ${requiredText}`);
}
```

- [ ] **Step 3: Update dist required pages**

In `scripts/verify-dist.mjs`, replace the `requiredPages` array with:

```js
const requiredPages = [
  "index.html",
  "experience/index.html",
  "publications/index.html",
  "art/index.html",
  "projects/index.html",
  "projects/jello-jump/index.html",
  "projects/ray-tracer/index.html",
  "projects/two-handicap-tournament-searcher/index.html",
  "about/index.html",
];
```

- [ ] **Step 4: Update dist required project page text**

In `scripts/verify-dist.mjs`, update `requiredTextByPage` so the project-related entries are:

```js
  "projects/index.html": [
    "Selected projects",
    "Jello Jump",
    "Ray Tracer",
    "2-Handicap Tournament Searcher",
    "OpenGL",
    "OpenMP",
    "Python",
  ],
  "projects/jello-jump/index.html": [
    "Jello Jump",
    "squash and stretch",
    "time-based animation",
    "OpenGL",
    "SDL3",
    "Affine transformation sketches",
    "<video",
    "/website/projects/jello-jump/game-with-audio-and-closer-camera.mp4",
    "/website/projects/jello-jump/player-texture.jpg",
    "/website/projects/jello-jump/jump-stretch-squash.png",
    "/website/projects/jello-jump/diagonal-stretching.png",
    "/website/projects/jello-jump/wall-impact.png",
  ],
  "projects/ray-tracer/index.html": [
    "Ray Tracer",
    "recursive reflection and refraction",
    "sphere and triangle intersections",
    "spot lights",
    "OpenMP",
    "/website/projects/ray-tracer/spheres1-result.png",
    "/website/projects/ray-tracer/spheres2-result.png",
  ],
  "projects/two-handicap-tournament-searcher/index.html": [
    "2-Handicap Tournament Searcher",
    "recursive backtracking",
    "symmetric tournament",
    "TournamentSearch",
    "https://github.com/wallysands/TournamentSearch",
    "/website/projects/tournament-searcher/graph-11.jpg",
    "/website/projects/tournament-searcher/graph-20.jpg",
    "/website/projects/tournament-searcher/graph-24.jpg",
    "/website/projects/tournament-searcher/graph-28.jpg",
  ],
```

Keep the existing non-project entries in `requiredTextByPage` unchanged.

- [ ] **Step 5: Update dist forbidden text**

In `scripts/verify-dist.mjs`, update `forbiddenTextByPage` so the project-related entries include:

```js
  "projects/index.html": ["notion.com"],
  "projects/jello-jump/index.html": ["notion.com", "A tile map loaded from", "jello-jump-walkthrough.mp4", "affine-vertical.png", "affine-diagonal.png", "affine-wall-impact.png"],
  "projects/ray-tracer/index.html": ["notion.com", "wsl.localhost", "raytraced.png"],
  "projects/two-handicap-tournament-searcher/index.html": ["notion.com", "wsl.localhost"],
```

Keep the existing non-project entries in `forbiddenTextByPage` unchanged.

- [ ] **Step 6: Run source verification and confirm the new checks fail**

Run:

```bash
pnpm verify:source
```

Expected: FAIL with missing content phrases for `Ray Tracer`, `recursive reflection and refraction`, `2-Handicap Tournament Searcher`, and missing project asset messages for the new ray tracer and tournament image paths.

- [ ] **Step 7: Run dist verification and confirm the new checks fail**

Run:

```bash
pnpm build
pnpm verify:dist
```

Expected: `pnpm build` still succeeds with the old site, and `pnpm verify:dist` FAILS with missing dist pages for `projects/ray-tracer/index.html` and `projects/two-handicap-tournament-searcher/index.html`.

- [ ] **Step 8: Commit verifier expectations**

Run:

```bash
git add scripts/verify-source.mjs scripts/verify-dist.mjs
git commit -m "test: require ray tracer and tournament project pages"
```

## Task 2: Tournament Searcher Assets

**Files:**
- Create: `public/projects/tournament-searcher/graph-11.jpg`
- Create: `public/projects/tournament-searcher/graph-20.jpg`
- Create: `public/projects/tournament-searcher/graph-24.jpg`
- Create: `public/projects/tournament-searcher/graph-28.jpg`

**Interfaces:**
- Consumes: `C:/Users/wally/Downloads/2-Handicap Tournament Poster.pdf`.
- Produces: stable local graph figure assets referenced by the tournament markdown and verifiers.

- [ ] **Step 1: Extract graph figures from the poster**

Run this command from the repo root:

```powershell
$env:PYTHONIOENCODING='utf-8'
New-Item -ItemType Directory -Force -Path 'public/projects/tournament-searcher' | Out-Null
@'
from pathlib import Path
from pypdf import PdfReader
from PIL import Image
from io import BytesIO

pdf_path = Path(r"C:\Users\wally\Downloads\2-Handicap Tournament Poster.pdf")
out_dir = Path("public/projects/tournament-searcher")
reader = PdfReader(str(pdf_path))
images = list(reader.pages[0].images)
mapping = {
    1: "graph-11.jpg",
    2: "graph-20.jpg",
    3: "graph-24.jpg",
    4: "graph-28.jpg",
}

for image_index, file_name in mapping.items():
    image = images[image_index]
    with Image.open(BytesIO(image.data)) as im:
        rgb = im.convert("RGB")
        rgb.save(out_dir / file_name, quality=92, optimize=True)
'@ | python -
```

Expected: four files are created under `public/projects/tournament-searcher/`.

- [ ] **Step 2: Verify extracted files exist**

Run:

```powershell
Get-ChildItem 'public/projects/tournament-searcher' -File | Select-Object Name,Length
```

Expected: output includes `graph-11.jpg`, `graph-20.jpg`, `graph-24.jpg`, and `graph-28.jpg`, each with nonzero length.

- [ ] **Step 3: Commit tournament assets**

Run:

```bash
git add public/projects/tournament-searcher/graph-11.jpg public/projects/tournament-searcher/graph-20.jpg public/projects/tournament-searcher/graph-24.jpg public/projects/tournament-searcher/graph-28.jpg
git commit -m "feat: add tournament graph assets"
```

## Task 3: Ray Tracer Assets

**Files:**
- Create: `public/projects/ray-tracer/spheres1-result.png`
- Create: `public/projects/ray-tracer/spheres2-result.png`

**Interfaces:**
- Consumes: the connected Notion page `https://app.notion.com/p/Project-3b-CSCI-5607-Fall-2025-Walter-Sands-29c37e7a55fe801092ccd2b6caa9e3e2`.
- Produces: stable local render images. The website never references the Notion page or signed URLs.

- [ ] **Step 1: Fetch the ray tracer report with the Notion tool**

Fetch the page:

```text
https://app.notion.com/p/Project-3b-CSCI-5607-Fall-2025-Walter-Sands-29c37e7a55fe801092ccd2b6caa9e3e2
```

Expected: the fetched content includes image URLs after the labels `spheres1.txt` and `spheres2.txt`.

- [ ] **Step 2: Save the first result image for `spheres1.txt`**

Create `public/projects/ray-tracer/`, download the first image URL that appears after `spheres1.txt`, and save it as:

```text
public/projects/ray-tracer/spheres1-result.png
```

Use PowerShell `Invoke-WebRequest` or Python `urllib.request.urlretrieve`; do not write the signed URL into any committed source file.

- [ ] **Step 3: Save the first result image for `spheres2.txt`**

Download the first image URL that appears after `spheres2.txt`, and save it as:

```text
public/projects/ray-tracer/spheres2-result.png
```

Use PowerShell `Invoke-WebRequest` or Python `urllib.request.urlretrieve`; do not write the signed URL into any committed source file.

- [ ] **Step 4: Verify ray tracer assets exist**

Run:

```powershell
Get-ChildItem 'public/projects/ray-tracer' -File | Select-Object Name,Length
```

Expected: output includes `spheres1-result.png` and `spheres2-result.png`, each with nonzero length.

- [ ] **Step 5: Commit ray tracer assets**

Run:

```bash
git add public/projects/ray-tracer/spheres1-result.png public/projects/ray-tracer/spheres2-result.png
git commit -m "feat: add ray tracer render assets"
```

## Task 4: Project Markdown Content

**Files:**
- Create: `src/content/projects/ray-tracer.md`
- Create: `src/content/projects/two-handicap-tournament-searcher.md`

**Interfaces:**
- Consumes: image assets from Tasks 2 and 3.
- Produces: content collection entries consumed automatically by `src/pages/projects.astro` and `src/pages/projects/[slug].astro`.

- [ ] **Step 1: Create Ray Tracer markdown**

Create `src/content/projects/ray-tracer.md` with exactly this content:

```markdown
---
title: "Ray Tracer"
summary: "A C++ scene-file ray tracer with sphere and triangle intersections, polymorphic lighting, shadows, recursive reflection and refraction, spot lights, and OpenMP parallelization."
year: "2025"
tools: ["C++14", "OpenMP", "STB Image", "custom scene parser", "Vec3 math"]
links: []
status: "available"
image: "/projects/ray-tracer/spheres1-result.png"
---

Ray Tracer is a CSCI 5607 graphics project that turns plain-text scene descriptions into rendered images. The program parses camera settings, geometry, materials, lights, output size, and recursion depth, then traces one camera ray per pixel to shade the closest visible object.

The core renderer follows the full ray-tracing loop: generate a camera ray, test it against every shape, keep the nearest positive hit, compute the surface normal, shade the hit point, and write the resulting color. Shapes share a common interface, so spheres, flat triangles, and smooth normal-interpolated triangles can be handled in the same pass.

Lighting uses the same polymorphic pattern. Ambient, point, directional, and spot lights each calculate their contribution differently, while shadow checks cast rays back through the scene to see whether another object blocks the light. Spot lights were added as an extension, with a falloff region between the inner and outer cone.

The material model supports recursive reflection and refraction. At each hit point the tracer spawns reflected rays from the surface normal and refracted rays through the material's index of refraction, stopping at the configured maximum depth. Small offsets along the normal keep secondary rays from immediately hitting the same surface again.

Two bugs shaped the final renderer. Specular and refractive scenes started out visibly different from the reference images until the recursion condition was fixed to include the maximum depth. Triangle shadows also failed in some scenes because a directional light was being interpreted in the reverse direction.

OpenMP parallelizes the outer pixel loop so independent rays can be traced across CPU cores. On the scenes measured in the project report, the parallel version cut representative render times from 1381.16 ms to 353.78 ms for `spheres1.txt`, 3933.61 ms to 1141.02 ms for `spheres2.txt`, and 5523.71 ms to 1729.73 ms for `test_reasonable.txt`.

## Render samples

<div class="project-figure-grid project-figure-grid-compact">
  <figure>
    <img src="/website/projects/ray-tracer/spheres1-result.png" alt="Ray traced render from the spheres1 scene file." loading="lazy" />
    <figcaption>`spheres1.txt`: recursive shading and shadows on a simple sphere scene.</figcaption>
  </figure>
  <figure>
    <img src="/website/projects/ray-tracer/spheres2-result.png" alt="Ray traced render from the spheres2 scene file." loading="lazy" />
    <figcaption>`spheres2.txt`: additional geometry and reflective material behavior.</figcaption>
  </figure>
</div>
```

- [ ] **Step 2: Create tournament markdown**

Create `src/content/projects/two-handicap-tournament-searcher.md` with exactly this content:

```markdown
---
title: "2-Handicap Tournament Searcher"
summary: "A Python backtracking search for small 2-handicap tournament graphs, using weight-based pruning, multiprocessing, and a symmetric search variant for graph families."
year: "2019"
tools: ["Python", "multiprocessing", "recursive backtracking", "graph theory"]
links:
  - label: "View code"
    href: "https://github.com/wallysands/TournamentSearch"
status: "available"
image: "/projects/tournament-searcher/graph-20.jpg"
---

2-Handicap Tournament Searcher grew out of a UROP research project on regular handicap tournaments. In these tournaments, each team plays only `k` opponents, and the strength of schedule increases arithmetically with team rank. The project focused on the `d = 2` case: schedule weights should rise by exactly two from one seed to the next.

The search represents a tournament as an `n` by `k` matrix of opponents. A recursive backtracking function walks through each team and game slot, proposes an opponent, mirrors that edge into the opponent's row, and continues only if both rows can still become valid schedules.

Several pruning checks keep the search from trying every possible graph blindly. Completed rows must equal their target weight, partial rows stop early if they already exceed that weight, duplicate opponents are rejected, and opponent rows are checked to make sure their remaining empty slots can still reach the required total.

The general search splits the first team's possible opponent range across multiple worker processes. A second symmetric scheduler searches half of the graph while enforcing a complementary structure, which was useful for tournaments where the number of teams is divisible by four.

The final poster summarized small 2-handicap tournament results, including valid examples for `(11, 4)`, `(13, 6)`, `(14, 6)`, `(15, 4)`, `(15, 6)`, and `(15, 8)`. It also showed symmetric 4-regular examples on 20, 24, and 28 vertices, supporting the broader graph-family discussion.

## Graph results

<div class="project-figure-grid project-figure-grid-compact">
  <figure>
    <img src="/website/projects/tournament-searcher/graph-11.jpg" alt="A 4-regular 2-handicap tournament graph on 11 vertices." loading="lazy" />
    <figcaption>A 4-regular, 2-handicap tournament on 11 vertices.</figcaption>
  </figure>
  <figure>
    <img src="/website/projects/tournament-searcher/graph-20.jpg" alt="A 4-regular 2-handicap tournament graph on 20 vertices." loading="lazy" />
    <figcaption>A symmetric 4-regular, 2-handicap tournament on 20 vertices.</figcaption>
  </figure>
  <figure>
    <img src="/website/projects/tournament-searcher/graph-24.jpg" alt="A 4-regular 2-handicap tournament graph on 24 vertices." loading="lazy" />
    <figcaption>A symmetric 4-regular, 2-handicap tournament on 24 vertices.</figcaption>
  </figure>
  <figure>
    <img src="/website/projects/tournament-searcher/graph-28.jpg" alt="A 4-regular 2-handicap tournament graph on 28 vertices." loading="lazy" />
    <figcaption>A symmetric 4-regular, 2-handicap tournament on 28 vertices.</figcaption>
  </figure>
</div>
```

- [ ] **Step 3: Run source verification**

Run:

```bash
pnpm verify:source
```

Expected: PASS if all assets and required phrases are present and no public source contains a Notion link.

- [ ] **Step 4: Commit project markdown**

Run:

```bash
git add src/content/projects/ray-tracer.md src/content/projects/two-handicap-tournament-searcher.md
git commit -m "feat: add ray tracer and tournament project pages"
```

## Task 5: Figure Grid Styling

**Files:**
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `project-figure-grid-compact` class used in Task 4 markdown.
- Produces: responsive two-column project figure grids that remain single-column on mobile.

- [ ] **Step 1: Add compact figure grid CSS**

In `src/styles/global.css`, after the existing `.project-figure-grid figure` rule, add:

```css
.project-figure-grid-compact {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.project-figure-grid-compact figure {
  max-width: 100%;
}
```

Inside the existing `@media (max-width: 760px)` block near the bottom, add:

```css
  .project-figure-grid-compact {
    grid-template-columns: 1fr;
  }
```

- [ ] **Step 2: Build to verify CSS and markdown render**

Run:

```bash
pnpm build
```

Expected: PASS with Astro check and build completing without errors.

- [ ] **Step 3: Commit compact figure styling**

Run:

```bash
git add src/styles/global.css
git commit -m "style: support compact project figure grids"
```

## Task 6: Final Verification

**Files:**
- No planned file changes unless verification reveals a real defect.

**Interfaces:**
- Consumes: all completed project content, assets, CSS, and verifier updates.
- Produces: verified site build with both new project pages.

- [ ] **Step 1: Run full verification**

Run:

```bash
pnpm verify
```

Expected: PASS with:
- `Source verification passed`
- Astro check/build success
- `Dist verification passed`

- [ ] **Step 2: Inspect git status**

Run:

```bash
git status --short
```

Expected: only pre-existing unrelated changes remain unstaged, or the tree is clean if no unrelated changes existed. Do not revert user changes.

- [ ] **Step 3: Report results**

Report:
- new project pages added,
- local assets added,
- TournamentSearch link included,
- Notion link omitted,
- `pnpm verify` result.

Do not claim completion unless `pnpm verify` has passed in the current turn.

## Self-Review

- Spec coverage: all approved requirements map to tasks: verifier-first checks, two markdown pages, tournament GitHub link, no Notion link, local assets, and final verification.
- Completion scan: every step names concrete files, commands, expected outcomes, and exact content where source changes are planned.
- Type and path consistency: slugs are `ray-tracer` and `two-handicap-tournament-searcher`; asset paths match verifier paths and markdown references.
