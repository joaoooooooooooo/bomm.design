import "server-only";
import { createClient } from "next-sanity";

// Public identifiers for this gallery, not credentials. Keep deployments usable
// without the ignored local environment file; allow other datasets to override.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "abg9wgq6";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";

/** Public, published content only. No credentials are sent to Sanity. */
export const sanityClient = createClient({
  projectId, dataset, apiVersion: "2026-09-07",
  perspective: "published", useCdn: false, stega: false,
});
