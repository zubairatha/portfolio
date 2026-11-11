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
- Keyboard-accessible expandable cards with complete project details
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
- `/` – Minimal introduction and cursor-reactive particle field
- `/work` – Independently collapsible Experience, Projects, and Education
- `/frames` – Intentionally empty photography placeholder
- `/about` – Preserved About page, outside main navigation
- `/experience` – Legacy route displaying the Work page
- `/projects` – Preserved project showcase route with expandable details
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

No dependencies were added. Résumé preview is explicitly a placeholder because
no PDF exists in the repository; download is disabled. The previous external
résumé link remains available in the dialog. Frames is intentionally empty.

Browser automation was unavailable during implementation. Desktop/mobile visual
QA and live checks of accordions, project cards, search, dialog focus/Escape,
and pointer/reduced-motion behavior still need browser verification.

To preview the production export: `npm run build`, then
`python3 -m http.server 8080 --directory out` and open http://localhost:8080.
