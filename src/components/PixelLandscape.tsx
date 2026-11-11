"use client";

import { useEffect, useRef } from "react";
import { createLandscape, type LandscapePixel } from "@/lib/pixelLandscape";

type Pixel = LandscapePixel & { lift: number; reveal: number };

export default function PixelLandscape() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    const canvas = canvasRef.current;
    if (!field || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const controller = new AbortController();
    const options = { signal: controller.signal };
    let pixels: Pixel[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    const pointer = { x: -1000, y: 0, active: false };

    function draw() {
      frame = 0;
      if (!visible || document.hidden) return;
      context!.clearRect(0, 0, width, height);
      let settling = false;
      for (const pixel of pixels) {
        const distance = Math.hypot(pixel.x - pointer.x, (pixel.y - pointer.y) * .5);
        const near = pointer.active && !motion.matches ? Math.max(0, 1 - distance / 115) ** 2 : 0;
        const lift = near * (pixel.detail ? 9 : 6);
        pixel.lift += (lift - pixel.lift) * .12;
        pixel.reveal += (near - pixel.reveal) * .12;
        if (Math.abs(lift - pixel.lift) > .02 || Math.abs(near - pixel.reveal) > .002) settling = true;
        const alpha = pixel.alpha + pixel.reveal * (pixel.detail ? .62 : .34);
        context!.fillStyle = `rgba(${pixel.color},${alpha})`;
        context!.fillRect(pixel.x, Math.round(pixel.y - pixel.lift), 4, 4);
      }
      // No idle animation: stop as soon as the landscape reaches its resting state.
      if (settling && !motion.matches) frame = requestAnimationFrame(draw);
    }

    function requestDraw() {
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function resize() {
      const rect = field!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      context!.setTransform(dpr, 0, 0, dpr, 0, 0);
      pixels = createLandscape(width, height).map(pixel => ({ ...pixel, lift: 0, reveal: 0 }));
      requestDraw();
    }

    function leave() {
      pointer.active = false;
      requestDraw();
    }

    field.addEventListener("pointermove", event => {
      const rect = field.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
      requestDraw();
    }, options);
    field.addEventListener("pointerleave", leave, options);
    field.addEventListener("pointerup", event => { if (event.pointerType !== "mouse") leave(); }, options);
    field.addEventListener("pointercancel", leave, options);
    field.addEventListener("focus", () => {
      pointer.x = width / 2;
      pointer.y = height / 2;
      pointer.active = true;
      requestDraw();
    }, options);
    field.addEventListener("blur", leave, options);
    field.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      pointer.x = event.key === "Home" ? 0 : event.key === "End" ? width : Math.max(0, Math.min(width, pointer.x + (event.key === "ArrowRight" ? 60 : -60)));
      pointer.active = true;
      requestDraw();
    }, options);
    document.addEventListener("visibilitychange", requestDraw, options);
    motion.addEventListener("change", () => {
      pixels.forEach(pixel => { pixel.lift = 0; pixel.reveal = 0; });
      requestDraw();
    }, options);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(field);
    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) requestDraw();
    });
    intersection.observe(field);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      controller.abort();
      resizeObserver.disconnect();
      intersection.disconnect();
    };
  }, []);

  return (
    <div ref={fieldRef} className="pixel-landscape" tabIndex={0} role="img" aria-label="A pixel landscape of canyon ridges, trees, and city rooftops. Move your pointer or use the left and right arrow keys to reveal details.">
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}
