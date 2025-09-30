import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type PostMeta = { slug:string; title:string; date:string; categories:string[]; excerpt:string; };

const POSTS_PATH = path.join(process.cwd(), "content", "posts");

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(POSTS_PATH)) return [];
  const files = fs.readdirSync(POSTS_PATH).filter(f=>f.endsWith(".mdx"));
  return files.map((filename): PostMeta => {
    const raw = fs.readFileSync(path.join(POSTS_PATH, filename), "utf8");
    const { data } = matter(raw);
    const meta = data as Partial<PostMeta> & Record<string, unknown>;
    return {
      slug: typeof meta.slug === "string" ? meta.slug : filename.replace(/\.mdx$/, ""),
      title: String(meta.title || "Untitled"),
      date: String(meta.date || new Date().toISOString()),
      categories: Array.isArray(meta.categories) ? (meta.categories as string[]) : [],
      excerpt: typeof meta.excerpt === "string" ? meta.excerpt : "",
    };
  }).sort((a,b)=> parseDateToUtcMs(b.date) - parseDateToUtcMs(a.date));
}

// Treat YYYY-MM-DD as a date-only value in UTC to avoid timezone rollbacks
function parseDateToUtcMs(dateStr: string): number {
  const m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(dateStr);
  if (m) {
    const year = Number(m[1]);
    const monthIndex = Number(m[2]) - 1; // 0-based
    const day = Number(m[3]);
    return Date.UTC(year, monthIndex, day, 0, 0, 0, 0);
  }
  const t = Date.parse(dateStr);
  return Number.isNaN(t) ? 0 : t;
}


