import { useEffect, useRef } from 'react';
import type { Companion } from '../data/companions';
import type { DimensionScores } from '../utils/personality';
import { drawPortraitToCanvas } from '../utils/shareCard';

interface CanvasPortraitProps {
  scores: DimensionScores;
  companion: Companion;
  code: string;
  title: string;
}

export function CanvasPortrait({ scores, companion, code, title }: CanvasPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let raf = 0;
    let last = 0;

    const render = (time: number) => {
      if (time - last > 80) {
        drawPortraitToCanvas(canvas, {
          scores,
          companion,
          code,
          title,
          phase: time / 1000
        });
        last = time;
      }
      raf = window.requestAnimationFrame(render);
    };

    raf = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(raf);
  }, [scores, companion, code, title]);

  return <canvas ref={canvasRef} className="portraitCanvas" width={720} height={880} aria-label="动态生成的人格艺术肖像" />;
}
