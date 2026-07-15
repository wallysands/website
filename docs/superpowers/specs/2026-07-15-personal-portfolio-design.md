# Personal Portfolio Website Design

## Purpose

Build a personal website and portfolio for Walter Sands using GitHub Pages. The site should present a balanced studio/resume identity: computer science researcher, software/data practitioner, and visual artist. It should be easy for mixed audiences to navigate, while still letting employers quickly scan the professional signal.

## Audience

The site is for a mixed audience:

- Employers and recruiters who need quick access to experience, skills, and research direction.
- Academic readers and collaborators interested in visualization, mixed reality, robotics collaboration, and data science.
- Creative viewers interested in still life and outdoor/plein air artwork.

The design should prioritize clarity and scannability without making the site feel like a plain resume.

## Content Principles

- Use public-facing content only.
- Do not include street address, phone number, or email address from the source resume.
- Use LinkedIn as the only public contact link: https://www.linkedin.com/in/walter-sands-b200048b/
- Keep projects and art easy to add later through Markdown files.
- Make partially filled sections feel intentional, not unfinished.

## Recommended Stack

Use Astro with Markdown/MDX content collections and deploy the static output to GitHub Pages.

Astro is the best fit because it supports fast static pages, simple Markdown editing, image-heavy sections, reusable components, and GitHub Pages deployment without unnecessary application complexity.

## Site Map

The main navigation should include:

- Home
- Experience
- Art
- Projects
- About
- LinkedIn

The LinkedIn item should link directly to the public LinkedIn profile.

## Home Page

The home page should introduce Walter as a whole person rather than leading with only one identity. It should include:

- A concise intro focused on computer science research, mixed reality/visualization, software/data experience, and art practice.
- Three equal-weight paths:
  - Experience: research, education, industry roles, publication, and skills.
  - Art: still lifes and outdoor/plein air work.
  - Projects: selected technical and creative projects, with content to be determined later.
- A compact featured/current section that can highlight current PhD research or one featured project/art item later.

## Experience Page

The experience page should be seeded from the resume, rewritten for the web and stripped of private contact information.

Recommended sections:

1. Current Focus
   - PhD Computer Science at the University of Minnesota.
   - Research in the Interactive Visualization Lab.
   - Mixed reality/VR, scientific visualization, and collaboration with a robotics lab.
   - Current system direction: enabling a VR headset user to work alongside a robot in the same room.

2. Education
   - University of Minnesota, PhD Computer Science, 2025-current.
   - University of Minnesota, M.S. Data Science, completed 2025.
   - University of Minnesota Duluth, B.S. Computer Science with Mathematics minor, completed 2019.

3. Publication
   - "Drawing in the Flow: A Data-Aware Mixed-Reality Sketching Interface for Illustrative 3D Flow Visualization"
   - IEEE VIS 2025 short paper.
   - DOI: 10.1109/VIS60296.2025.00067

4. Industry Experience
   - Daugherty Business Solutions, Associate Consultant, February 2022-August 2023.
   - phData, Data Engineer, March 2020-May 2021.
   - Output Technology Inc., Software Developer, June 2016-August 2019.

5. Skills
   - Languages: Python, C#, SQL, C++/C, Bash.
   - Software/tools: Visual Studio Code, Unity3D, NumPy, Pandas, PyTest, Git, ROS2, Docker, Airflow.
   - Databases: BigQuery, Postgres, Hive, MySQL.
   - Cloud: GCP, AWS.
   - Operating systems: Windows, Linux, Mac.

The layout should be scan-friendly and use web-native summaries rather than copying the resume verbatim.

## Art Page

The art page should have two top-level gallery sections:

- Still Lifes
- Outdoor / Plein Air

The page should be ready for images later. Each artwork entry should support:

- Title
- Year
- Medium
- Category
- Image path
- Optional description or notes

Until images are provided, the page can show refined empty states or a small number of placeholders only if they feel intentional and are clearly not final artwork.

## Projects Page

The projects page should be structured now but filled later. It should include:

- A clean projects index.
- Placeholder copy indicating selected projects will be added.
- A reusable project detail template for future entries.

Each future project entry should support:

- Title
- Summary
- Tools/technologies
- Year or date range
- Links, if available
- Problem/process/outcome sections
- Optional image or thumbnail

## About Page

The about page should connect the professional, academic, and creative parts of the site. It can describe interests in computer graphics, visualization, mixed reality, software systems, data work, and observational painting.

The tone should be personable and concise. It should not duplicate the full experience page.

## Content Model

Use Markdown or MDX files for maintainability:

- `src/content/experience/` for experience entries if the experience page is assembled from reusable content.
- `src/content/art/` for future artwork entries.
- `src/content/projects/` for future project entries.

Each collection should use frontmatter for consistent metadata. The site should be easy to update by adding or editing Markdown files.

## Technical Architecture

Recommended Astro structure:

- `src/pages/` for top-level routes such as `/`, `/experience`, `/art`, `/projects`, and `/about`.
- `src/components/` for navigation, page headers, timeline items, gallery sections, cards, and link buttons.
- `src/content/` for Markdown/MDX content collections.
- `src/layouts/` for shared page layout.
- `public/images/` for future artwork and project images.

GitHub Pages deployment should use GitHub Actions to install dependencies, build Astro, and publish the generated static site.

## Visual Direction

The visual design should feel balanced, clear, and personal:

- Professional enough for employers to scan.
- Quiet enough that artwork can breathe.
- Distinct enough to feel like an individual portfolio, not a generic resume template.

Avoid making the home page a marketing landing page. The first screen should be the actual portfolio entry point.

## Verification

Before launch, verify:

- Astro builds successfully.
- GitHub Pages workflow publishes the site.
- Navigation links work.
- Layout works on desktop and mobile.
- Art sections can handle missing images gracefully.
- Projects page looks intentional even before project content is added.
- No private address, phone number, or email appears anywhere in the generated site.

## Open Content To Provide Later

- Artwork images for Still Lifes.
- Artwork images for Outdoor / Plein Air.
- Final project list and project details.
- Optional project-specific links, such as demos, repositories, or publications, if they are attached to future project entries.
