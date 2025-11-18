"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Linkedin, Mail, Menu, FileText } from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b border-neutral-200 sticky top-0 z-30 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/about" className="block">
          <div className="text-xl font-semibold tracking-tight">Zubair Atha</div>
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "px-3 py-1.5 rounded-xl text-sm " +
                  (active ? "bg-neutral-900 text-white" : "hover:bg-neutral-100")
                }
              >
                {item.label}
              </Link>
            );
          })}
          <div className="hidden md:flex items-center gap-2 ml-2">
            <a className="p-2 rounded-lg hover:bg-neutral-100" href="https://github.com/zubairatha" aria-label="GitHub"><Github size={18} /></a>
            <a className="p-2 rounded-lg hover:bg-neutral-100" href="https://www.linkedin.com/in/zubair-atha/" aria-label="LinkedIn"><Linkedin size={18} /></a>
            <a className="p-2 rounded-lg hover:bg-neutral-100" href="https://drive.google.com/file/d/16lp87m0BbAx4uTPcdHGCIDHEdSQtywy0/view?usp=sharing" target="_blank" rel="noopener noreferrer" aria-label="Resume"><FileText size={18} /></a>
            <a className="p-2 rounded-lg hover:bg-neutral-100" href="mailto:zubair.atha09@gmail.com" aria-label="Email"><Mail size={18} /></a>
          </div>
        </nav>
        <button className="md:hidden p-2 rounded-lg hover:bg-neutral-100" aria-label="Open menu" onClick={()=>setOpen(true)}>
          <Menu size={20} />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-3 space-y-2">
            {NAV.map((item)=>{
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link key={item.href} href={item.href} onClick={()=>setOpen(false)} className={"block px-3 py-2 rounded-xl " + (active?"bg-neutral-900 text-white":"hover:bg-neutral-100")}>{item.label}</Link>
              );
            })}
            <div className="flex items-center gap-2 pt-2">
              <a className="p-2 rounded-lg hover:bg-neutral-100" href="https://github.com/zubairatha" aria-label="GitHub"><Github size={18} /></a>
              <a className="p-2 rounded-lg hover:bg-neutral-100" href="https://www.linkedin.com/in/zubair-atha/" aria-label="LinkedIn"><Linkedin size={18} /></a>
              <a className="p-2 rounded-lg hover:bg-neutral-100" href="https://drive.google.com/file/d/16lp87m0BbAx4uTPcdHGCIDHEdSQtywy0/view?usp=sharing" target="_blank" rel="noopener noreferrer" aria-label="Resume"><FileText size={18} /></a>
              <a className="p-2 rounded-lg hover:bg-neutral-100" href="mailto:zubair.atha09@gmail.com" aria-label="Email"><Mail size={18} /></a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


