"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Album } from "@/data/albums";
import { assetPath } from "@/lib/assets";

export default function PhotoAlbum({ album }: { album: Album }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const photo = album.photos[index ?? 0];
  const move = (direction: number) => setIndex(current => ((current ?? 0) + direction + album.photos.length) % album.photos.length);

  function openPhoto(position: number) {
    setIndex(position);
    dialog.current?.showModal();
  }

  return (
    <>
      <div className="photo-grid">
        {album.photos.map((item, position) => (
          <button className="photo-frame" key={item.src} onClick={() => openPhoto(position)} aria-label={`Open frame ${position + 1}: ${item.alt}`} aria-haspopup="dialog">
            <span className="photo-thumbnail"><Image src={assetPath(item.thumb)} alt={item.alt} width={item.width} height={item.height} loading={position < 2 ? "eager" : "lazy"} sizes="(max-width: 590px) 90vw, 45vw" /></span>
            <span className="photo-caption"><span>{String(position + 1).padStart(2, "0")}</span><span aria-hidden="true">↗</span></span>
          </button>
        ))}
      </div>
      <dialog ref={dialog} className="photo-dialog" aria-labelledby="photo-dialog-title" onClose={() => setIndex(null)}
        onKeyDown={event => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            move(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
        onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className="photo-viewer-top"><span id="photo-dialog-title">{album.title}</span><button autoFocus onClick={() => dialog.current?.close()} aria-label="Close photo viewer">Close ✕</button></div>
        <div className="photo-viewer-image">{index !== null && <Image key={photo.src} src={assetPath(photo.src)} alt={photo.alt} width={photo.width} height={photo.height} loading="eager" sizes="95vw" />}</div>
        <div className="photo-viewer-bottom">
          <p aria-live="polite">{String((index ?? 0) + 1).padStart(2, "0")} / {album.photos.length}<span>{photo.alt}</span></p>
          <div className="photo-controls"><button onClick={() => move(-1)} aria-label="Previous photograph">←</button><button onClick={() => move(1)} aria-label="Next photograph">→</button></div>
        </div>
      </dialog>
    </>
  );
}
