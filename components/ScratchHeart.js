"use client";

import { useEffect, useRef, useState } from "react";
import { burstConfetti } from "./effects";

const W = 290;
const H = 262;

// Gold-glitter heart that guests scratch away to reveal the date.
export default function ScratchHeart({ children, onReveal }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [started, setStarted] = useState(false);
  const drawing = useRef(false);
  const last = useRef(null);
  const moves = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);

    const g = ctx.createRadialGradient(W * 0.4, H * 0.35, 10, W / 2, H / 2, W * 0.7);
    g.addColorStop(0, "#f3e1b0");
    g.addColorStop(0.45, "#d6b26a");
    g.addColorStop(1, "#a9823f");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    for (let i = 0; i < 1400; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      const r = Math.random() * 1.6 + 0.2;
      ctx.fillStyle = Math.random() < 0.6 ? `rgba(255,248,220,${0.4 + Math.random() * 0.6})` : `rgba(120,88,30,${Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.ellipse(W * 0.32, H * 0.28, 50, 26, -0.5, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const point = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * W, y: ((e.clientY - rect.top) / rect.height) * H };
  };

  const scratch = (p) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 40;
    ctx.beginPath();
    const from = last.current || p;
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    if (++moves.current % 10 === 0) checkProgress();
  };

  const checkProgress = () => {
    const canvas = canvasRef.current;
    const data = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 64) {
      total++;
      if (data[i] < 100) clear++;
    }
    // The heart clip hides the corners, so ~35% of the rectangle is plenty.
    if (clear / total > 0.35) finish();
  };

  const finish = () => {
    if (revealed) return;
    setRevealed(true);
    burstConfetti(wrapRef.current);
    navigator.vibrate?.(60);
    onReveal?.();
  };

  return (
    <div className="scratch">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
          <path
            transform="scale(0.01 0.011)"
            d="M50 89 C20 66 0 47 0 26 C0 11 12 0 27 0 C38 0 46 7 50 15 C54 7 62 0 73 0 C88 0 100 11 100 26 C100 47 80 66 50 89Z"
          />
        </clipPath>
      </svg>
      <div className={`heart ${revealed ? "done" : ""}`} ref={wrapRef} style={{ width: `min(${W}px, 100%)`, aspectRatio: `${W} / ${H}` }}>
        <div className="heart-content">{children}</div>
        <canvas
          ref={canvasRef}
          className="scratch-canvas"
          style={{ width: "100%", height: "100%" }}
          onPointerDown={(e) => {
            drawing.current = true;
            setStarted(true);
            e.currentTarget.setPointerCapture(e.pointerId);
            last.current = null;
            scratch(point(e));
          }}
          onPointerMove={(e) => drawing.current && scratch(point(e))}
          onPointerUp={() => {
            drawing.current = false;
            checkProgress();
          }}
          onPointerCancel={() => (drawing.current = false)}
        />
        {!started && (
          <div className="scratch-hint" aria-hidden="true">
            <span className="finger" />
          </div>
        )}
      </div>
      {!revealed && (
        <button type="button" className="link-btn" onClick={finish}>
          or tap here to reveal
        </button>
      )}
    </div>
  );
}
