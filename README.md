# Portfolio

A personal portfolio built with Next.js, TypeScript, Tailwind CSS, and MDX. Includes work history, projects, writing, photo albums, and light/dark themes.

## Run locally

Requires Node.js 20+ and npm. No environment variables are required.

```bash
git clone https://github.com/zubairatha/portfolio.git
cd portfolio
npm ci
npm run dev
```

Open http://localhost:3000.

## Customize

Replace the personal information and assets before publishing your copy:

- Introduction: `src/app/page.tsx`
- Experience and education: `src/data/experience.ts`
- Projects: `src/data/projects.ts` and `src/data/projectHighlights.ts`
- Navigation and branding: `src/components/SiteHeader.tsx`
- Social links: `src/components/SiteFooter.tsx`
- Page title, description, and icons: `src/app/layout.tsx` and `public/icon.jpeg`
- Colors and layout: `src/app/globals.css`
- Résumé: `public/documents/zubair-atha-resume.pdf`
- Photo albums: `src/data/albums.ts` and `public/photos/`
- Additional personal content: `src/app/about/page.tsx` and `content/posts/`

Album filenames are numbered in display order. Each photo has a `.jpg` original, a `.webp` display image, and a `-thumb.webp` thumbnail. Update their paths, dimensions, and alt text in `albums.ts`; `cover` is a zero-based index into the album's photos.

## Write a post

Create `content/posts/your-post.mdx`. The filename determines its URL: `/blog/your-post/`.

```mdx
---
title: "Post title"
date: "2026-01-01"
categories: ["Notes"]
excerpt: "A short description."
---

Your Markdown or MDX content goes here.
```

## Build and deploy

```bash
npm run lint
npm run build
```

The site exports to `out/`. Deploy that directory to a static host such as Cloudflare Pages, using `npm run build` as the build command and `out` as the output directory.

To preview the production build locally:

```bash
python3 -m http.server 8080 --directory out
```

Open http://localhost:8080.

## License

[MIT](LICENSE).
