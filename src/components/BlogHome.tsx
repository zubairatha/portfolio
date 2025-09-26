"use client";
import React, { useMemo, useState } from "react";
import { Search, Github, Linkedin, ChevronRight, Calendar, Tag } from "lucide-react";

type Post = { slug:string; title:string; date:string; categories:string[]; excerpt:string; featured?:boolean; };

const SITE = {
  title: "My Portfolio",
  author: "Zubair Atha",
  tagline: "Projects, writing, and notes on AI",
  links: { github: "https://github.com/zubairatha", linkedin: "https://www.linkedin.com/in/zubair-atha/", rss: "#" },
};

const TagPill = ({ label }: { label: string }) => (
  <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-neutral-700">
    {label}
  </span>
);

function classNames(...xs:(string|false|null|undefined)[]){ return xs.filter(Boolean).join(" "); }

export default function BlogHome({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState(""); const [activeCat, setActiveCat] = useState("All");
  const categories = useMemo(() => {
    const map = new Map<string, number>();
    posts.forEach(p => p.categories.forEach(c => map.set(c, (map.get(c) || 0)+1)));
    return Array.from(map.entries()).sort((a,b)=>a[0].localeCompare(b[0]));
  }, [posts]);
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return posts.filter(p=>{
      const matchesQuery = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q);
      const matchesCat = activeCat==="All" || p.categories.includes(activeCat);
      return matchesQuery && matchesCat;
    });
  }, [query, activeCat, posts]);
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3">
          <section className="rounded-2xl border border-neutral-200 p-5">
            <h2 className="text-lg font-semibold">{SITE.author}</h2>
            <p className="mt-1 text-sm text-neutral-600">I write about AI agents, Large Language Models, and building real products.</p>
            <div className="mt-3 flex items-center gap-2">
              <a className="p-2 rounded-lg hover:bg-neutral-100" href={SITE.links.github}><Github size={18}/></a>
              <a className="p-2 rounded-lg hover:bg-neutral-100" href={SITE.links.linkedin}><Linkedin size={18}/></a>
            </div>
          </section>
        </aside>
        <section className="lg:col-span-6">
          <div className="mb-4 relative">
            <input value={query} onChange={(e)=>setQuery(e.target.value)} type="text" placeholder="Search work & writing"
              className="w-full rounded-2xl border border-neutral-300 pl-10 pr-3 py-2 outline-none focus:ring-2 focus:ring-neutral-300"/>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18}/>
          </div>
          <div className="space-y-5">
            {filtered.map(post=>(
              <article key={post.slug} className="rounded-2xl border border-neutral-200 p-5 hover:shadow-sm transition-shadow">
                <a href={`/blog/${post.slug}`} className="group block">
                  <h2 className="text-xl sm:text-2xl font-semibold tracking-tight group-hover:underline underline-offset-4">{post.title}</h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-neutral-500">
                    <Calendar size={16}/><time dateTime={post.date}>{new Date(post.date).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"2-digit"})}</time>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {post.categories.map(c=> (
                      <button
                        key={c}
                        onClick={(e)=>{ e.preventDefault(); setActiveCat(c); }}
                        className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-neutral-700 hover:bg-neutral-200"
                        aria-label={`Filter by ${c}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-neutral-700">{post.excerpt}</p>
                  <div className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-neutral-900">Read more <ChevronRight size={16}/></div>
                </a>
              </article>
            ))}
            {filtered.length===0 && <div className="rounded-2xl border border-neutral-200 p-8 text-center text-neutral-600">No matching items</div>}
          </div>
        </section>
        <aside className="lg:col-span-3 order-first lg:order-none">
          <section className="rounded-2xl border border-neutral-200 p-5 lg:sticky lg:top-20">
            <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-500">Topics</h3>
            <ul className="mt-3 space-y-1.5">
              <li>
                <button onClick={()=>setActiveCat("All")}
                  className={classNames("w-full flex items-center justify-between rounded-xl px-3 py-2 text-left", activeCat==="All"?"bg-neutral-900 text-white":"hover:bg-neutral-100")}>
                  <span>All</span><span className="text-xs opacity-70">{posts.length}</span>
                </button>
              </li>
              {categories.map(([name,count])=> (
                <li key={name}>
                  <button onClick={()=>setActiveCat(name)}
                    className={classNames("w-full flex items-center justify-between rounded-xl px-3 py-2 text-left", activeCat===name?"bg-neutral-900 text-white":"hover:bg-neutral-100")}>
                    <span className="inline-flex items-center gap-2"><Tag size={14}/>{name}</span>
                    <span className="text-xs opacity-70">{count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}


