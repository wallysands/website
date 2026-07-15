# Ray Tracer And Tournament Searcher Project Pages Design

## Goal

Add the second and third portfolio projects as full project pages that match the current Astro content model and keep private source links off the public website.

## Current Site Context

The portfolio uses Astro content collections for projects. Project index cards are generated from `src/content/projects/*.md`, and the detail route at `src/pages/projects/[slug].astro` renders frontmatter, optional image or video media, markdown body content, project links, year, and tools. The existing `Jello Jump` project establishes the expected tone: concise narrative, technical details, and local visual assets stored under `public/projects/`.

The site also has source and dist verification scripts. Those scripts currently treat `Jello Jump` as required project content, so they should be updated when the new projects become part of the expected site surface.

## Project Pages

### Ray Tracer

The ray tracer will become a full project entry titled `Ray Tracer`.

Frontmatter:
- `title`: `Ray Tracer`
- `summary`: describe a C++ ray tracer that renders scene files with recursive reflection/refraction, sphere and triangle geometry, polymorphic lights, shadows, spot lights, and OpenMP parallelization.
- `year`: `2025`
- `tools`: `C++14`, `OpenMP`, `STB Image`, `custom scene parser`, `Vec3 math`
- `status`: `available`
- `links`: empty, because the Notion report and local WSL source path should not be linked publicly.
- `image`: a local project image if a suitable report render can be saved; otherwise omit until a good asset is available.

Body content:
- Introduce the project as a CSCI 5607 graphics ray tracer.
- Explain the render pipeline: parse a scene file, generate camera rays, find the closest object intersection, shade the hit point, and write the image.
- Describe supported geometry: spheres, flat triangles, and smooth normal-interpolated triangles.
- Describe supported lighting: ambient, point, directional, and spot lights, including shadow checks against all scene objects.
- Describe recursive materials: specular reflection, refraction through index-of-refraction changes, max-depth termination, and small normal offsets to avoid self-intersection.
- Include the debugging story from the report: specular/refraction differences, a depth condition bug, and a reversed directional-light issue affecting triangle shadows.
- Include the performance story: OpenMP parallelizes the pixel loop; the report table showed multi-core render times around 3-4 times faster on representative scenes.

Visuals:
- Prefer selected local copies of render/reference images from the Notion report.
- Do not link to the Notion page.
- Do not use temporary signed Notion image URLs in committed markdown.
- If stable render assets are not available during implementation, ship the text page without a hero image rather than using the black local `raytraced.png`.

### 2-Handicap Tournament Searcher

The tournament searcher will become a full project entry titled `2-Handicap Tournament Searcher`.

Frontmatter:
- `title`: `2-Handicap Tournament Searcher`
- `summary`: describe a Python backtracking search for small 2-handicap tournament graphs, with pruning, multiprocessing, and symmetric-solution search.
- `year`: `2019`
- `tools`: `Python`, `multiprocessing`, `recursive backtracking`, `graph theory`
- `status`: `available`
- `links`: include `View code` pointing to `https://github.com/wallysands/TournamentSearch`
- `image`: a local graph figure extracted from the poster, preferably the 20-vertex or 24-vertex graph because it reads well as a thumbnail.

Body content:
- Introduce regular `d`-handicap tournaments: teams play `k` opponents, and schedule strength increases arithmetically with rank.
- Explain the research goal: investigate the `d = 2` case, especially small feasible `(n, k)` pairs and graph families where the number of teams is divisible by 4.
- Explain the search representation: an `n` by `k` matrix of opponents.
- Explain the recursive search: fill team/game slots, mirror each edge into the opponent row, validate each completed team against its target weight, and backtrack on conflicts.
- Explain pruning: reject duplicate/opponent-order conflicts, stop rows that exceed their target weight, and reject opponent rows that can no longer reach their required weight.
- Explain parallelism: split the first opponent range across worker processes.
- Explain the symmetric variant: search half the graph while enforcing the complementary structure needed for divisible-by-4 tournament families.
- Summarize poster results: small-case existence table included examples such as `(11, 4)`, `(13, 6)`, `(14, 6)`, `(15, 4)`, `(15, 6)`, and `(15, 8)`, plus graph figures on 11, 20, 24, and 28 vertices.

Visuals:
- Extract poster graph figures into `public/projects/tournament-searcher/`.
- Use a figure grid in the markdown body for the 11-, 20-, 24-, and 28-vertex graphs.
- Captions should name the graph size and avoid cramped poster text.

## Architecture

Keep the implementation content-first:
- Add two markdown content files in `src/content/projects/`.
- Store all project images under `public/projects/ray-tracer/` and `public/projects/tournament-searcher/`.
- Reuse the existing project detail route and global project figure styles where possible.
- Add only minimal CSS if the existing `project-figure-grid` layout cannot present the tournament figures cleanly.
- Update `scripts/verify-source.mjs` and `scripts/verify-dist.mjs` so the new pages, assets, required phrases, and the absence of Notion links are verified.

## Constraints

- The public website must not link to the Notion ray tracer page.
- The public website may link to `https://github.com/wallysands/TournamentSearch`.
- Do not use the local WSL path in public content.
- Do not commit temporary signed Notion asset URLs.
- Preserve the existing Astro content model, current navigation, palette, and page layout.
- Avoid unrelated refactors.
- Keep copy concise and portfolio-oriented rather than assignment-report oriented.

## Testing And Verification

Implementation should follow test-first behavior by updating the verification scripts before adding the content that satisfies them.

Required checks:
- `pnpm verify:source` should fail before content/assets/verifier expectations are satisfied.
- `pnpm build` should generate detail pages for both new project slugs.
- `pnpm verify:dist` should require both new pages, expected text, project assets, the TournamentSearch GitHub link, and no Notion links.
- `pnpm verify` should pass after implementation.

## Open Decisions

The only implementation-time decision is the ray tracer visual asset. Use stable local copies of report renders if available. If those cannot be saved cleanly, omit the ray tracer hero image and rely on text until a better render is available.
