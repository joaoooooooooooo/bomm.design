import type { Category, GalleryPost, SectionId } from "./types";

const gallerySource = [
  {
    title: "Soft geometry",
    category: "Architecture",
    media: {
      alt: "Soft geometry",
      src: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=720&q=80",
      type: "image",
      height: 480,
      width: 720,
    },
    author: { handle: "studioform" },
    source: { label: "View post", url: "https://unsplash.com" },
  },
  {
    title: "Open horizon",
    category: "Landscape",
    media: {
      alt: "Open horizon",
      src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=720&q=80",
      type: "image",
      height: 1080,
      width: 720,
    },
    author: { handle: "openfield" },
    source: { label: "View post", url: "https://unsplash.com" },
  },
  {
    title: "Working rhythm",
    category: "Workspace",
    media: {
      alt: "Working rhythm",
      src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=720&q=80",
      type: "image",
      height: 481,
      width: 720,
    },
    author: { handle: "workplace" },
    source: { label: "View post", url: "https://unsplash.com" },
  },
  {
    title: "Shared table",
    category: "Studio",
    media: {
      alt: "Shared table",
      src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=720&q=80",
      type: "image",
      height: 480,
      width: 720,
    },
    author: { handle: "tabletalk" },
    source: { label: "View post", url: "https://unsplash.com" },
  },
  {
    title: "In session",
    category: "People",
    media: {
      alt: "In session",
      src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=720&q=80",
      type: "image",
      height: 1079,
      width: 720,
    },
    author: { handle: "peopleandco" },
    source: { label: "View post", url: "https://unsplash.com" },
  },
  {
    title: "After hours",
    category: "Office",
    media: {
      alt: "After hours",
      src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=720&q=80",
      type: "image",
      height: 480,
      width: 720,
    },
    author: { handle: "afterhours" },
    source: { label: "View post", url: "https://unsplash.com" },
  },
  {
    title: "ChatGPT solved marketing",
    category: "AI",
    media: {
      alt: "Higgsfield video about ChatGPT solving marketing",
      src: "https://posts.design/media/posts/x-twitter-higgsfield-2094463266210902369-higgsfield-ai-chatgpt-solved-marketing.mp4",
      type: "video",
      height: 720,
      width: 1280,
    },
    author: { handle: "higgsfield_ai" },
    source: { label: "View post", url: "https://posts.design" },
  },
  {
    title: "Webflow Conf 26",
    category: "Design",
    media: {
      alt: "Webflow Conf 26 announcement video",
      src: "https://posts.design/media/posts/x-twitter-webflow-2094538321611395240-webflow-conf-26-kicks-off-wednesday.mp4",
      type: "video",
      height: 900,
      width: 720,
    },
    author: { handle: "webflow" },
    source: { label: "View post", url: "https://posts.design" },
  },
  {
    title: "Nothing OS 5",
    category: "Technology",
    media: {
      alt: "Nothing OS 5 video announcement",
      src: "https://posts.design/media/posts/x-twitter-nothing-2093624711850721534-nothing-os-5-brings-two-clock.mp4",
      type: "video",
      height: 720,
      width: 1280,
    },
    author: { handle: "nothing" },
    source: { label: "View post", url: "https://posts.design" },
  },
  {
    title: "Flora creative brief",
    category: "Creative tools",
    media: {
      alt: "Flora AI creative brief video",
      src: "https://posts.design/media/posts/x-twitter-floraai-2094457833978732851-flora-newest-creative-brief-5-000.mp4",
      type: "video",
      height: 720,
      width: 1280,
    },
    author: { handle: "floraai" },
    source: { label: "View post", url: "https://posts.design" },
  },
  {
    title: "Morpho half billion",
    category: "Finance",
    media: {
      alt: "Morpho half billion video",
      src: "https://posts.design/media/posts/x-twitter-morpho-2095511647481999483-morpho-half-billion.mp4",
      type: "video",
      height: 1080,
      width: 1080,
    },
    author: { handle: "morpho" },
    source: { label: "View post", url: "https://posts.design" },
  },
  {
    title: "Claude and Fable 5.1",
    category: "AI",
    media: {
      alt: "Higgsfield video about Claude and Fable 5.1",
      src: "https://posts.design/media/posts/x-twitter-higgsfield-2095484820474486832-higgsfield-ai-claude-fable-5-1.mp4",
      type: "video",
      height: 720,
      width: 1280,
    },
    author: { handle: "higgsfield_ai" },
    source: { label: "View post", url: "https://posts.design" },
  },
  {
    title: "Aave app early access",
    category: "Finance",
    media: {
      alt: "Aave app early access video",
      src: "https://posts.design/media/posts/x-twitter-aave-2095183378848923902-early-access-aave-app-underway.mp4",
      type: "video",
      height: 1280,
      width: 720,
    },
    author: { handle: "aave" },
    source: { label: "View post", url: "https://posts.design" },
  },
  {
    title: "Tag Lovable in Slack",
    category: "Creative tools",
    media: {
      alt: "Lovable Slack integration video",
      src: "https://posts.design/media/posts/x-twitter-lovable-2095180014257930633-tag-lovable-slack.mp4",
      type: "video",
      height: 720,
      width: 1280,
    },
    author: { handle: "lovable" },
    source: { label: "View post", url: "https://posts.design" },
  },
  {
    title: "Granola in 32 languages",
    category: "Productivity",
    media: {
      alt: "Granola language support video",
      src: "https://posts.design/media/posts/x-twitter-meetgranola-2095177566739194179-granola-supports-32-languages.mp4",
      type: "video",
      height: 720,
      width: 1280,
    },
    author: { handle: "meetgranola" },
    source: { label: "View post", url: "https://posts.design" },
  },
  {
    title: "Agent design in 3D",
    category: "Design",
    media: {
      alt: "Framer agent design in 3D video",
      src: "https://posts.design/media/posts/x-twitter-framer-2095161979925348811-taught-framers-agent-design-3d.mp4",
      type: "video",
      height: 720,
      width: 1076,
    },
    author: { handle: "framer" },
    source: { label: "View post", url: "https://posts.design" },
  },
  {
    title: "360 imaging for everyone",
    category: "Technology",
    media: {
      alt: "DJI 360 imaging video",
      src: "https://posts.design/media/posts/x-twitter-djiglobal-2095105029136904374-dji-360-imaging-everyone.mp4",
      type: "video",
      height: 720,
      width: 1280,
    },
    author: { handle: "djiglobal" },
    source: { label: "View post", url: "https://posts.design" },
  },
  {
    title: "Axel is hiring a brand designer",
    category: "Careers",
    media: {
      alt: "Axel hiring a brand designer",
      src: "https://posts.design/images/posts/responsive/x-twitter-vistcreates-2095045063370014860-axel-hiring-brand-designer-thestudioth-thumb-w768-2646bc527d3b.avif",
      type: "image",
      height: 768,
      width: 768,
    },
    author: { handle: "vistcreates" },
    source: { label: "View post", url: "https://posts.design" },
  },
] as const;

