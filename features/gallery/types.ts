export type CollectionId = "design" | "websites" | "tools" | "logos";

/** Dimensions of the served asset, supplied by the CMS/API before media loads. */
export type MediaDimensions = { width: number; height: number };

export type GalleryMedia = MediaDimensions & {
  src: string;
  alt: string;
} & ({ type: "image" } | { type: "video"; poster?: string });

export type Author = {
  id: string;
  name: string;
  handle: string;
  avatar?: { alt: string; src: string };
  website?: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  section: CollectionId;
  order: number;
};

export type GalleryPost = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  section: CollectionId;
  categoryIds: string[];
  author: Author;
  media: GalleryMedia;
  source: { label?: string; url: string };
  status: "draft" | "published";
  publishedAt?: string;
};

export type GalleryPage = {
  items: GalleryPost[];
  nextCursor: string | null;
};
