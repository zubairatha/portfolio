"use client";

import { useEffect, useRef, useState } from "react";
import { createLivingScene, type LivingScene, type SceneKind, type ScenePointer } from "@/lib/livingScenes";

const STUDIES: { kind: SceneKind; title: string; description: string; action: string }[] = [
  { kind: "pond", title: "The koi pond", description: "Move slowly to draw them closer. Click or tap to feed.", action: "feed the fish" },
  { kind: "boats", title: "The paper river", description: "Guide the current. Click or tap to send a ripple through it.", action: "make a ripple" },
];

function LivingCanvas({ kind, title, action, paused }: { kind: SceneKind; title: string; action: string; paused: boolean }) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlRef = useRef<((paused: boolean) => void) | null>(null);

  useEffect(() => {
    const surfaceElement = surfaceRef.current;
    const canvasElement = canvasRef.current;
    if (!surfaceElement || !canvasElement) return;
    const surface = surfaceElement, canvas = canvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const context = ctx;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const controller = new AbortController();
    const options = { signal: controller.signal };
    let scene: LivingScene | undefined;
    let visible = false;
    let stopped = false;
    let frame = 0;
    let lastTime = 0;
    let lastPointerTime = 0;
    let pointerType = "mouse";
    const pointer: ScenePointer = { x: 0, y: 0, active: false, speed: 0, vx: 0, vy: 0, keyboard: false };

    function draw(time: number) {
      frame = 0;
      if (!visible || document.hidden || !scene) { lastTime = 0; return; }
      const dt = lastTime ? Math.min(.05, (time - lastTime) / 1000) : 1 / 60;
      lastTime = time;
      if (!stopped && !motion.matches) {
        // Small simulation steps keep steering stable on slower screens.
        for (let remaining = dt; remaining > .00001;) {
          const step = Math.min(1 / 60, remaining);
          scene.step(step, pointer);
          remaining -= step;
        }
        pointer.speed *= Math.exp(-dt * 5);
        pointer.vx *= Math.exp(-dt * 5);
        pointer.vy *= Math.exp(-dt * 5);
      }
      scene.draw(context, pointer);
      if (!stopped && !motion.matches) frame = requestAnimationFrame(draw);
      else lastTime = 0;
    }
    function requestDraw() { if (!frame) frame = requestAnimationFrame(draw); }
    function resetClock() { lastTime = 0; requestDraw(); }
    function resize() {
      const width = surface.clientWidth, height = surface.clientHeight;
      if (!width || !height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (scene) scene.resize(width, height);
      else scene = createLivingScene(kind, width, height);
      resetClock();
    }
    function point(event: PointerEvent | MouseEvent, measure = true) {
      const rect = surface.getBoundingClientRect();
      const x = Math.max(0, Math.min(surface.clientWidth, event.clientX - rect.left));
      const y = Math.max(0, Math.min(surface.clientHeight, event.clientY - rect.top));
      if (measure && pointer.active && lastPointerTime) {
        const dt = Math.max(.008, (event.timeStamp - lastPointerTime) / 1000);
        pointer.vx = Math.max(-2500, Math.min(2500, (x - pointer.x) / dt));
        pointer.vy = Math.max(-2500, Math.min(2500, (y - pointer.y) / dt));
        pointer.speed = Math.hypot(pointer.vx, pointer.vy);
      }
      lastPointerTime = event.timeStamp;
      pointer.x = x; pointer.y = y; pointer.active = true; pointer.keyboard = false;
      requestDraw();
    }
    function leave() {
      pointer.active = false; pointer.speed = 0; pointer.vx = 0; pointer.vy = 0;
      lastPointerTime = 0;
      requestDraw();
    }
    function act() {
      if (stopped || motion.matches) return;
      scene?.interact(pointer.x, pointer.y);
      requestDraw();
    }
    surface.addEventListener("pointermove", point, options);
    surface.addEventListener("pointerdown", event => { pointerType = event.pointerType; point(event, false); }, options);
    surface.addEventListener("pointerleave", leave, options);
    surface.addEventListener("pointercancel", leave, options);
    surface.addEventListener("click", event => { point(event, false); act(); if (pointerType !== "mouse") leave(); }, options);
    surface.addEventListener("focus", () => {
      if (!surface.matches(":focus-visible")) return;
      pointer.x = surface.clientWidth / 2; pointer.y = surface.clientHeight / 2;
      pointer.active = true; pointer.keyboard = true;
      requestDraw();
    }, options);
    surface.addEventListener("blur", leave, options);
    surface.addEventListener("keydown", event => {
      if (["Enter", " "].includes(event.key)) { event.preventDefault(); act(); return; }
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      pointer.x = Math.max(0, Math.min(surface.clientWidth, pointer.x + (event.key === "ArrowRight" ? 25 : event.key === "ArrowLeft" ? -25 : 0)));
      pointer.y = Math.max(0, Math.min(surface.clientHeight, pointer.y + (event.key === "ArrowDown" ? 25 : event.key === "ArrowUp" ? -25 : 0)));
      pointer.active = true; pointer.keyboard = true; pointer.speed = 0;
      requestDraw();
    }, options);
    motion.addEventListener("change", resetClock, options);
    document.addEventListener("visibilitychange", resetClock, options);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(surface);
    const intersection = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      if (!visible) { cancelAnimationFrame(frame); frame = 0; lastTime = 0; }
      else resetClock();
    });
    intersection.observe(surface);
    controlRef.current = value => { stopped = value; resetClock(); };
    resize();

    return () => {
      cancelAnimationFrame(frame);
      controller.abort();
      resizeObserver.disconnect();
      intersection.disconnect();
      controlRef.current = null;
    };
  }, [kind]);

  useEffect(() => { controlRef.current?.(paused); }, [paused]);

  return (
    <div ref={surfaceRef} className={`study-surface study-${kind}`} tabIndex={0} role="group" aria-label={`${title}. Arrow keys move the interaction point. Enter or Space to ${action}.`}>
      <canvas ref={canvasRef} aria-hidden="true" />
    </div>
  );
}

function Study({ kind, title, description, action, index }: typeof STUDIES[number] & { index: number }) {
  const [paused, setPaused] = useState(false);
  return (
    <figure className="interaction-study">
      <figcaption>
        <div><span className="study-number">0{index + 1}</span><h3>{title}</h3></div>
        <div className="study-caption-actions"><p>{description}</p><button className="study-pause" type="button" aria-pressed={paused} aria-label={`${paused ? "Resume" : "Pause"} ${title.toLowerCase()}`} onClick={() => setPaused(value => !value)}>{paused ? "Play ▷" : "Pause Ⅱ"}</button></div>
      </figcaption>
      <LivingCanvas kind={kind} title={title} action={action} paused={paused} />
    </figure>
  );
}

export default function InteractionStudies() {
  return (
    <section className="interaction-studies" aria-labelledby="studies-title">
      <div className="studies-heading"><span className="eyebrow">TWO LITTLE WORLDS</span><h2 id="studies-title">A moment by the water.</h2><p>Move gently. Make a ripple. See what follows.</p></div>
      {STUDIES.map((study, index) => <Study key={study.kind} {...study} index={index} />)}
    </section>
  );
}
