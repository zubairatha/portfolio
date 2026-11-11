"use client";
import { useEffect, useRef } from "react";
type Point = {
    x: number;
    y: number;
    px: number;
    py: number;
    vx: number;
    vy: number;
    sz: number;
    a: number;
    col: string;
};
export default function LightField() {
    const fieldRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const fieldElement = fieldRef.current, canvasElement = canvasRef.current;
        if (!fieldElement || !canvasElement)
            return;
        const field = fieldElement, canvas = canvasElement;
        const context = canvas.getContext('2d');
        if (!context)
            return;
        const ctx = context;
        const media = window.matchMedia('(prefers-reduced-motion: reduce)');
        let reduced = media.matches;
        let pts: Point[] = [], w = 0, h = 0, dpr = 1, frame = 0, fieldVisible = true;
        const pointer = { x: -1000, y: -1000, active: false };
        function seeded(i: number) { const x = Math.sin(i * 127.1 + 17.13) * 43758.5453; return x - Math.floor(x); }
        function resize() {
            const rect = field.getBoundingClientRect();
            if (!rect.width || !rect.height)
                return;
            w = rect.width;
            h = rect.height;
            dpr = Math.min(devicePixelRatio || 1, 2);
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            pts = [];
            // Nearly invisible sensor grid, with a circular aperture-shaped density variation.
            const step = w < 300 ? 15 : 17;
            const cols = Math.floor((w - 26) / step), rows = Math.floor((h - 24) / step), offX = (w - cols * step) / 2, offY = (h - rows * step) / 2;
            for (let iy = 0; iy <= rows; iy++)
                for (let ix = 0; ix <= cols; ix++) {
                    const seed = iy * (cols + 1) + ix + 1, px = offX + ix * step, py = offY + iy * step;
                    const nx = (px - w / 2) / (w * .48), ny = (py - h / 2) / (h * .47), r = Math.hypot(nx, ny);
                    if (seeded(seed + 20) > .91 && r > .60)
                        continue;
                    const alpha = .18 + (.25 * Math.max(0, 1 - Math.abs(r - .55) * 1.7));
                    pts.push({ x: px, y: py, px, py, vx: 0, vy: 0, sz: .72 + seeded(seed * 2) * .55, a: alpha, col: seeded(seed * 5) > .93 ? '166,106,78' : '93,124,108' });
                }
        }
        function draw() { if (!fieldVisible)
            return; ctx.clearRect(0, 0, w, h); for (const p of pts) {
            const dx = p.px - pointer.x, dy = p.py - pointer.y, dist = Math.hypot(dx, dy);
            if (!reduced && pointer.active && dist < 92 && dist > .001) {
                const push = (1 - dist / 92) ** 1.65 * .88;
                p.vx += (dx / dist) * push;
                p.vy += (dy / dist) * push;
            }
            const spring = reduced ? .4 : .035, friction = reduced ? .2 : .84;
            p.vx += (p.x - p.px) * spring;
            p.vy += (p.y - p.py) * spring;
            p.vx *= friction;
            p.vy *= friction;
            p.px += p.vx;
            p.py += p.vy;
            ctx.beginPath();
            ctx.arc(p.px, p.py, p.sz, 0, Math.PI * 2);
            const near = pointer.active ? Math.max(0, 1 - dist / 110) : 0;
            ctx.fillStyle = `rgba(${p.col},${Math.min(.92, p.a + near * .30)})`;
            ctx.fill();
        } if (!reduced)
            frame = requestAnimationFrame(draw); }
        const observe = new IntersectionObserver(entries => { fieldVisible = entries.some(e => e.isIntersecting); if (fieldVisible) {
            resize();
            cancelAnimationFrame(frame);
            draw();
        }
        else
            cancelAnimationFrame(frame); }, { threshold: 0 });
        observe.observe(field);
        const resizeObserver = new ResizeObserver(() => { if (fieldVisible) {
            resize();
            cancelAnimationFrame(frame);
            draw();
        } });
        resizeObserver.observe(field);
        const controller = new AbortController();
        field.addEventListener('pointermove', e => { const r = field.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.active = true; if (reduced)
            draw(); }, { signal: controller.signal });
        field.addEventListener('pointerleave', () => { pointer.active = false; if (reduced)
            draw(); }, { signal: controller.signal });
        field.addEventListener('pointerdown', e => { const r = field.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; pointer.active = true; if (reduced)
            draw(); }, { signal: controller.signal });
        const motionChange = () => { reduced = media.matches; cancelAnimationFrame(frame); resize(); draw(); };
        media.addEventListener('change', motionChange);
        return () => { controller.abort(); cancelAnimationFrame(frame); observe.disconnect(); resizeObserver.disconnect(); media.removeEventListener('change', motionChange); };
    }, []);
    return <div ref={fieldRef} role="img" aria-label="An interactive field of light-sensitive dots that react to your pointer" className="light-field"><canvas ref={canvasRef} aria-hidden="true"/><span className="light-note">MOVE YOUR CURSOR THROUGH THE FIELD ↗</span></div>;
}
