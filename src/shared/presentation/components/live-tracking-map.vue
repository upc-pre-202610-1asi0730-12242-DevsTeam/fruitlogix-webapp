<template>
  <div class="map-canvas-wrap">
    <canvas ref="mapCanvas"></canvas>
    <div ref="mapTooltip" class="map-tooltip">{{ currentRemainingKm }} km restantes</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

// PROPS: Permiten que cualquier pantalla le pase datos al mapa
const props = defineProps({
  originLabel: { type: String, default: 'ORIGEN' },
  destinationLabel: { type: String, default: 'DESTINO' },
  totalKm: { type: Number, default: 4.2 }
});

const mapCanvas = ref(null);
const mapTooltip = ref(null);
const currentRemainingKm = ref(props.totalKm.toFixed(1));

let animFrameId = null;

onMounted(() => {
  const canvas = mapCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width || 600; // Fallback width
    canvas.height = rect.height || 280; // Fallback height
  }
  resize();
  window.addEventListener('resize', resize);

  const W = () => canvas.width;
  const H = () => canvas.height;

  // Paleta de colores del mapa (Alineado a FruitLogix)
  const BG     = '#1a2a1e';
  const ROAD   = '#243328';
  const ROAD_L = '#2e4535';
  const BLOCK  = '#1e2d24';
  const BLOCK2 = '#1c2b22';
  const PARK   = '#1f3327';
  const ROUTE  = '#D4E952';
  const ACCENT = '#4a6b4a';

  // 1. Dibuja la ciudad "falsa"
  function drawCity() {
    const w = W(), h = H();
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, w, h);
    const roads = [
      { x1:0, y1:h*0.25, x2:w, y2:h*0.25, lw:18 },
      { x1:0, y1:h*0.55, x2:w, y2:h*0.55, lw:18 },
      { x1:0, y1:h*0.78, x2:w, y2:h*0.78, lw:14 },
      { x1:w*0.18, y1:0, x2:w*0.18, y2:h, lw:18 },
      { x1:w*0.42, y1:0, x2:w*0.42, y2:h, lw:18 },
      { x1:w*0.68, y1:0, x2:w*0.68, y2:h, lw:18 },
      { x1:w*0.88, y1:0, x2:w*0.88, y2:h, lw:14 },
      { x1:0, y1:h*0.08, x2:w, y2:h*0.08, lw:12 },
    ];
    roads.forEach(r => {
      ctx.strokeStyle = ROAD; ctx.lineWidth = r.lw;
      ctx.beginPath(); ctx.moveTo(r.x1,r.y1); ctx.lineTo(r.x2,r.y2); ctx.stroke();
      ctx.strokeStyle = ROAD_L; ctx.lineWidth = 1;
      ctx.setLineDash([8,8]);
      ctx.beginPath(); ctx.moveTo(r.x1,r.y1); ctx.lineTo(r.x2,r.y2); ctx.stroke();
      ctx.setLineDash([]);
    });
    const blocks = [
      { x:w*0.01, y:h*0.1,  bw:w*0.15, bh:h*0.13, c:BLOCK  },
      { x:w*0.21, y:h*0.1,  bw:w*0.18, bh:h*0.13, c:BLOCK2 },
      { x:w*0.45, y:h*0.1,  bw:w*0.20, bh:h*0.13, c:BLOCK  },
      { x:w*0.70, y:h*0.1,  bw:w*0.16, bh:h*0.13, c:BLOCK2 },
      { x:w*0.01, y:h*0.28, bw:w*0.14, bh:h*0.24, c:BLOCK2 },
      { x:w*0.21, y:h*0.28, bw:w*0.18, bh:h*0.24, c:BLOCK  },
      { x:w*0.45, y:h*0.28, bw:w*0.20, bh:h*0.24, c:PARK   },
      { x:w*0.70, y:h*0.28, bw:w*0.16, bh:h*0.24, c:BLOCK2 },
      { x:w*0.90, y:h*0.28, bw:w*0.09, bh:h*0.24, c:BLOCK  },
      { x:w*0.01, y:h*0.58, bw:w*0.14, bh:h*0.17, c:BLOCK  },
      { x:w*0.21, y:h*0.58, bw:w*0.18, bh:h*0.17, c:BLOCK2 },
      { x:w*0.45, y:h*0.58, bw:w*0.20, bh:h*0.17, c:BLOCK  },
      { x:w*0.70, y:h*0.58, bw:w*0.16, bh:h*0.17, c:PARK   },
      { x:w*0.90, y:h*0.58, bw:w*0.09, bh:h*0.17, c:BLOCK2 },
      { x:w*0.01, y:h*0.81, bw:w*0.14, bh:h*0.17, c:BLOCK2 },
      { x:w*0.21, y:h*0.81, bw:w*0.18, bh:h*0.17, c:BLOCK  },
      { x:w*0.45, y:h*0.81, bw:w*0.20, bh:h*0.17, c:BLOCK2 },
      { x:w*0.70, y:h*0.81, bw:w*0.16, bh:h*0.17, c:BLOCK  },
    ];
    blocks.forEach(b => {
      ctx.fillStyle = b.c;
      ctx.beginPath(); ctx.roundRect(b.x+2, b.y+2, b.bw-4, b.bh-4, 3); ctx.fill();
      if (b.c === PARK) {
        ctx.fillStyle = '#1f3a28';
        ctx.beginPath(); ctx.roundRect(b.x+6, b.y+6, b.bw-12, b.bh-12, 2); ctx.fill();
      }
    });
  }

  // 2. Define la ruta
  function getRoutePoints() {
    const w = W(), h = H();
    return [
      { x:w*0.05, y:h*0.55 }, { x:w*0.18, y:h*0.55 },
      { x:w*0.18, y:h*0.25 }, { x:w*0.42, y:h*0.25 },
      { x:w*0.42, y:h*0.55 }, { x:w*0.68, y:h*0.55 },
      { x:w*0.68, y:h*0.25 }, { x:w*0.88, y:h*0.25 },
      { x:w*0.95, y:h*0.25 },
    ];
  }

  function totalLen(pts) {
    let l = 0;
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i].x - pts[i-1].x, dy = pts[i].y - pts[i-1].y;
      l += Math.sqrt(dx*dx + dy*dy);
    }
    return l;
  }

  function posAtT(pts, t) {
    const total = totalLen(pts);
    let target = total * t, acc = 0;
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i].x - pts[i-1].x, dy = pts[i].y - pts[i-1].y;
      const seg = Math.sqrt(dx*dx + dy*dy);
      if (acc + seg >= target) {
        const f = (target - acc) / seg;
        return { x: pts[i-1].x + dx*f, y: pts[i-1].y + dy*f, angle: Math.atan2(dy, dx) };
      }
      acc += seg;
    }
    const last = pts[pts.length-1], prev = pts[pts.length-2];
    return { x:last.x, y:last.y, angle: Math.atan2(last.y-prev.y, last.x-prev.x) };
  }

  // 3. Dibuja la línea verde neón de la ruta
  function drawRoute(pts, progress) {
    ctx.strokeStyle = 'rgba(212,233,82,0.18)'; ctx.lineWidth = 4;
    ctx.setLineDash([10,7]);
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke(); ctx.setLineDash([]);
    const total = totalLen(pts);
    let drawn = 0;
    ctx.strokeStyle = ROUTE; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i].x - pts[i-1].x, dy = pts[i].y - pts[i-1].y;
      const seg = Math.sqrt(dx*dx + dy*dy);
      const need = total * progress - drawn;
      if (need <= 0) break;
      if (need >= seg) { ctx.lineTo(pts[i].x, pts[i].y); drawn += seg; }
      else { ctx.lineTo(pts[i-1].x + dx*(need/seg), pts[i-1].y + dy*(need/seg)); break; }
    }
    ctx.stroke();
  }

  function drawOrigin(pts) {
    const p = pts[0];
    ctx.fillStyle = ACCENT;
    ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#2d4535';
    ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#7a9a7a';
    ctx.font = '700 10px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(props.originLabel, p.x, p.y + 20);
  }

  function drawDest(pts) {
    const p = pts[pts.length-1];
    ctx.strokeStyle = ROUTE; ctx.lineWidth = 2;
    ctx.fillStyle = '#1a2a1e';
    ctx.beginPath(); ctx.arc(p.x, p.y, 12, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(212,233,82,0.3)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(p.x, p.y, 20, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = ROUTE;
    ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI*2); ctx.fill();
    ctx.font = '700 10px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(props.destinationLabel, p.x, p.y - 26);
  }

  function drawTruck(x, y, angle) {
    ctx.save();
    ctx.translate(x, y); ctx.rotate(angle);
    ctx.fillStyle = '#1a2a1e'; ctx.strokeStyle = ROUTE; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(212,233,82,0.25)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(0, 0, 23, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = '#5a3ab0';
    ctx.beginPath(); ctx.roundRect(-11, -7, 22, 11, 2); ctx.fill();
    ctx.fillStyle = '#7a55d8';
    ctx.beginPath(); ctx.roundRect(5, -5, 7, 8, 1); ctx.fill();
    ctx.fillStyle = '#D4E952';
    ctx.beginPath(); ctx.roundRect(6, -4, 5, 5, 1); ctx.fill();
    ctx.fillStyle = '#6a48c0';
    ctx.beginPath(); ctx.roundRect(-11, -7, 14, 4, 1); ctx.fill();
    ctx.fillStyle = '#1a2a1e';
    ctx.beginPath(); ctx.arc(-6, 5, 3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(5, 5, 3, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = '#3a3060'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(-6, 5, 3, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(5, 5, 3, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = 'rgba(212,233,82,0.7)';
    ctx.beginPath(); ctx.roundRect(-14, -3, 3, 4, 1); ctx.fill();
    ctx.restore();
  }

  let progress = 0;
  let lastTime = null;
  const SPEED = 0.045; // Velocidad de la simulación

  // 4. Bucle de Animación Visual
  function animate(ts) {
    if (!lastTime) lastTime = ts;
    const dt = (ts - lastTime) / 1000;
    lastTime = ts;
    progress = (progress + SPEED * dt) % 1; // Resetea a 0 cuando llega al final

    const pts = getRoutePoints();
    ctx.clearRect(0, 0, W(), H());
    drawCity();
    drawRoute(pts, progress);
    drawOrigin(pts);
    drawDest(pts);

    const pos = posAtT(pts, progress);
    drawTruck(pos.x, pos.y, pos.angle);

    const tw = mapTooltip.value;
    if (tw) {
      const remaining = Math.max(0, (1 - progress) * props.totalKm).toFixed(1);
      currentRemainingKm.value = remaining;
      
      const cw = canvas.parentElement.getBoundingClientRect().width;
      const tx = Math.min(Math.max(pos.x - 60, 4), cw - 160);
      const ty = Math.max(pos.y - 46, 4);
      tw.style.left = tx + 'px';
      tw.style.top = ty + 'px';
    }

    animFrameId = requestAnimationFrame(animate);
  }

  animFrameId = requestAnimationFrame(animate);
});

onUnmounted(() => {
  if (animFrameId) cancelAnimationFrame(animFrameId);
});
</script>

<style scoped>
.map-canvas-wrap { 
  position: relative; 
  width: 100%; 
  height: 100%; 
  overflow: hidden; 
  background: #1a2a1e;
  border-radius: inherit;
}
.map-canvas-wrap canvas { 
  display: block; 
  width: 100%; 
  height: 100%; 
}
.map-tooltip { 
  position: absolute; 
  background: #D4E952; 
  color: #121212; 
  font-size: 11px; 
  font-weight: 800; 
  padding: 5px 12px; 
  border-radius: 8px; 
  pointer-events: none; 
  white-space: nowrap; 
  font-family: 'DM Sans', sans-serif;
}
.map-tooltip::after { 
  content: ''; 
  position: absolute; 
  bottom: -5px; 
  left: 50%; 
  transform: translateX(-50%); 
  border: 5px solid transparent; 
  border-bottom: none; 
  border-top-color: #D4E952; 
}
</style>