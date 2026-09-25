import { defineQuery } from "next-sanity";

// Fixed bound supports the maximum API page size plus one lookahead item.
export const GALLERY_QUERY = defineQuery(`{
  "cursorExists": $cursor == null || count(*[
    _type == "galleryItem" && _id == $cursor && collection == $collection &&
    ($category == null || $category in categories)
  ]) > 0,
  "items": *[
    _type == "galleryItem" && collection in ["design", "websites", "tools"] &&
    ($collection == null || collection == $collection) &&
    ($category == null || $category in categories) &&
    ($id == null || _id == $id) && ($cursor == null || _id > $cursor)
  ] | order(_id asc)[0...49] {
    _id, title, description, collection, categories, sourcePlatform, sourceUrl, externalPostId,
    websiteDetails {name, url, favicon, faviconUrl},
    "author": coalesce(authorDetails, author->{handle, profileUrl, profileImage}) {
      handle, profileUrl, profileImage
    },
    media {type, width, height, "videoUrl": coalesce(video.asset->url, videoUrl), image, "dimensions": image.asset->metadata.dimensions}
  }
}`);
