"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const nav = [["/", "home"], ["/work", "work"], ["/blog", "writing"], ["/frames", "frames"]];
export default function SiteHeader() { const path = usePathname(); return <header className="site-header"><div className="container"><Link href="/" className="logo" aria-label="Home — Zubair Atha, Field Notes"><span className="name">zubair.</span><span className="slash">/</span><span className="field">field notes</span></Link><nav aria-label="Main navigation" className="primary-nav">{nav.map(([href, label]) => { const active = href === "/" ? path === "/" : path.startsWith(href) || href === "/work" && ["/experience", "/projects"].includes(path); return <Link key={href} href={href} className={`nav-link ${active ? "active" : ""}`} aria-current={active ? "page" : undefined}>{label}</Link>; })}</nav></div></header>; }
