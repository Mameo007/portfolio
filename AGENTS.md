# Agent guide

Read this before making any change. It is the single source of truth for how work is done in this repo (`CLAUDE.md` is a symlink to this file; edit `AGENTS.md`, never replace the symlink).

## Git workflow

- **Never commit to `main`.** Every change, however small, goes on its own branch and lands through a pull request. If you find uncommitted edits on `main`, move them to a new branch (`git switch -c <branch>` carries them over) before committing.
- **One concern per branch/PR.** Don't bundle unrelated changes.
- **Don't merge.** Open the PR and stop; the owner reviews and merges it manually.
- PRs are merged with a merge commit (not squash), so keep the branch history clean: usually a single commit.

### Branch names

`<type>/<short-kebab-description>`, 1–3 words after the slash, e.g. `feat/contact`, `chore/seo`, `docs/readme`, `fix/nav-overlap`.

| Type | Use for |
| --- | --- |
| `feat` | New page, section, component or user-visible capability |
| `fix` | Something broken or wrong |
| `chore` | Config, tooling, dependencies, SEO/meta, content/data value updates |
| `docs` | README, AGENTS.md, code comments only |
| `refactor` | Restructuring with no behavior change |
| `style` | Visual/CSS-only tweaks |

### Commit messages

[Conventional Commits](https://www.conventionalcommits.org), using the same type as the branch:

```
feat: add contact page with Formspree form

Validated form (name, email, company, message) that posts to Formspree
via fetch with sending/success/error states and a honeypot.
```

- Subject: lowercase after the type, imperative mood ("add", not "added"), no trailing period, ≤ 72 chars.
- Body (optional for trivial changes): what changed and why, wrapped at ~72 chars.

### Pull requests

- Title: short plain-English summary without the type prefix, sentence case, e.g. `Contact page with Formspree form`.
- Body: `## What` (one sentence), `## Why` (brief context), `## Changes` (bullets, grouped; note deleted/renamed files). Mention anything the reviewer should check by hand (pages to look at, placeholders still to fill in).

## Before opening a PR

There are no tests or linters; the checks are:

1. `npm run build` succeeds with no errors or new warnings.
2. Look at the affected pages in the dev server (`astro dev --background`), in light and dark mode and at mobile width.
3. If you changed something animated, check that it still behaves under `prefers-reduced-motion`.

## Code conventions

Match the surrounding code. In particular:

- **Formatting:** 2-space indent, single quotes, semicolons, trailing commas in multi-line literals. No formatter is configured, so follow existing files by eye.
- **TypeScript:** strict mode (`astro/tsconfigs/strict`). Type component props with an `interface Props`. Use `as const` for static data.
- **Comments:** sparse. `/** JSDoc */` on exported functions and non-obvious props; otherwise only explain *why*.
- **Imports:** relative paths (`../data/site`), no path aliases.
- **Styling:** Tailwind utility classes in markup. Colors, fonts and motion live as design tokens in `src/styles/global.css`, so use tokens (e.g. `text-accent`) rather than raw hex values.
- **Accessibility:** external links get `target="_blank" rel="noopener noreferrer"` and an `sr-only` "(opens in a new tab)"; decorative glyphs get `aria-hidden="true"`; all motion respects `prefers-reduced-motion`.
- **Client JS:** keep it near zero. Prefer static Astro components; add a script only when interaction requires it.
- **Dependencies:** don't add one without a clear need; mention any new dependency in the PR.

## Where things live

| What | Where |
| --- | --- |
| Name, tagline, email, socials, Formspree ID | `src/data/site.ts` |
| Resume entries | `src/data/resume.ts` |
| Projects / case studies | `src/content/projects/*.mdx` (schema in `src/content.config.ts`) |
| Design tokens | `src/styles/global.css` |
| Shared helpers | `src/lib/` |
| OG image generator | `scripts/generate-og.mjs` (`npm run og`) |

Placeholders still to be filled in are marked `// TODO`. Remove the marker once the real value is in.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
