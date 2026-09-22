import "server-only";

import { sanityClient } from "@/lib/sanity/client";
import { categoriesForCollection } from "./categories";
import { GALLERY_QUERY } from "./sanity-query";
import { mapSanityGalleryItem, type SanityGalleryItem } from "./sanity-mapping";
import type { GalleryPage, CollectionId } from "./types";

async function fetchItems(params: {
  collection: string | null; category: string | null; cursor: string | null; id: string | null;
}) {
  return sanityClient.fetch(
    GALLERY_QUERY, params, { cache: "no-store" },
  );
}

function mapItem(item: SanityGalleryItem) {
  const { projectId, dataset } = sanityClient.config();
  return mapSanityGalleryItem(item, { projectId: projectId!, dataset: dataset! });
}

export async function getCategories(section: CollectionId) {
  return categoriesForCollection(section);
}

export async function getGalleryPosts({ section, category, cursor, limit = 12 }: {
  section: CollectionId; category?: string; cursor?: string; limit?: number;
}): Promise<GalleryPage> {
  if (section === "logos") return { items: [], nextCursor: null };
  if (category && !categoriesForCollection(section).some((entry) => entry.slug === category)) {
    return { items: [], nextCursor: null };
  }
  const pageSize = Number.isFinite(limit) ? Math.max(1, Math.min(48, Math.floor(limit))) : 12;
  const result = await fetchItems({
    collection: section, category: category ? `${section}/${category}` : null,
    cursor: cursor ?? null, id: null,
  });
  if (!result.cursorExists) return { items: [], nextCursor: null };
  const items = result.items.slice(0, pageSize).map(mapItem);
  return { items, nextCursor: result.items.length > pageSize ? items.at(-1)!.id : null };
}

export async function getGalleryPost(slug: string) {
  const result = await fetchItems({ collection: null, category: null, cursor: null, id: slug });
  return result.items[0] ? mapItem(result.items[0]) : null;
}

