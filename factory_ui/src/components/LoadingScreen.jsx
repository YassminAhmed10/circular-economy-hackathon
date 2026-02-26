import React, { useEffect, useRef } from 'react';

/**
 * LoadingScreen — ECOV liquid fill (left → right) using Canvas
 *
 * Props:
 *   onDone  — called when animation finishes
 *   lang    — 'ar' | 'en'
 */
const LoadingScreen = ({ onDone, lang = 'ar' }) => {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  const DURATION = 7000;   // ms — duration of the fill
  const HOLD     = 1200;   // ms — pause at full before onDone()
  const FONT_STR = '900 118px Cairo, Arial Black, sans-serif';
  const TEXT     = 'ECOV';

  const subtitle = lang === 'ar' ? 'منصة الاقتصاد الدائري' : 'circular economy platform';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const TEXT_X = W / 2;
    const TEXT_Y = H / 2 + 8;

    let startTime = null;
    let holdStart = null;
    let phase     = 'filling';
    let waveOff   = 0;

    const ease = (t) =>
      t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;

    const drawFrame = (ts) => {
      if (!startTime) startTime = ts;
      const elapsed  = ts - startTime;
      const raw      = Math.min(elapsed / DURATION, 1);
      const progress = ease(raw);
      const fillX    = progress * W;
      waveOff       += 0.03;

      ctx.clearRect(0, 0, W, H);

      // ── Offscreen liquid ──────────────────────────────────────────────────
      const offLiq = new OffscreenCanvas(W, H);
      const ol     = offLiq.getContext('2d');

      const grad = ol.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0,   '#34d399');
      grad.addColorStop(0.5, '#10b981');
      grad.addColorStop(1,   '#059669');
      ol.fillStyle = grad;
      ol.fillRect(0, 0, fillX, H);

      // Wavy edge
      ol.beginPath();
      ol.moveTo(fillX, 0);
      for (let y = 0; y <= H; y++) {
        ol.lineTo(fillX + Math.sin(y * 0.07 + waveOff) * 6, y);
      }
      ol.lineTo(fillX + 12, H);
      ol.lineTo(0, H);
      ol.closePath();
      ol.fillStyle = 'rgba(110,231,183,0.35)';
      ol.fill();

      // Shimmer
      if (fillX > 24) {
        const sh = ol.createLinearGradient(12, 0, 30, 0);
        sh.addColorStop(0,   'rgba(255,255,255,0)');
        sh.addColorStop(0.5, 'rgba(255,255,255,0.18)');
        sh.addColorStop(1,   'rgba(255,255,255,0)');
        ol.fillStyle = sh;
        ol.fillRect(10, 0, 22, H);
      }

      // ── Text mask ─────────────────────────────────────────────────────────
      const offMask = new OffscreenCanvas(W, H);
      const om = offMask.getContext('2d');
      om.font = FONT_STR;
      om.textAlign = 'center';
      om.textBaseline = 'middle';
      om.fillStyle = '#fff';
      om.fillText(TEXT, TEXT_X, TEXT_Y);

      ol.globalCompositeOperation = 'destination-in';
      ol.drawImage(offMask, 0, 0);

      // ── Draw to main canvas ───────────────────────────────────────────────

      // 1. Dark tint (empty glass)
      ctx.save();
      ctx.font = FONT_STR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillText(TEXT, TEXT_X, TEXT_Y);
      ctx.restore();

      // 2. Liquid
      ctx.drawImage(offLiq, 0, 0);

      // 3. Stroke outline (glass wall)
      ctx.save();
      ctx.font = FONT_STR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = raw >= 1 ? '#34d399' : 'rgba(52,211,153,0.8)';
      ctx.lineWidth = 2.5;
      ctx.strokeText(TEXT, TEXT_X, TEXT_Y);
      ctx.restore();

      // ── Phase ─────────────────────────────────────────────────────────────
      if (phase === 'filling') {
        if (raw < 1) {
          rafRef.current = requestAnimationFrame(drawFrame);
        } else {
          phase = 'holding';
          holdStart = ts;
          rafRef.current = requestAnimationFrame(drawFrame);
        }
      } else if (phase === 'holding') {
        if (ts - holdStart < HOLD) {
          rafRef.current = requestAnimationFrame(drawFrame);
        } else {
          phase = 'done';
          onDone && onDone();
        }
      }
    };

    document.fonts.ready.then(() => {
      rafRef.current = requestAnimationFrame(drawFrame);
    });

    return () => cancelAnimationFrame(rafRef.current);
  }, [onDone]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'linear-gradient(135deg, #0b2e1f 0%, #0f1a12 60%, #1a4d2e 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '1.5rem', fontFamily: "'Cairo', sans-serif",
    }}>
      <canvas
        ref={canvasRef}
        width={600}
        height={140}
        style={{ display: 'block', maxWidth: '90vw' }}
      />
      <p style={{
        color: '#4d9e6a', fontSize: '1rem',
        letterSpacing: '3px', textTransform: 'uppercase',
        animation: 'fadeUp 0.8s ease 0.5s both',
      }}>
        {subtitle}
      </p>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;