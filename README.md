This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The home page redirects to `/design`. Use the sidebar to switch between `/design`, `/websites`, and `/tools`. Category links filter the current section, for example `/design?category=architecture`.

## Project organization

- `app/(gallery)/layout.tsx` mounts the shared navigation shell. The fixed sidebar and its Rive canvas stay mounted across section and category changes.
- `app/(gallery)/[section]/page.tsx` reads the URL and loads the changing header, categories, and grid. Loading and error boundaries affect this content, not the sidebar.
- `features/navigation/` contains section definitions, the shell, sidebar, header, and category links. Active navigation comes from the URL.
- `features/gallery/types.ts` defines the app's post, author, category, and media formats independently of React components or a CMS.
- `features/gallery/queries.ts` exposes server-only `getCategories`, `getGalleryPosts`, and `getGalleryPost` functions. Both the server page and `app/api/gallery/route.ts` use these functions.
- `features/gallery/mock-data.ts` contains temporary posts grouped into distinct sections. Repeated demo entries exercise pagination; their grouping is not a production content taxonomy.
- `features/gallery/components/` contains the masonry grid, cards, media previews, dialog, and carousel. The gallery cancels pending page requests when its section or category is left.
- `components/ui/` remains the shared design system.

## Connecting a CMS later

Replace mock reads in `features/gallery/queries.ts` with server-side CMS reads. Add the provider connection and response mapping under `lib/cms/` when choosing the CMS; keep the current return types so components do not depend on provider-specific fields. Credentials belong on the server.

Store stable IDs, slugs, section/category relationships, authors, publication status, source links, descriptions, and image/video dimensions with posts. Dimensions let the grid reserve space before media loads. Browser-only values such as drag state, video playback position, and captured canvas frames stay in the gallery components.

`GET /api/gallery?section=design&limit=12` returns `{ items, nextCursor }`. Pass `cursor` from the previous response and the same `section` and optional `category` to load the next page. Category slugs are scoped to their section. Invalid sections, categories, and page sizes return HTTP 400. Public reads exclude draft posts. CMS cache invalidation and draft previews can be added with the CMS integration.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
