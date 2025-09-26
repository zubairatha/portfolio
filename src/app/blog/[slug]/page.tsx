import fs from "fs"; import path from "path"; import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc"; import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";
import MDXPre from "@/components/MDXCode";

const POSTS_PATH = path.join(process.cwd(), "content", "posts");

type StaticParam = { slug: string };

export async function generateStaticParams(): Promise<StaticParam[]>{
  if (!fs.existsSync(POSTS_PATH)) return [];
  return fs.readdirSync(POSTS_PATH).filter(f=>f.endsWith(".mdx")).map(f=>({ slug: f.replace(/\.mdx$/, "") }));
}

export default async function BlogPost({ params }:{ params: Promise<{ slug:string }> }){
  const { slug } = await params;
  const full = path.join(POSTS_PATH, `${slug}.mdx`);
  if (!fs.existsSync(full)) return notFound();
  const { content, data } = matter(fs.readFileSync(full, "utf8"));
  const frontmatter = data as { title: string; date: string };
  const components = { pre: MDXPre } as any;
  const startsWithH1 = /^\s*#\s+/m.test(content);
  return (
    <article className="prose lg:prose-lg max-w-3xl mx-auto px-4 py-10">
      {!startsWithH1 && <h1 className="mb-1">{frontmatter.title}</h1>}
      <p className="text-sm text-neutral-500 mt-0">{new Date(frontmatter.date).toDateString()}</p>
      <MDXRemote source={content} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
    </article>
  );
}


