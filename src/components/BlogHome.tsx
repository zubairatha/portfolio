"use client";
import LinkArrow from "@/components/LinkArrow";
import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import type { PostMeta } from "@/lib/posts";
export default function BlogHome({ posts }: {
    posts: PostMeta[];
}) { const [query, setQuery] = useState(""); const q = query.trim().toLowerCase(); const filtered = posts.filter(p => [p.title, p.excerpt, ...p.categories].join(" ").toLowerCase().includes(q)); return <div className="container inner-page"><div className="page-heading"><div className="eyebrow">NOTES & OBSERVATIONS</div><h1 className="page-title">Writing<span className="text-[var(--accent)]">.</span></h1></div><div className="writing-tools"><label className="search-wrap"><span className="sr-only">Search writing</span><Search aria-hidden="true"/><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search notes, ideas, and articles…"/></label><span className="post-count" role="status">{filtered.length} {filtered.length === 1 ? "ENTRY" : "ENTRIES"}</span></div><div className="posts">{filtered.map(p => <article className="post" key={p.slug}><time className="post-date" dateTime={p.date}>{formatUtcDate(p.date)}</time><Link className="post-link" href={`/blog/${p.slug}`}><h2 className="post-title">{p.title}</h2><p className="post-intro">{p.excerpt}</p></Link><span className="post-next" aria-hidden="true"><LinkArrow /></span></article>)}{!filtered.length && <p className="frames-note">No notes found. Try another search.</p>}</div></div>; }
function formatUtcDate(dateStr: string): string {
    const m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(dateStr);
    if (m) {
        const year = Number(m[1]);
        const monthIndex = Number(m[2]) - 1;
        const day = Number(m[3]);
        const date = new Date(Date.UTC(year, monthIndex, day));
        // Use explicit locale to ensure consistent formatting between server and client
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            timeZone: "UTC"
        });
    }
    const d = new Date(dateStr);
    return isNaN(+d) ? dateStr : d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        timeZone: "UTC"
    });
}
