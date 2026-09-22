This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Product context

Brasa is a browsable gallery of work and resources selected through personal, human curation. It is intended to reflect the curator's judgment and point of view rather than operate as an open directory or automatically collected feed.

The catalog has three top-level collections:

- **Design** — visual and communication design references.
- **Websites** — curated websites and digital experiences.
- **Tools** — useful products and resources for creative work.

Each collection contains its own categories, such as Branding, Motion, and Logos. Categories are the second level of organization and may evolve as the catalog grows. Logos is currently an experimental category, not a fourth top-level collection.

Use **collection**, **category**, and **item** consistently when discussing the information architecture. In the interface, a curated item may also be presented as a card or post depending on the component context.

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

The home page redirects to `/design`. Use the sidebar to switch between the Design, Websites, and Tools collections. Category links filter the current collection, for example `/design?category=architecture`.

## Project organization

- `app/(gallery)/layout.tsx` mounts the shared navigation shell. The fixed sidebar and its Rive canvas stay mounted across section and category changes.
- `app/(gallery)/[section]/page.tsx` reads the URL and loads the changing header, categories, and grid. Loading and error boundaries affect this content, not the sidebar.
- `features/navigation/` contains section definitions, the shell, sidebar, header, and category links. Active navigation comes from the URL.
- `features/gallery/types.ts` defines the app's post, author, category, and media formats independently of React components or a CMS.
- `features/gallery/queries.ts` exposes server-only `getCategories`, `getGalleryPosts`, and `getGalleryPost` functions. Both the server page and `app/api/gallery/route.ts` use these functions.
- `features/gallery/mock-data.ts` contains temporary posts grouped into distinct sections. Repeated demo entries exercise pagination; their grouping is not a production content taxonomy.
- `features/gallery/components/` contains the masonry grid, cards, media previews, dialog, and carousel. The gallery cancels pending page requests when its section or category is left.
- `components/ui/` remains the shared design system.

## Sanity gallery content

`features/gallery/queries.ts` reads published `galleryItem` documents from Sanity using the server-only client in `lib/sanity/client.ts`. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SANITY_PROJECT_ID=abg9wgq6` and `NEXT_PUBLIC_SANITY_DATASET=production`. No API token is required for this public dataset. Reads bypass the CDN and Next.js data cache so a page refresh picks up published changes.

Run `npm run dev` here and the standalone Studio in `../studio-bom.design`. Fill in the inline Author fields (profile picture, handle, profile URL) and publish a Gallery Item in Studio, then visit `/design`, `/websites`, or `/tools` according to its collection. Category links keep their existing query-string URLs. The experimental `/logos` route still uses its existing curated logo data.

Categories are fixed strings such as `design/motion`, not Category references. `features/gallery/categories.ts` preserves every name and ordering from the Studio, including empty categories; update both lists together. Authors are stored per item in authorDetails. Older author references remain readable through a query fallback. Titles are optional; untitled items hide the visual heading and retain an accessible media label. The mapper keeps source platform and external post ID.

The schema has no item slug, description, publication date, video dimensions, or video poster. Document IDs serve as existing item slugs; description/publication date remain unset. Image URLs honor Sanity crop/hotspot data and use asset dimensions. Video cards use a 16:9 fallback; the dialog reads actual video metadata. Video URLs must be playable media URLs, not social page or embed URLs, because the existing interface uses a native video element.

After schema or GROQ changes, run `npm run typegen` in `../studio-bom.design` to update `features/gallery/sanity.types.ts`. This extracts the local schema without deploying anything.

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

