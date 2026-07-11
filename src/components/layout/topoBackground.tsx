"use client";

import { useEffect, useRef } from "react";

// Canvas paints with the brand palette directly (no CSS classes on 2D contexts).
const PETROL = "12,86,120";
const TEAL = "14,140,127";

interface TopoBackgroundProps {
  /**
   * `fixed` (default) covers the whole viewport, for page-level use.
   * `absolute` scopes it to the nearest positioned ancestor instead —
   * for a panel-level backdrop like the auth page's form column.
   */
  variant?: "fixed" | "absolute";
}

/**
 * Decorative animated topographic background (behind all content) used
 * on the landing and building pages: petrol contour lines with teal index
 * lines, a dot grid, and a cursor halo that repels the lines. Ghost cursors
 * keep it alive while idle; `prefers-reduced-motion` renders a single static
 * frame.
 */
export function TopoBackground({ variant = "fixed" }: TopoBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: -9999, y: -9999 };
    const smooth = { x: -9999, y: -9999 };
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onTouch = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouse.x = touch.clientX - rect.left;
      mouse.y = touch.clientY - rect.top;
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch, { passive: true });

    const ghosts = [0, 1, 2].map(() => ({
      x: Math.random() * 1200,
      y: Math.random() * 700,
      r: 60 + Math.random() * 80,
      speed: 0.0015 + Math.random() * 0.002,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    let raf: number | null = null;

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      smooth.x += (mouse.x - smooth.x) * 0.055;
      smooth.y += (mouse.y - smooth.y) * 0.055;

      for (const g of ghosts) {
        g.x += Math.sin(t * g.speed * 120 + g.phase) * 1.2;
        g.y += Math.cos(t * g.speed * 90 + g.phase + 1) * 0.9;
        if (g.x < 0) g.x = W;
        if (g.x > W) g.x = 0;
        if (g.y < 0) g.y = H;
        if (g.y > H) g.y = 0;
      }

      const lineCount = 24;
      const steps = 190;

      for (let i = 0; i < lineCount; i++) {
        const baseY = (H / (lineCount + 1)) * (i + 1);
        const isIndex = i % 6 === 0;
        const isMid = i % 3 === 0;
        ctx.strokeStyle = isIndex
          ? `rgba(${TEAL},0.16)`
          : isMid
            ? `rgba(${PETROL},0.09)`
            : `rgba(${PETROL},0.05)`;
        ctx.lineWidth = isIndex ? 1.4 : isMid ? 0.9 : 0.55;
        ctx.beginPath();

        for (let j = 0; j <= steps; j++) {
          const x = (j / steps) * W;
          const wave =
            Math.sin(x * 0.0048 + t * 0.28 + i * 0.9) * 22 +
            Math.sin(x * 0.0093 - t * 0.19 + i * 0.44) * 13 +
            Math.cos(x * 0.0028 + t * 0.13 + i * 1.3) * 30 +
            Math.sin(x * 0.0175 + t * 0.07 + i * 0.55) * 7 +
            Math.cos(x * 0.006 - t * 0.22 + i * 0.77) * 17 +
            Math.sin(x * 0.031 + t * 0.05 + i * 1.1) * 4;

          const dxM = x - smooth.x;
          const dyM = baseY - smooth.y;
          const d2M = dxM * dxM + dyM * dyM;
          const pushM = Math.exp(-d2M / 38000) * 95;
          const dirM = dyM / (Math.sqrt(d2M) + 1);

          let ghostPush = 0;
          for (const g of ghosts) {
            const dxG = x - g.x;
            const dyG = baseY - g.y;
            const d2G = dxG * dxG + dyG * dyG;
            ghostPush +=
              Math.exp(-d2G / (g.r * g.r * 5)) * 28 * (dyG / (Math.sqrt(d2G) + 1));
          }

          const y = baseY + wave + pushM * dirM + ghostPush;
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Dot grid in teal — dots swell near the cursor.
      ctx.fillStyle = `rgba(${TEAL},0.18)`;
      const dotSpacing = 64;
      for (let dx = dotSpacing; dx < W; dx += dotSpacing) {
        for (let dy = dotSpacing / 2; dy < H; dy += dotSpacing) {
          const proximity = Math.exp(
            -((dx - smooth.x) ** 2 + (dy - smooth.y) ** 2) / 25000
          );
          ctx.beginPath();
          ctx.arc(dx, dy, 1 + proximity * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Cursor halo — teal core fading into petrol.
      if (smooth.x > 0 && smooth.x < W) {
        const grad = ctx.createRadialGradient(smooth.x, smooth.y, 0, smooth.x, smooth.y, 72);
        grad.addColorStop(0, `rgba(${TEAL},0.30)`);
        grad.addColorStop(0.5, `rgba(${PETROL},0.12)`);
        grad.addColorStop(1, `rgba(${PETROL},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(smooth.x, smooth.y, 72, 0, Math.PI * 2);
        ctx.fill();
      }

      t += 0.004;
      if (!reduced) raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  return (
    <div
      className={`pointer-events-none ${variant} inset-0 -z-10 overflow-hidden`}
      aria-hidden
    >
      <div className="absolute -left-[10%] -top-[15%] h-[55vw] w-[55vw] rounded-full bg-[radial-gradient(circle,rgba(14,140,127,.06)_0%,transparent_65%)]" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
