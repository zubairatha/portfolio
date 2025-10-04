# Zubair Atha's Portfolio

Minimal, content-first portfolio showcasing projects, experience, and writing. Built with Next.js App Router, TypeScript, TailwindCSS v4, and MDX.

## Quick start

```bash
# From repo root
npm install
npm run dev
# open http://localhost:3000/about
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
- Glass morphism modal popups with detailed project information
- Color-coded technology tags
- Direct GitHub repository links
- Responsive grid layout

### Blog Features
- Search box filters by title/excerpt
- Clickable category pills on cards (filters list)
- Sticky Topics sidebar with counts
- MDX support for rich content

### Design
- Minimal, clean aesthetic
- Glass morphism effects
- Responsive design across all devices
- Smooth animations and transitions

## Pages
- `/about` – About page with glass morphism resume button
- `/experience` – Timeline of work experience and education
- `/projects` – Interactive project showcase with modal details
- `/blog` – Blog index with search and category filtering
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
- Projects data: `src/components/ProjectsHome.tsx` (parsed from `projects.txt`)
- Blog posts: `content/posts/*.mdx`

## Customize
- Header title/tagline in `src/components/SiteHeader.tsx`
- Social links and resume link in `src/components/SiteHeader.tsx`
- Navigation menu in `src/components/SiteHeader.tsx`
- Experience data in `src/data/experience.ts`
- Project information in `src/components/ProjectsHome.tsx`

## Technologies Used
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **TailwindCSS v4** for styling
- **MDX** for blog content
- **Lucide React** for icons
- **Glass morphism** design patterns
