/* <topo-bg> — animated topographic contour background.
   Petrol-blue contour lines with teal (green) index lines, dot grid and cursor halo.
   Lines repel around the cursor; ghost cursors keep it alive when idle. */
(function () {
  if (customElements.get('topo-bg')) return;

  const PETROL = '12,86,120';
  const TEAL = '14,140,127';

  class TopoBg extends HTMLElement {
    connectedCallback() {
      if (this._started) return;
      this._started = true;
      this.style.cssText += ';display:block;position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';

      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
      this.appendChild(canvas);
      const ctx = canvas.getContext('2d');

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const resize = () => {
        const r = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = this.offsetWidth * r;
        canvas.height = this.offsetHeight * r;
        ctx.setTransform(r, 0, 0, r, 0, 0);
      };
      resize();
      requestAnimationFrame(resize);
      window.addEventListener('resize', resize);

      const mouse = { x: -9999, y: -9999 };
      const sm = { x: -9999, y: -9999 };
      const onMouse = (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      };
      const onTouch = (e) => {
        const rect = canvas.getBoundingClientRect();
        const t = e.touches[0];
        mouse.x = t.clientX - rect.left;
        mouse.y = t.clientY - rect.top;
      };
      window.addEventListener('mousemove', onMouse);
      window.addEventListener('touchmove', onTouch, { passive: true });

      const ghosts = [0, 1, 2].map(() => ({
        x: Math.random() * 1200,
        y: Math.random() * 700,
        r: 60 + Math.random() * 80,
        speed: 0.0015 + Math.random() * 0.002,
        phase: Math.random() * Math.PI * 2,
      }));

      let t = 0;
      let raf = null;

      const draw = () => {
        const W = this.offsetWidth;
        const H = this.offsetHeight;
        ctx.clearRect(0, 0, W, H);

        sm.x += (mouse.x - sm.x) * 0.055;
        sm.y += (mouse.y - sm.y) * 0.055;

        ghosts.forEach((g) => {
          g.x += Math.sin(t * g.speed * 120 + g.phase) * 1.2;
          g.y += Math.cos(t * g.speed * 90 + g.phase + 1) * 0.9;
          if (g.x < 0) g.x = W;
          if (g.x > W) g.x = 0;
          if (g.y < 0) g.y = H;
          if (g.y > H) g.y = 0;
        });

        const N = 24;
        const steps = 190;

        for (let i = 0; i < N; i++) {
          const baseY = (H / (N + 1)) * (i + 1);
          const isIndex = i % 6 === 0;
          const isMid = i % 3 === 0;
          // Index lines in the project green (teal); the rest in petrol
          ctx.strokeStyle = isIndex
            ? 'rgba(' + TEAL + ',0.16)'
            : isMid
            ? 'rgba(' + PETROL + ',0.09)'
            : 'rgba(' + PETROL + ',0.05)';
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

            const dxM = x - sm.x;
            const dyM = baseY - sm.y;
            const d2M = dxM * dxM + dyM * dyM;
            const pushM = Math.exp(-d2M / 38000) * 95;
            const dirM = (baseY - sm.y) / (Math.sqrt(d2M) + 1);

            let ghostPush = 0;
            ghosts.forEach((g) => {
              const dxG = x - g.x;
              const dyG = baseY - g.y;
              const d2G = dxG * dxG + dyG * dyG;
              ghostPush += Math.exp(-d2G / (g.r * g.r * 5)) * 28 * ((baseY - g.y) / (Math.sqrt(d2G) + 1));
            });

            const y = baseY + wave + pushM * dirM + ghostPush;
            j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.stroke();
        }

        // Dot grid in green — dots swell near the cursor
        ctx.fillStyle = 'rgba(' + TEAL + ',0.18)';
        const dotSpacing = 64;
        for (let dx = dotSpacing; dx < W; dx += dotSpacing) {
          for (let dy = dotSpacing / 2; dy < H; dy += dotSpacing) {
            const proximity = Math.exp(-((dx - sm.x) ** 2 + (dy - sm.y) ** 2) / 25000);
            const r = 1 + proximity * 3;
            ctx.beginPath();
            ctx.arc(dx, dy, r, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Cursor halo — green core into petrol fade
        if (sm.x > 0 && sm.x < W) {
          const grad = ctx.createRadialGradient(sm.x, sm.y, 0, sm.x, sm.y, 72);
          grad.addColorStop(0, 'rgba(' + TEAL + ',0.30)');
          grad.addColorStop(0.5, 'rgba(' + PETROL + ',0.12)');
          grad.addColorStop(1, 'rgba(' + PETROL + ',0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(sm.x, sm.y, 72, 0, Math.PI * 2);
          ctx.fill();
        }

        t += 0.004;
        if (!reduced) raf = requestAnimationFrame(draw);
      };

      draw();

      this._cleanup = () => {
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', onMouse);
        window.removeEventListener('touchmove', onTouch);
      };
    }

    disconnectedCallback() {
      if (this._cleanup) this._cleanup();
      this._started = false;
    }
  }

  customElements.define('topo-bg', TopoBg);
})();
