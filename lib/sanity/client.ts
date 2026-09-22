import "server-only";
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
if (!projectId || !dataset) {
  throw new Error("Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env.local.");
}

/** Public, published content only. No credentials are sent to Sanity. */
export const sanityClient = createClient({
  projectId, dataset, apiVersion: "2026-09-07",
  perspective: "published", useCdn: false, stega: false,
});