// Temporary demo groupings. Each section uses a different set of source media.
const sectionSources: Record<SectionId, readonly number[]> = {
  design: [0, 1, 2, 3, 4, 5, 7, 17],
  websites: [10, 12, 15],
  tools: [6, 8, 9, 11, 13, 14, 16],
};

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const designCategories = ["Branding", "Motion", "Logos", "Illustration", "3d", "Print", "Product", "Objects"];

export const galleryCategories: Category[] = Object.entries(sectionSources).flatMap(([section, indices]) =>
  (section === "design" ? designCategories : [...new Set(indices.map((index) => gallerySource[index].category))]).map((name, order) => ({
    id: `${section}-${slugify(name)}`,
    name,
    slug: slugify(name),
    section: section as SectionId,
    order,
  })),
);

// Repeat demo entries to exercise pagination without coupling the UI to fixtures.
export const galleryPosts: GalleryPost[] = Object.entries(sectionSources).flatMap(([section, indices]) =>
  Array.from({ length: indices.length * 3 }, (_, index) => {
    const source = gallerySource[indices[index % indices.length]];
    const id = `${section}-${slugify(source.title)}-${Math.floor(index / indices.length) + 1}`;
    return {
      id,
      slug: id,
      title: source.title,
      section: section as SectionId,
      categoryIds: [`${section}-${slugify(section === "design" ? designCategories[index % designCategories.length] : source.category)}`],
      author: { ...source.author, id: source.author.handle, name: source.author.handle },
      source: source.source,
      media: source.media,
      status: "published",
    };
  }),
);
