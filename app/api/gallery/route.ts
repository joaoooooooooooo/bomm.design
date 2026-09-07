import { getGalleryPosts, getCategories } from "@/features/gallery/queries";
import { isCollection } from "@/features/navigation/sections";
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const section = params.get("section") ?? "";
  const category = params.get("category") || undefined;
  const cursor = params.get("cursor") || undefined;
  const limit = Number(params.get("limit") ?? 12);
  if (!isCollection(section) || !Number.isInteger(limit) || limit < 1 || limit > 48) {
    return Response.json({ error: "Invalid gallery query" }, { status: 400 });
  }
  if (category && !(await getCategories(section)).some((item) => item.slug === category)) {
    return Response.json({ error: "Unknown category" }, { status: 400 });
  }
  return Response.json(await getGalleryPosts({ section, category, cursor, limit }));
}
