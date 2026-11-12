import LinkArrow from "@/components/LinkArrow";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALBUMS } from "@/data/albums";
import PhotoAlbum from "@/components/PhotoAlbum";

export function generateStaticParams() {
  return ALBUMS.map(album => ({ album: album.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ album: string }> }) {
  const { album: slug } = await params;
  const album = ALBUMS.find(a => a.slug === slug);
  return { title: album ? `${album.title} — Frames · Zubair Atha` : "Album not found" };
}

export default async function AlbumPage({ params }: { params: Promise<{ album: string }> }) {
  const { album: slug } = await params;
  const album = ALBUMS.find(a => a.slug === slug);
  if (!album) notFound();
  return (
    <div className="container inner-page album-page">
      <Link href="/frames" className="album-back">← ALL ALBUMS</Link>
      <div className="album-page-heading">
        <div><div className="eyebrow">FRAMES / {album.year}</div><h1 className="page-title">{album.title}<span className="text-[var(--accent)]">.</span></h1><p className="page-description">{album.note}</p></div>
        <span className="album-count">{album.photos.length} FRAMES</span>
      </div>
      <PhotoAlbum album={album} />
      <div className="album-end"><span className="eyebrow">END OF THE ROLL</span><Link className="text-link" href="/frames">Back to albums{"\u00a0"}<LinkArrow /></Link></div>
    </div>
  );
}
