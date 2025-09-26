# Your Portfolio

Minimal, content-first portfolio (About, Experience, Blog) built with Next.js App Router, TypeScript, TailwindCSS v4, and MDX.

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

## Blog features
- Search box filters by title/excerpt
- Clickable category pills on cards (filters list)
- Sticky Topics sidebar with counts

## Pages
- `/about` – basic prose page
- `/experience` – timeline from `src/data/experience.ts`
- `/blog` – index with search and topics
- `/blog/[slug]` – MDX post renderer

## Static export
`next.config.ts` uses `output: "export"` and sets `basePath` automatically on GitHub Actions to support GitHub Pages.

Build locally:
```bash
npm run build
# static site emitted to ./out
```

## Customize
- Header title/tagline in `src/components/SiteHeader.tsx`
- Social links in `src/components/SiteHeader.tsx` and `src/components/BlogHome.tsx`
- Experience data in `src/data/experience.ts`
