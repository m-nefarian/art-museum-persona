import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { CanvasPortrait } from '../components/CanvasPortrait';
import { getCompanionById } from '../data/companions';
import { useMuseumStore } from '../store/useMuseumStore';
import { exportShareCard } from '../utils/shareCard';
import { dimensionKeys, generateResultText, mapScoresToBands } from '../utils/personality';

const dimensionLabel = {
  intuition: '直觉',
  control: '控制',
  emotion: '情绪',
  curiosity: '好奇',
  affinity: '亲和'
};

export function ResultScene() {
  const rootRef = useRef<HTMLElement | null>(null);
  const [exporting, setExporting] = useState(false);
  const scores = useMuseumStore((state) => state.scores);
  const selectedCompanionId = useMuseumStore((state) => state.selectedCompanionId);
  const reset = useMuseumStore((state) => state.reset);

  const companion = useMemo(() => getCompanionById(selectedCompanionId), [selectedCompanionId]);
  const mappedScores = useMemo(() => mapScoresToBands(scores), [scores]);
  const result = useMemo(() => generateResultText(mappedScores, companion), [mappedScores, companion]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.28 })
        .fromTo('.resultPortraitPanel', { x: -40, opacity: 0, scale: 0.94 }, { x: 0, opacity: 1, scale: 1, duration: 0.74, ease: 'expo.out' }, 0.1)
        .fromTo('.resultTextPanel > *', { y: 28, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.52 }, 0.28)
        .fromTo('.resultMeter', { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, stagger: 0.06, duration: 0.5, ease: 'power3.out' }, 0.72);
    }, root);

    return () => ctx.revert();
  }, []);

  const handleExport = () => {
    setExporting(true);
    exportShareCard({ result, mappedScores, companion });
    window.setTimeout(() => setExporting(false), 420);
  };

  return (
    <section className="scene resultScene" ref={rootRef}>
      <div className="resultBackdropText" aria-hidden="true">
        RESULT / RESULT / RESULT
      </div>

      <div className="resultPortraitPanel">
        <CanvasPortrait scores={mappedScores} companion={companion} code={result.code} title={result.title} />
      </div>

      <div className="resultTextPanel">
        <span className="resultKicker">PERSONA REPORT</span>
        <h2>{result.title}</h2>
        <p className="resultCode">{result.code}</p>
        <div className="resultDescription">
          {result.description.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        <div className="resultCompanion">
          <span className="miniSilhouette" aria-hidden="true" />
          <div>
            <small>你的共犯</small>
            <strong>{companion.name}</strong>
            <p>{companion.quote}</p>
          </div>
        </div>

        <div className="resultMeters" aria-label="人格维度分数">
          {dimensionKeys.map((key) => (
            <div className="resultMeter" key={key}>
              <span>{dimensionLabel[key]}</span>
              <i>
                <b style={{ width: `${(mappedScores[key] / 4) * 100}%` }} />
              </i>
              <em>{mappedScores[key]}/4</em>
            </div>
          ))}
        </div>

        <div className="keywordRow">
          {result.keywords.map((keyword) => (
            <span key={keyword}>{keyword}</span>
          ))}
        </div>

        <div className="resultActions">
          <button type="button" className="primaryAction" onClick={handleExport} disabled={exporting}>
            {exporting ? '生成中...' : '生成分享卡 / 导出 PNG'}
          </button>
          <button type="button" className="ghostAction" onClick={reset}>
            再次入场
          </button>
        </div>
      </div>
    </section>
  );
}
