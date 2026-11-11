import LinkArrow from "@/components/LinkArrow";
import Image from "next/image";
import Link from "next/link";
import { ALBUMS } from "@/data/albums";
import { assetPath } from "@/lib/assets";

export default function Frames() {
  return (
    <div className="container inner-page frames-page">
      <div className="page-heading">
        <div className="eyebrow">A SPACE FOR PHOTOGRAPHS</div>
        <h1 className="page-title">Frames<span className="text-[var(--accent)]">.</span></h1>
        <p className="page-description">Places, passing light, and a few things I stopped to notice.</p>
      </div>
      <div className="album-shelf">
        {ALBUMS.map((album, index) => {
          const cover = album.photos[album.cover];
          return (
            <Link key={album.slug} href={`/frames/${album.slug}`} className="album-cover">
              <div className="album-print">
                <div className="album-print-image"><Image src={assetPath(cover.src)} alt={cover.alt} width={cover.width} height={cover.height} sizes="(max-width: 590px) 90vw, 45vw" priority={index === 0} /></div>
                <div className="print-caption"><span>FIELD NOTES / {String(index + 1).padStart(2, "0")}</span><span>{album.year}</span></div>
              </div>
              <div className="album-cover-heading"><h2>{album.title}</h2><span aria-hidden="true"><LinkArrow /></span></div>
              <p>{album.note}</p>
              <span className="album-count">{album.photos.length} FRAMES · OPEN ALBUM</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
