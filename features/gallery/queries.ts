import "server-only";

import { galleryPosts, galleryCategories } from "./mock-data";
import type { GalleryPage, SectionId } from "./types";

// Replace these reads with CMS queries and map responses to the types in types.ts.
export async function getCategories(section: SectionId) {
  return galleryCategories.filter((category) => category.section === section);
}

export async function getGalleryPosts({
  section,
  category,
  cursor,
  limit = 12,
}: {
  section: SectionId;
  category?: string;
  cursor?: string;
  limit?: number;
}): Promise<GalleryPage> {
  const posts = galleryPosts.filter((post) =>
    post.status === "published" && post.section === section &&
    (!category || post.categoryIds.includes(`${section}-${category}`)),
  );
  const cursorIndex = cursor ? posts.findIndex((post) => post.id === cursor) : -1;
  if (cursor && cursorIndex === -1) return { items: [], nextCursor: null };
  const start = cursorIndex + 1;
  const pageSize = Number.isFinite(limit) ? Math.max(1, Math.min(48, Math.floor(limit))) : 12;
  const items = posts.slice(start, start + pageSize);
  return {
    items,
    nextCursor: start + items.length < posts.length ? items.at(-1)!.id : null,
  };
}

export async function getGalleryPost(slug: string) {
  return galleryPosts.find((post) => post.slug === slug && post.status === "published") ?? null;
}
