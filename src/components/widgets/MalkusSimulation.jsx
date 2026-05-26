import { useState, useEffect, useRef } from 'react';

// --- Constants ---
const HIST_LEN = 600;
const TRAIL_LEN = 1000;
const DT = 0.005;

// Theme colors extracted for cleaner canvas rendering
const COLORS = {
  grid: '#1a2a1a',
  wheel: '#2d3a2d',
  spokes: '#1e3a1e',
  water: '#87ceeb',
  waterHigh: '#358957',
  bucketBg: '#0d1a12',
  bg: '#080c08',
  text: '#7b8c7b',
  trailPositive: '135,206,235', // R,G,B for rgba
  trailNegative: '79,187,123'
};

// --- Helpers ---
const formatTime = (ms) => {
  const seconds = Math.floor(ms / 1000);
  return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
};

const calculateInitialHash = () => {
  if (typeof window === 'undefined') return 0;
  const metadata = [navigator.userAgent, window.screen.width, window.screen.height, new Date().getTimezoneOffset()].join('|');
  let hash = 0;
  for (let i = 0; i < metadata.length; i++) {
    hash = ((hash << 5) - hash) + metadata.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export default function MalkusSimulation() {
  const canvasRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [seed] = useState(() => {
    const hash = calculateInitialHash();
    return `SID_${hash.toString(16).toUpperCase().padStart(8, '0')}`;
  });
  
  // Refs for direct DOM manipulation (avoids 60FPS React renders)
  const revRef = useRef(null);
  const elRef = useRef(null);
  const omRef = useRef(null);
  const dirRef = useRef(null);

  // Mutable playing state for the animation loop closure
  const playingRef = useRef(playing);
  useEffect(() => { playingRef.current = playing; }, [playing]);

  const params = useRef({ speed: 3, sigma: 10, rho: 28, beta: 2.7 });
  
  const state = useRef({
    lx: 0.1, ly: 0.1, lz: 28,
    wheelAngle: 0,
    reversals: 0,
    lastSign: 0,
    omegaHist: new Float32Array(HIST_LEN),
    histIdx: 0,
    histFull: false,
    trailX: new Float32Array(TRAIL_LEN),
    trailY: new Float32Array(TRAIL_LEN),
    trailIdx: 0,
    trailFull: false,
    elapsedTime: 0
  });

  const requestRef = useRef();

  // Direct DOM mutation for stats (prevents React diffing on every frame)
  const updateStatsUI = (s) => {
    if (revRef.current) revRef.current.textContent = s.reversals;
    if (elRef.current) elRef.current.textContent = formatTime(s.elapsedTime);
    if (omRef.current) omRef.current.textContent = s.lx.toFixed(2);
    if (dirRef.current) {
      dirRef.current.textContent = s.lx > 0.5 ? 'CW' : s.lx < -0.5 ? 'CCW' : 'ST';
    }
  };

  const reset = (hash = 0) => {
    const s = state.current;
    s.lx = 0.1 + ((hash % 100) / 200 - 0.25);
    s.ly = 0.1 + (((hash >> 8) % 100) / 200 - 0.25);
    s.lz = 28 + (((hash >> 16) % 100) / 50 - 1);
    s.wheelAngle = 0;
    
    s.omegaHist.fill(0);
    s.trailX.fill(0); 
    s.trailY.fill(0);
    s.histIdx = 0; s.histFull = false;
    s.trailIdx = 0; s.trailFull = false;
    s.reversals = 0; s.lastSign = 0;
    s.elapsedTime = 0;
    
    updateStatsUI(s);
  };

  useEffect(() => {
    reset(calculateInitialHash());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // RK4 solver - Inlined to prevent Garbage Collection stutters
  const rungeKuttaStep = (s, p, dt) => {
    const { lx: x, ly: y, lz: z } = s;
    const { sigma, rho, beta } = p;

    const k1x = sigma * (y - x);
    const k1y = x * (rho - z) - y;
    const k1z = x * y - beta * z;

    const hdt = dt * 0.5;
    const k2x = sigma * ((y + hdt * k1y) - (x + hdt * k1x));
    const k2y = (x + hdt * k1x) * (rho - (z + hdt * k1z)) - (y + hdt * k1y);
    const k2z = (x + hdt * k1x) * (y + hdt * k1y) - beta * (z + hdt * k1z);

    const k3x = sigma * ((y + hdt * k2y) - (x + hdt * k2x));
    const k3y = (x + hdt * k2x) * (rho - (z + hdt * k2z)) - (y + hdt * k2y);
    const k3z = (x + hdt * k2x) * (y + hdt * k2y) - beta * (z + hdt * k2z);

    const k4x = sigma * ((y + dt * k3y) - (x + dt * k3x));
    const k4y = (x + dt * k3x) * (rho - (z + dt * k3z)) - (y + dt * k3y);
    const k4z = (x + dt * k3x) * (y + dt * k3y) - beta * (z + dt * k3z);

    s.lx = x + (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
    s.ly = y + (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y);
    s.lz = z + (dt / 6) * (k1z + 2 * k2z + 2 * k3z + k4z);
  };

  const draw = (ctx, W, H) => {
    const s = state.current;
    ctx.clearRect(0, 0, W, H);
    
    // Grid
    ctx.strokeStyle = COLORS.grid; ctx.lineWidth = 0.5;
    for (let x = 0; x < W / 2; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W / 2, y); ctx.stroke(); }

    // Wheel
    const CX = W * 0.25, CY = H * 0.5, R = Math.min(W, H) * 0.25, N = 12;
    ctx.strokeStyle = COLORS.wheel; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(CX, CY, R, 0, Math.PI * 2); ctx.stroke();
    
    // Spokes
    ctx.lineWidth = 0.8; ctx.strokeStyle = COLORS.spokes;
    for (let i = 0; i < N; i++) {
      const a = s.wheelAngle + (i / N) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(CX, CY); ctx.lineTo(CX + Math.cos(a) * R, CY + Math.sin(a) * R); ctx.stroke();
    }

    // Inflow
    if (playingRef.current) {
      ctx.fillStyle = COLORS.water; ctx.globalAlpha = 0.4;
      ctx.fillRect(CX - 2, CY - R - 25, 4, 22); ctx.globalAlpha = 1;
    }

    // Buckets
    const waterLevel = Math.min(Math.abs(s.ly) / 20, 1);
    for (let i = 0; i < N; i++) {
      const a = s.wheelAngle + (i / N) * Math.PI * 2;
      const bx = CX + Math.cos(a) * R, by = CY + Math.sin(a) * R;
      const topness = Math.max(0, Math.cos(a + Math.PI / 2));
      const fill = Math.min(waterLevel * topness, 1);
      
      ctx.fillStyle = COLORS.bucketBg; 
      ctx.strokeStyle = fill > 0.6 ? COLORS.waterHigh : fill > 0.2 ? COLORS.water : COLORS.wheel;
      ctx.beginPath(); ctx.rect(bx - 5, by - 5, 10, 10); ctx.fill(); ctx.stroke();
      
      if (fill > 0.02) {
        ctx.fillStyle = fill > 0.6 ? COLORS.waterHigh : COLORS.water;
        const lv = Math.floor(fill * 8);
        ctx.fillRect(bx - 4, by + 4 - lv, 8, lv);
      }
    }

    // Plots setup
    const gap = 10;
    const px = W * 0.5 + 5;
    const pw = W * 0.5 - 10;
    const ph = (H - gap * 3) / 2; // Dynamically calculate height to ensure equal padding
    
    // Omega Plot
    const py1 = gap;
    const midY1 = py1 + ph * 0.5;
    ctx.fillStyle = COLORS.bg; ctx.fillRect(px, py1, pw, ph);
    ctx.strokeStyle = COLORS.wheel; ctx.strokeRect(px, py1, pw, ph);
    ctx.beginPath(); ctx.moveTo(px, midY1); ctx.lineTo(px + pw, midY1); ctx.stroke();
    ctx.fillStyle = COLORS.text; ctx.font = '7px monospace'; ctx.fillText('OMEGA_TRACE', px + 4, py1 + 8);

    const hLen = s.histFull ? HIST_LEN : s.histIdx;
    if (hLen > 1) {
      ctx.beginPath(); ctx.lineWidth = 1; ctx.strokeStyle = COLORS.water;
      for (let j = 0; j < hLen; j++) {
        const idx = s.histFull ? (s.histIdx + j) % HIST_LEN : j;
        const x = px + (j / (hLen - 1)) * pw;
        const y = midY1 - (s.omegaHist[idx] / 25) * (ph / 2 - 4);
        j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Phase Portrait
    const py2 = py1 + ph + gap; // Top padding + plot height + middle gap
    ctx.fillStyle = COLORS.bg; ctx.fillRect(px, py2, pw, ph);
    ctx.strokeStyle = COLORS.wheel; ctx.strokeRect(px, py2, pw, ph);
    
    const midX2 = px + pw / 2;
    const midY2 = py2 + ph / 2; 
    
    ctx.beginPath(); ctx.moveTo(midX2, py2 + 2); ctx.lineTo(midX2, py2 + ph - 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px + 2, midY2); ctx.lineTo(px + pw - 2, midY2); ctx.stroke();
    ctx.fillStyle = COLORS.text; ctx.fillText('PHASE_PORTRAIT', px + 4, py2 + 8);

    const tLen = s.trailFull ? TRAIL_LEN : s.trailIdx;
    if (tLen > 1) {
      const sc = pw * 0.007;
      for (let j = 1; j < tLen; j++) {
        const idx = s.trailFull ? (s.trailIdx + j) % TRAIL_LEN : j;
        const pidx = s.trailFull ? (s.trailIdx + j - 1) % TRAIL_LEN : j - 1;
        const age = j / tLen;
        ctx.strokeStyle = s.trailX[idx] > 0 
            ? `rgba(${COLORS.trailPositive},${age * 0.5})` 
            : `rgba(${COLORS.trailNegative},${age * 0.5})`;
        ctx.beginPath();
        ctx.moveTo(midX2 + s.trailX[pidx] * sc * 1.5, midY2 - s.trailY[pidx] * sc);
        ctx.lineTo(midX2 + s.trailX[idx] * sc * 1.5, midY2 - s.trailY[idx] * sc);
        ctx.stroke();
      }
    }
  };

  useEffect(() => {
    let lastTime = 0;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: false });

    const frame = (time) => {
      const s = state.current;
      const p = params.current;
      
      if (playingRef.current) {
        if (!lastTime) lastTime = time;
        s.elapsedTime += (time - lastTime);
        lastTime = time;

        for (let i = 0; i < p.speed; i++) {
          rungeKuttaStep(s, p, DT);
          s.wheelAngle += s.lx * DT * 0.3;
        }

        const sSign = Math.sign(s.lx);
        if (s.lastSign !== 0 && sSign !== 0 && sSign !== s.lastSign) s.reversals++;
        if (sSign !== 0) s.lastSign = sSign;
        
        s.omegaHist[s.histIdx] = s.lx;
        s.trailX[s.trailIdx] = s.lx;
        s.trailY[s.trailIdx] = s.ly;
        
        s.histIdx = (s.histIdx + 1) % HIST_LEN;
        s.trailIdx = (s.trailIdx + 1) % TRAIL_LEN;
        if (s.histIdx === 0) s.histFull = true;
        if (s.trailIdx === 0) s.trailFull = true;
        
        updateStatsUI(s);
      } else {
        lastTime = 0;
      }

      if (ctx) draw(ctx, canvas.width, canvas.height);
      requestRef.current = requestAnimationFrame(frame);
    };

    requestRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(requestRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="border-2 border-retro-border p-4 bg-black/40 rounded-lg flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="text-[9px] font-black tracking-widest italic uppercase">
          <p className="text-retro-gray mb-1">MALKUS_LORENZ // SYSTEM</p>
          <p className="text-retro-blue">{seed}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPlaying(!playing)} className="text-[8px] font-black border border-retro-border px-2 py-1 hover:bg-white/5 uppercase cursor-pointer">
            {playing ? 'PAUSE' : 'PLAY'}
          </button>
          <button onClick={() => reset()} className="text-[8px] font-black border border-retro-border px-2 py-1 hover:bg-white/5 uppercase cursor-pointer">
            RESET
          </button>
        </div>
      </div>

      <div className="relative w-full bg-retro-bg/50 border border-retro-border rounded overflow-hidden">
        <canvas ref={canvasRef} width={340} height={240} className="w-full h-auto block" />
      </div>

      <div className="grid grid-cols-4 gap-2 pt-4 border-t border-retro-border/30">
        <div className="flex flex-col">
          <span className="text-[6px] font-black text-retro-gray uppercase tracking-widest mb-1">REVERSALS</span>
          <span ref={revRef} className="text-[9px] font-bold text-white tabular-nums">0</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[6px] font-black text-retro-gray uppercase tracking-widest mb-1">ELAPSED</span>
          <span ref={elRef} className="text-[9px] font-bold text-white tabular-nums">00:00</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[6px] font-black text-retro-gray uppercase tracking-widest mb-1">OMEGA</span>
          <span ref={omRef} className="text-[9px] font-bold text-white tabular-nums">0.00</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[6px] font-black text-retro-gray uppercase tracking-widest mb-1">DIR</span>
          <span ref={dirRef} className="text-[9px] font-bold text-white tabular-nums">ST</span>
        </div>
      </div>
    </div>
  );
}
