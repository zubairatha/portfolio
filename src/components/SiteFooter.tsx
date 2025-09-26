import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200">
      <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="font-semibold">Zubair Atha</div>
          <p className="mt-1 text-neutral-600 max-w-sm">
            Minimal, content-first portfolio theme.
          </p>
        </div>
        <div>
          <div className="font-semibold">Navigation</div>
          <ul className="mt-2 space-y-1">
            <li><Link className="hover:underline" href="/about">About</Link></li>
            <li><Link className="hover:underline" href="/experience">Experience</Link></li>
            <li><Link className="hover:underline" href="/blog">Blog</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold">Contact</div>
          <p className="mt-2 text-neutral-600">
            <a className="hover:underline" href="mailto:zubair.atha09@gmail.com">zubair.atha09@gmail.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}


