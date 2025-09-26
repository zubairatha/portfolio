import BlogHome from "@/components/BlogHome";
import { getAllPosts, PostMeta } from "@/lib/posts";

export default function BlogIndex(){
  const posts: PostMeta[] = getAllPosts();
  return <BlogHome posts={posts} />;
}


