<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Component Development Rules

## Source of truth

- This project uses COSS UI. The existing codebase, especially the UI primitives, is the source of truth.
- Figma is used to pair and calibrate tokens against production. Treat it as a visual reference, not as the authority over the implemented system.
- Follow the naming conventions, file structure, composition patterns, and implementation style established in the UI primitives. These primitives were intentionally designed and maintained by humans.

## UI primitives

- Never modify files in `components/ui` when creating or changing non-primitive components.
- Build product- or feature-level components by composing the existing primitives.

## Component API and behavior

- Ask the user for the intended file location before creating a new component or file, unless they have already provided it.
- Keep component APIs intentionally small. Add props only when there is a concrete, demonstrated need; avoid speculative configuration and variants.
- Do not add animations, transitions, or interactive behavior unless the user explicitly requests them.

## Figma implementation

- When implementing a Figma design, use the project's existing design tokens for sizing, spacing, colors, typography, radii, shadows, and other visual values.
- Do not introduce one-off visual values when an appropriate existing token or primitive pattern is available.
