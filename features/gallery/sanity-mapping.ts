import { createImageUrlBuilder } from "@sanity/image-url";
import type { GALLERY_QUERY_RESULT } from "./sanity.types";
import type { GalleryMedia, GalleryPost } from "./types";
import { categoriesForCollection } from "./categories";

export type SanityGalleryItem = GALLERY_QUERY_RESULT["items"][number];

function httpUrl(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : undefined;
  } catch { return undefined; }
}

export function mapSanityGalleryItem(item: SanityGalleryItem, config: { projectId: string; dataset: string }): GalleryPost {
  const section = item.collection;
  if (section !== "design" && section !== "websites" && section !== "tools") {
    throw new Error(`Gallery item ${item._id} has an invalid collection.`);
  }
  const sourceUrl = httpUrl(item.sourceUrl);
  if (!item.author?.handle || !sourceUrl) {
    throw new Error(`Gallery item ${item._id} needs an author handle and HTTP(S) source URL.`);
  }
  const title = item.title?.trim() || "";
  const mediaLabel = title || `Post by ${item.author.handle}`;
  const builder = createImageUrlBuilder(config);
  let media: GalleryMedia;
  if (item.media?.type === "image" && item.media.image && item.media.dimensions) {
    const { width, height } = item.media.dimensions;
    if (!width || !height || width <= 0 || height <= 0) throw new Error(`Gallery item ${item._id} has invalid image dimensions.`);
    const crop = item.media.image.crop;
    const croppedWidth = Math.max(1, Math.round(width * (1 - (crop?.left ?? 0) - (crop?.right ?? 0))));
    const croppedHeight = Math.max(1, Math.round(height * (1 - (crop?.top ?? 0) - (crop?.bottom ?? 0))));
    media = {
      type: "image",
      src: builder.image(item.media.image).width(Math.min(1600, croppedWidth)).fit("max").auto("format").url(),
      alt: mediaLabel, width: croppedWidth, height: croppedHeight,
    };
  } else if (item.media?.type === "video" && httpUrl(item.media.videoUrl)) {
    media = {
      type: "video", src: httpUrl(item.media.videoUrl)!, alt: mediaLabel,
      // Imported dimensions reserve the right grid height before playback loads.
      width: item.media.width && item.media.width > 0 && item.media.height && item.media.height > 0 ? item.media.width : 1280,
      height: item.media.width && item.media.width > 0 && item.media.height && item.media.height > 0 ? item.media.height : 720,
    };
  } else {
    throw new Error(`Gallery item ${item._id} needs an image asset or a playable HTTP(S) video URL.`);
  }
  const categories = categoriesForCollection(section);
  const categoryIds = [...new Set(item.categories ?? [])].map((value) => {
    const category = categories.find((entry) => `${section}/${entry.slug}` === value);
    if (!category) throw new Error(`Gallery item ${item._id} has an invalid category: ${value}.`);
    return category.id;
  });
  if (categoryIds.length < 1 || categoryIds.length > 3) {
    throw new Error(`Gallery item ${item._id} must have 1â€“3 categories.`);
  }
  return {
    id: item._id, slug: item._id, title, section, categoryIds,
    author: {
      id: `${item._id}-author`, name: item.author.handle,
      handle: item.author.handle,
      website: httpUrl(item.author.profileUrl),
      avatar: item.author.profileImage ? {
        alt: item.author.handle,
        src: builder.image(item.author.profileImage).width(96).height(96).fit("crop").auto("format").url(),
      } : undefined,
    },
    media,
    source: { url: sourceUrl, platform: item.sourcePlatform ?? undefined },
    externalPostId: item.externalPostId ?? undefined,
    status: "published",
  };
}

