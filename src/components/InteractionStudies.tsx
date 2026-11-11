"use client";

import { useEffect, useRef, useState } from "react";
import { assetPath } from "@/lib/assets";
import { createLens, createMagnetic, createInterference, type StudyKind, type StudyRenderer } from "@/lib/interactionStudies";

const STUDIES: { kind: StudyKind; title: string; description: string }[] = [
  { kind: "lens", title: "Pixel lens", description: "Brush through the mosaic to bring the canyon into focus." },
  { kind: "magnetic", title: "Magnetic tiles", description: "Pull the grid into a swirl, then watch it find its shape again." },
  { kind: "interference", title: "Pixel interference", description: "Send ripples through a woven field of pixels." },
];

function StudyCanvas({ kind, title }: { kind: StudyKind; title: string }) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState(kind === "lens" ? "loading" : "ready");

  useEffect(() => {
    const surface = surfaceRef.current;
    const canvas = canvasRef.current;
    if (!surface || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const controller = new AbortController();
    const options = { signal: controller.signal };
    let render: StudyRenderer | undefined;
    let photograph: HTMLImageElement | undefined;
    let imageStarted = false;
    let frame = 0;
    let lastTime = 0;
    let width = 0;
    let height = 0;
    let visible = false;
    const pointer = { x: 0, y: 0, active: false };

    function draw(time: number) {
      frame = 0;
      if (!visible || document.hidden || !render) { lastTime = 0; return; }
      const elapsed = lastTime ? Math.min(48, Math.max(1, time - lastTime)) : 16;
      lastTime = time;
      if (render(elapsed, pointer, motion.matches)) frame = requestAnimationFrame(draw);
      else lastTime = 0;
    }
    function requestDraw() {
      if (!frame) frame = requestAnimationFrame(draw);
    }
    function resize() {
      const rect = surface!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      context!.setTransform(dpr, 0, 0, dpr, 0, 0);
      render = kind === "magnetic" ? createMagnetic(context!, width, height)
        : kind === "interference" ? createInterference(context!, width, height)
        : photograph?.complete && photograph.naturalWidth ? createLens(context!, width, height, photograph) : undefined;
      requestDraw();
    }
    function loadPhotograph() {
      if (kind !== "lens" || imageStarted) return;
      imageStarted = true;
      photograph = new window.Image();
      photograph.onload = () => { setStatus("ready"); resize(); };
      photograph.onerror = () => setStatus("error");
      photograph.src = assetPath("/photos/grand-canyon-2026/21.jpg");
    }
    function point(event: PointerEvent) {
      const rect = surface!.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
      requestDraw();
    }
    function leave() { pointer.active = false; requestDraw(); }

    surface.addEventListener("pointermove", point, options);
    surface.addEventListener("pointerdown", point, options);
    surface.addEventListener("pointerleave", leave, options);
    surface.addEventListener("pointercancel", leave, options);
    surface.addEventListener("pointerup", event => { if (event.pointerType !== "mouse") leave(); }, options);
    surface.addEventListener("focus", () => {
      pointer.x = width / 2; pointer.y = height / 2; pointer.active = true; requestDraw();
    }, options);
    surface.addEventListener("blur", leave, options);
    surface.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      pointer.x = Math.max(0, Math.min(width, pointer.x + (event.key === "ArrowRight" ? 35 : event.key === "ArrowLeft" ? -35 : 0)));
      pointer.y = Math.max(0, Math.min(height, pointer.y + (event.key === "ArrowDown" ? 35 : event.key === "ArrowUp" ? -35 : 0)));
      pointer.active = true;
      requestDraw();
    }, options);
    motion.addEventListener("change", resize, options);
    document.addEventListener("visibilitychange", requestDraw, options);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(surface);
    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) { loadPhotograph(); requestDraw(); }
    });
    intersection.observe(surface);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      controller.abort();
      resizeObserver.disconnect();
      intersection.disconnect();
      if (photograph) { photograph.onload = null; photograph.onerror = null; }
    };
  }, [kind]);

  return (
    <div ref={surfaceRef} className={`study-surface study-${kind}`} tabIndex={0} role="img" aria-label={`${title}. Move your pointer, drag with a finger, or use arrow keys to interact.`}>
      <canvas ref={canvasRef} aria-hidden="true" />
      {status !== "ready" && <span className="study-status" role="status">{status === "loading" ? "Loading photograph…" : "Photograph couldn’t load. Reload to try again."}</span>}
    </div>
  );
}

export default function InteractionStudies() {
  return (
    <section className="interaction-studies" aria-labelledby="studies-title">
      <div className="studies-heading"><span className="eyebrow">THREE DIRECTIONS</span><h2 id="studies-title">A little room to play.</h2><p>Move through each canvas to try it.</p></div>
      {STUDIES.map((study, index) => (
        <figure className="interaction-study" key={study.kind}>
          <figcaption><div><span className="study-number">0{index + 1}</span><h3>{study.title}</h3></div><p>{study.description}</p></figcaption>
          <StudyCanvas kind={study.kind} title={study.title} />
        </figure>
      ))}
    </section>
  );
}
