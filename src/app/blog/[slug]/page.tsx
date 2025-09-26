import fs from "fs"; 
import path from "path"; 
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc"; 
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";
import MDXPre from "@/components/MDXCode";

const POSTS_PATH = path.join(process.cwd(), "content", "posts");

type StaticParam = { slug: string };


export async function generateStaticParams(): Promise<StaticParam[]>{
  console.log("=== generateStaticParams called ===");
  console.log("Current working directory:", process.cwd());
  console.log("Posts path:", POSTS_PATH);
  
  try {
    if (!fs.existsSync(POSTS_PATH)) {
      console.warn(`Posts directory not found: ${POSTS_PATH}`);
      console.log("Directory contents:", fs.readdirSync(process.cwd()));
      return [];
    }
    const files = fs.readdirSync(POSTS_PATH).filter(f => f.endsWith(".mdx"));
    console.log(`Found ${files.length} blog posts:`, files);
    const params = files.map(f => ({ slug: f.replace(/\.mdx$/, "") }));
    console.log("Generated params:", params);
    return params;
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const full = path.join(POSTS_PATH, `${slug}.mdx`);
  
  try {
    if (!fs.existsSync(full)) {
      return { title: "Post Not Found" };
    }
    
    const fileContent = fs.readFileSync(full, "utf8");
    const { data } = matter(fileContent);
    const frontmatter = data as { title: string; date: string; excerpt?: string };
    
    return {
      title: frontmatter.title,
      description: frontmatter.excerpt || `Blog post: ${frontmatter.title}`,
    };
  } catch (error) {
    console.error(`Error generating metadata for ${slug}:`, error);
    return { title: "Post Not Found" };
  }
}

export default async function BlogPost({ params }:{ params: Promise<{ slug:string }> }){
  const { slug } = await params;
  const full = path.join(POSTS_PATH, `${slug}.mdx`);
  
  try {
    if (!fs.existsSync(full)) {
      console.error(`Blog post not found: ${full}`);
      return notFound();
    }
    
    const fileContent = fs.readFileSync(full, "utf8");
    const { content, data } = matter(fileContent);
    const frontmatter = data as { title: string; date: string };
    const components = { pre: MDXPre } as Record<string, React.ComponentType>;
    const startsWithH1 = /^\s*#\s+/m.test(content);
    
    return (
      <article className="prose lg:prose-lg max-w-3xl mx-auto px-4 py-10">
        {!startsWithH1 && <h1 className="mb-1">{frontmatter.title}</h1>}
        <p className="text-sm text-neutral-500 mt-0">{new Date(frontmatter.date).toDateString()}</p>
        <MDXRemote source={content} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </article>
    );
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    return notFound();
  }
}