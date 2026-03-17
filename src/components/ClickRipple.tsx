"use client";

import { useEffect, useRef, useCallback } from "react";

interface Ripple {
  x: number;
  y: number;
  age: number;
}

const PIXEL_SIZE = 6;
const MAX_RADIUS = 80;
const DURATION = 600;
const PURPLE = { r: 139, g: 92, b: 246 };
const LIME = { r: 196, g: 229, b: 56 };

export default function ClickRipple() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripples = useRef<Ripple[]>([]);
  const raf = useRef<number>(0);

  const isInteractive = useCallback((el: HTMLElement): boolean => {
    if (!el) return false;
    const tag = el.tagName;
    if (tag === "A" || tag === "BUTTON" || tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return true;
    if (el.getAttribute("role") === "button") return true;
    if (el.closest("a, button, [role='button']")) return true;
    return false;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onClick = (e: MouseEvent) => {
      if (isInteractive(e.target as HTMLElement)) return;
      ripples.current.push({ x: e.clientX, y: e.clientY, age: 0 });
    };
    window.addEventListener("click", onClick);

    let last = performance.now();

    const draw = (now: number) => {
      const dt = now - last;
      last = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ripples.current = ripples.current.filter((r) => r.age < DURATION);

      for (const r of ripples.current) {
        r.age += dt;
        const progress = r.age / DURATION;
        const radius = progress * MAX_RADIUS;
        const innerRadius = Math.max(0, radius - PIXEL_SIZE * 2.5);
        const opacity = (1 - progress) * 0.7;

        // Draw pixelated ring
        const step = PIXEL_SIZE;
        const minX = Math.floor((r.x - radius) / step) * step;
        const maxX = Math.ceil((r.x + radius) / step) * step;
        const minY = Math.floor((r.y - radius) / step) * step;
        const maxY = Math.ceil((r.y + radius) / step) * step;

        for (let px = minX; px <= maxX; px += step) {
          for (let py = minY; py <= maxY; py += step) {
            const cx = px + step / 2;
            const cy = py + step / 2;
            const dist = Math.sqrt((cx - r.x) ** 2 + (cy - r.y) ** 2);

            if (dist > innerRadius && dist < radius) {
              const t = (dist - innerRadius) / (radius - innerRadius);
              const cr = PURPLE.r + (LIME.r - PURPLE.r) * t;
              const cg = PURPLE.g + (LIME.g - PURPLE.g) * t;
              const cb = PURPLE.b + (LIME.b - PURPLE.b) * t;
              const pixelOpacity = opacity * (1 - Math.abs(t - 0.5) * 2) * 1.5;

              ctx.fillStyle = `rgba(${cr | 0},${cg | 0},${cb | 0},${pixelOpacity})`;
              ctx.fillRect(px, py, step - 1, step - 1);
            }
          }
        }
      }

      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", onClick);
    };
  }, [isInteractive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[99] pointer-events-none"
    />
  );
}
