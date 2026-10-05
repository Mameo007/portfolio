# Portfolio

My personal portfolio: selected projects, resume and contact, built to be fast, accessible and easy to update.

**Stack:** [Astro](https://astro.build) · TypeScript · Tailwind CSS v4 · MDX content collections · Formspree

## Highlights

- Static output with near-zero client JavaScript
- Hide-on-scroll navigation with a full-screen mobile menu
- Word-by-word hero animation, scroll reveals and view-transition page morphs, all disabled under `prefers-reduced-motion`
- Automatic light/dark theme from design tokens
- Typed MDX case studies: adding a project means adding one file
- SEO: Open Graph image, JSON-LD, sitemap, robots.txt

## Getting started

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # production build to ./dist
npm run preview  # serve the build locally
npm run og       # regenerate public/og-image.png
```

Requires Node 22.12+.

## Updating content

| What | Where |
| --- | --- |
| Name, tagline, email, socials, Formspree ID | `src/data/site.ts` |
| Projects / case studies | `src/content/projects/*.mdx` (one file per project) |
| Resume entries | `src/data/resume.ts` |
| Resume PDF | `public/resume.pdf` (the download button appears automatically) |
| Colors, fonts, motion | `src/styles/global.css` |
| Domain (for sitemap, canonical URLs, robots.txt) | `site` in `astro.config.mjs` |

### Adding a project

Create `src/content/projects/my-project.mdx`:

```mdx
---
title: My Project
summary: One sentence on what it is and why it matters.
year: 2026
role: Full-stack engineer
stack: [TypeScript, React]
cover: ./images/my-project.png   # optional, relative to this file
coverAlt: Screenshot of the dashboard
links:
  repo: https://github.com/you/my-project
  live: https://my-project.dev
featured: true                   # show on the home page
order: 1                         # lower = earlier
---

## The problem
...
```

## Project structure

```
src/
  components/   Nav, Hero, ProjectCard/Grid, ContactForm, SocialLinks, Footer
  content/      MDX case studies
  data/         site + resume data
  layouts/      BaseLayout (head/meta, nav, footer, view transitions)
  lib/          collection helpers
  pages/        /, /work, /work/[slug], /resume, /contact, 404, robots.txt
  styles/       design tokens + global styles
```
