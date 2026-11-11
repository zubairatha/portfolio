# Zubair Atha's Portfolio

Minimal, content-first portfolio showcasing projects, experience, and writing. Built with Next.js App Router, TypeScript, TailwindCSS v4, and MDX.

## Quick start

```bash
# From repo root
npm install
npm run dev
# open http://localhost:3000
```

If `npm` is not found, ensure Volta is on PATH:
```bash
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"
```

## Add a new blog post

All posts live in `content/posts/*.mdx`.

Frontmatter format:
```md
---
title: "Post Title"
date: "YYYY-MM-DD"   # e.g. 2025-09-26
categories: ["AI", "Notes"]
excerpt: "One-sentence summary."
slug: "optional-custom-slug"  # defaults to filename without .mdx
---

# Your content here

- Markdown and MDX supported
- Code blocks, tables, images (serve from /public)
```

Example:
```md
---
title: "Hello, Blog"
date: "2025-09-26"
categories: ["AI"]
excerpt: "Kicking the tires on my blog."
slug: "hello-blog"
---
This is a **test** post.
```

## Key Features

### Projects Page
- Interactive project cards with hover effects
- Equal-sized project cards with concise highlights and complete details in a dialog
- Restrained technology labels
- Direct GitHub repository links
- Responsive grid layout

### Blog Features
- Search box filters by title/excerpt
- Minimal article list; category metadata preserved without filter controls
- MDX support for rich content

### Design
- Minimal, clean aesthetic
- Warm paper palette and editorial typography
- Responsive design across all devices
- Smooth animations and transitions

## Pages
- `/` – Centered introduction with an animated role title
- `/work` – Independently collapsible Experience, Projects, and Education
- `/frames` – Two photographic albums with responsive contact sheets and a keyboard-accessible photo viewer
- `/about` – Preserved About page, outside main navigation
- `/experience` – Legacy route displaying the Work page
- `/projects` – Preserved project showcase route with project detail dialogs
- `/blog` – Writing index with title/excerpt/category search
- `/blog/[slug]` – MDX post renderer

## Static export
`next.config.ts` uses `output: "export"` and sets `basePath` automatically on GitHub Actions to support GitHub Pages.

Build locally:
```bash
npm run build
# static site emitted to ./out
```

## Project Data
- Experience data: `src/data/experience.ts`
- Projects data: `src/data/projects.ts`
- Blog posts: `content/posts/*.mdx`

## Customize
- Header title/tagline in `src/components/SiteHeader.tsx`
- Social links in `src/components/SiteFooter.tsx`; résumé interface in `src/components/ResumePreview.tsx`
- Navigation menu in `src/components/SiteHeader.tsx`
- Experience data in `src/data/experience.ts`
- Project information in `src/data/projects.ts`

## Technologies Used
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **TailwindCSS v4** for styling
- **MDX** for blog content
- **Lucide React** for icons
- **Field Notes** editorial design

## Redesign validation

Run `npm run lint`, `npm run build`, and `node scripts/verify-content.mjs`.
The content check compares original experience, education, projects, MDX files,
and About content with `origin/main`. The Ford full-time role is the only added
experience entry. Build files use `.next/`; exported files remain in `out/`.

No dependencies were added. A single résumé link opens the supplied October
2026 PDF in a viewer with download controls. The document is served as
`public/documents/zubair-atha-resume.pdf`.

Work sections start collapsed. Project cards display shortened summaries and
selected technologies; complete original details remain available in dialogs.
The E-Commerce project is no longer displayed, as requested; its source record
is retained for archival content verification.

Frames contains Grand Canyon (24 photos) and Fall, 2025 (22 photos). Responsive WebP display images, thumbnails, and full-resolution JPG copies
live in `public/photos/`; original photo folders are unchanged. Wide contact
sheet images use the larger responsive sources. Opening a photograph loads
the original JPG on demand. Albums are statically generated under `/frames/[album]`.
The photo viewer supports previous/next controls, arrow keys, and Escape.
Résumé and project dialogs are centered explicitly to account for Tailwind
Preflight. The homepage types and deletes role titles on a dedicated line, with a pause
between titles. Reduced motion keeps the Data Scientist title static.

Browser automation was unavailable during implementation. Desktop/mobile visual
QA and live checks of accordions, project cards, search, dialog focus/Escape,
and pointer/reduced-motion behavior still need browser verification.

To preview the production export: `npm run build`, then
`python3 -m http.server 8080 --directory out` and open http://localhost:8080.

The homepage displays a single ASCII koi pond with six fish beneath the introduction.
Fish wander, approach slow pointers, scatter from sudden movement, and eat food
on click or tap. A small information control links to daoho.dev for inspiration.
The pond supports pause, keyboard interaction, a static reduced-motion view,
and pauses when offscreen or when the browser tab is hidden. The unused
`PaperRiver` implementation and scene factory remain in `src/lib/livingScenes.ts`
for future use. No dependencies were added.

Project cards use the same outlined tags as experience and omit metric callouts.
Grand Canyon uses photo 21 as its cover; Fall, 2025 omits photos 4, 20, 25, and 26.
Photo captions are empty, while descriptive image alt text is retained.
