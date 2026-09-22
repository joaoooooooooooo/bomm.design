import type { Category, CollectionId } from "./types";

// Matches studio-bom.design/schemaTypes/options.ts. Keep empty categories visible.
const categoryNames = {
  design: ["Branding", "Motion", "Logos", "Illustration", "3d", "Print", "Product", "Objects", "Interface"],
  websites: ["Portfolio", "Agency", "SaaS", "Blog", "E-Commerce", "Artificial Intelligence", "Art and Design"],
  tools: [
    "Web Design tools", "Mockups", "UI Components", "Design Tools", "Design Courses",
    "Icons and Illustrations", "Fonts and typography", "Books", "Inspiration", "Dev Tools",
    "Design System", "Productivity", "Motion", "Blogs", "Community",
  ],
};

export function categoriesForCollection(section: CollectionId): Category[] {
  if (section === "logos") return [];
  return categoryNames[section].map((name, order) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return { id: `${section}-${slug}`, name, slug, section, order };
  });
}
