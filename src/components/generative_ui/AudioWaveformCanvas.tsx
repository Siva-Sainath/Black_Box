import React, { useEffect, useRef } from 'react';

interface AudioWaveformCanvasProps {
  isActive: boolean;
  isFlagged?: boolean;
  className?: string;
}

export const AudioWaveformCanvas: React.FC<AudioWaveformCanvasProps> = ({
  isActive,
  isFlagged = false,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      const numBars = 36;
      const barWidth = 3;
      const gap = (width - numBars * barWidth) / (numBars - 1);

      for (let i = 0; i < numBars; i++) {
        let amp = 0.15;
        if (isActive) {
          amp =
            Math.sin(phase + i * 0.35) * 0.35 +
            Math.cos(phase * 1.5 + i * 0.2) * 0.25 +
            Math.sin(phase * 0.8 + i * 0.5) * 0.2 +
            0.2;
          amp = Math.max(0.08, Math.min(0.95, amp));
        }

        const barHeight = height * amp;
        const x = i * (barWidth + gap);
        const y = centerY - barHeight / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isFlagged) {
          gradient.addColorStop(0, '#ff2244');
          gradient.addColorStop(1, '#990011');
        } else if (isActive) {
          gradient.addColorStop(0, '#38bdf8');
          gradient.addColorStop(0.5, '#10b981');
          gradient.addColorStop(1, '#059669');
        } else {
          gradient.addColorStop(0, '#3f3f46');
          gradient.addColorStop(1, '#27272a');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      phase += isActive ? 0.08 : 0.01;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, isFlagged]);

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={38}
      className={`rounded-lg bg-black/60 border border-white/[0.06] ${className}`}
    />
  );
};
