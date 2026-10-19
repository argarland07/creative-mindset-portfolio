import { useState, useEffect, useRef } from 'react';
import { Sparkles, Waves, Radio, Box } from 'lucide-react';

export default function ProjectInteractiveWidget({ project }) {
  const canvasRef = useRef(null);
  const [bloomSpread, setBloomSpread] = useState(65);
  const [pulseCount, setPulseCount] = useState(3);
  const [audioFreq, setAudioFreq] = useState(440);

  // Canvas visualizer for the modal
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let t = 0;

    const render = () => {
      t += 0.03;
      const w = canvas.width = canvas.clientWidth * window.devicePixelRatio;
      const h = canvas.height = canvas.clientHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;

      ctx.clearRect(0, 0, cw, ch);

      if (project.interactiveType === 'particles') {
        // Strange attractor chaotic orbital ribbon
        ctx.strokeStyle = project.colorAccent;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        const centerX = cw / 2;
        const centerY = ch / 2;
        const radius = Math.min(cw, ch) * 0.35;

        for (let i = 0; i < 360; i += 2) {
          const angle = (i * Math.PI) / 180;
          const r = radius * (0.8 + 0.25 * Math.sin(angle * 5 + t) * Math.cos(angle * 3 + t * 0.7));
          const x = centerX + Math.cos(angle) * r;
          const y = centerY + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();

        // Inner glowing core
        const grad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radius * 0.8);
        grad.addColorStop(0, 'rgba(192, 132, 252, 0.45)');
        grad.addColorStop(1, 'rgba(192, 132, 252, 0)');
        ctx.fillStyle = grad;
        ctx.fill();
      } else if (project.interactiveType === 'bubbles') {
        // Bioluminescent underwater pulse rings
        const cx = cw / 2;
        const cy = ch / 2;
        for (let r = 1; r <= pulseCount; r++) {
          const ringRad = ((t * 28 * r) % (cw * 0.45));
          const alpha = Math.max(0, 1 - ringRad / (cw * 0.45));
          ctx.strokeStyle = `rgba(45, 212, 191, ${alpha * 0.7})`;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(cx, cy, ringRad, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Floating plankton sparks
        ctx.fillStyle = '#5eead4';
        for (let i = 0; i < 20; i++) {
          const px = (Math.sin(i * 99 + t * 0.5) * 0.5 + 0.5) * cw;
          const py = (Math.cos(i * 33 + t * 0.3) * 0.5 + 0.5) * ch;
          ctx.beginPath();
          ctx.arc(px, py, 1.5 + Math.sin(t + i), 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (project.interactiveType === 'equalizer') {
        // Frequency wave bars
        const bars = 32;
        const barWidth = cw / bars - 4;
        for (let b = 0; b < bars; b++) {
          const norm = b / bars;
          const barHeight = Math.abs(Math.sin(norm * 6 + t * 2) * Math.cos(t * 1.5 + b)) * (ch * 0.7) + 12;
          const grad = ctx.createLinearGradient(0, ch, 0, ch - barHeight);
          grad.addColorStop(0, '#ef4444');
          grad.addColorStop(0.5, '#f59e0b');
          grad.addColorStop(1, '#fbbf24');
          ctx.fillStyle = grad;
          ctx.fillRect(b * (barWidth + 4) + 4, ch - barHeight, barWidth, barHeight);
        }
      } else {
        // Origami geometry mesh
        const cx = cw / 2;
        const cy = ch / 2;
        const sides = 8;
        const scale = (bloomSpread / 100) * (Math.min(cw, ch) * 0.38);

        ctx.strokeStyle = '#fb7185';
        ctx.lineWidth = 1.8;

        for (let layer = 1; layer <= 3; layer++) {
          ctx.beginPath();
          const layerRad = (scale * layer) / 3;
          const rot = t * 0.5 * (layer % 2 === 0 ? 1 : -1);

          for (let s = 0; s <= sides; s++) {
            const th = (s * 2 * Math.PI) / sides + rot;
            const x = cx + Math.cos(th) * layerRad;
            const y = cy + Math.sin(th) * layerRad;
            if (s === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [project, bloomSpread, pulseCount, audioFreq]);

  return (
    <div className="interactive-widget-container">
      <div className="widget-header">
        <div className="widget-title">
          {project.interactiveType === 'particles' && <Sparkles size={16} />}
          {project.interactiveType === 'bubbles' && <Waves size={16} />}
          {project.interactiveType === 'equalizer' && <Radio size={16} />}
          {project.interactiveType === 'origami' && <Box size={16} />}
          <span>Live Interactive Exploration Sandbox</span>
        </div>
        <span className="live-pill">Real-Time Simulation</span>
      </div>

      <div className="canvas-wrapper">
        <canvas ref={canvasRef} className="widget-canvas" />
      </div>

      <div className="widget-controls">
        {project.interactiveType === 'origami' && (
          <div className="control-row">
            <label>Tessellation Deployment: {bloomSpread}%</label>
            <input
              type="range"
              min="20"
              max="100"
              value={bloomSpread}
              onChange={(e) => setBloomSpread(Number(e.target.value))}
            />
          </div>
        )}

        {project.interactiveType === 'bubbles' && (
          <div className="control-row">
            <label>Bioluminescent Pulse Rings: {pulseCount}</label>
            <input
              type="range"
              min="1"
              max="7"
              value={pulseCount}
              onChange={(e) => setPulseCount(Number(e.target.value))}
            />
          </div>
        )}

        {project.interactiveType === 'equalizer' && (
          <div className="control-row">
            <label>Modulation Frequency: {audioFreq} Hz</label>
            <input
              type="range"
              min="110"
              max="880"
              value={audioFreq}
              onChange={(e) => setAudioFreq(Number(e.target.value))}
            />
          </div>
        )}

        {project.interactiveType === 'particles' && (
          <div className="control-hint">
            <span>✨ Drag or watch harmonic differential harmonics morph organically</span>
          </div>
        )}
      </div>
    </div>
  );
}
