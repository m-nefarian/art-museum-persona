import { useEffect, useLayoutEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { gsap } from 'gsap';
import { artworks } from '../data/artworks';
import { ProceduralArtwork } from '../components/ProceduralArtwork';
import { useMuseumStore } from '../store/useMuseumStore';

export function HallScene() {
  const rootRef = useRef<HTMLElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const currentArtworkIndex = useMuseumStore((state) => state.currentArtworkIndex);
  const isPaused = useMuseumStore((state) => state.isPaused);
  const setPaused = useMuseumStore((state) => state.setPaused);
  const goToChoice = useMuseumStore((state) => state.goToChoice);
  const artwork = artworks[currentArtworkIndex];

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        paused: false,
        onComplete: () => {
          goToChoice();
        }
      });
      timelineRef.current = tl;

      tl.set('.hallCamera', { scale: 1.12, y: 22, filter: 'blur(1px)' })
        .set('.hallFrame', { opacity: 0.22, scale: 0.78 })
        .fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.32 })
        .fromTo('.hallTitleCard', { y: -18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.1)
        .to('.hallCamera', { scale: 1.36, y: -4, filter: 'blur(0px)', duration: 2.65, ease: 'power2.inOut' }, 0.18)
        .to('.corridorWall.left', { xPercent: -8, duration: 2.65, ease: 'power2.inOut' }, 0.18)
        .to('.corridorWall.right', { xPercent: 8, duration: 2.65, ease: 'power2.inOut' }, 0.18)
        .to('.hallFrame.isCurrent', { opacity: 1, scale: 1.08, duration: 1.2, ease: 'power3.out' }, 1.15)
        .to('.hallFrame:not(.isCurrent)', { opacity: 0.08, scale: 0.62, duration: 1, ease: 'power2.out' }, 1.15)
        .fromTo('.nodeStop', { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.32, ease: 'power4.out' }, 2.6)
        .to('.hallFlash', { opacity: 0.92, duration: 0.05 }, 2.95)
        .to('.hallFlash', { opacity: 0, duration: 0.25 }, 3.0)
        .to(root, { autoAlpha: 0, duration: 0.34 }, 3.25);
    }, root);

    return () => {
      timelineRef.current?.kill();
      ctx.revert();
    };
  }, [currentArtworkIndex, goToChoice]);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;
    if (isPaused) timeline.pause();
    else timeline.play();
  }, [isPaused]);

  return (
    <section className="scene hallScene" ref={rootRef}>
      <div className="hallFlash" />
      <div className="hallHud">
        <div className="hallTitleCard">
          <span>Gallery Node / {artwork.no}</span>
          <strong>{artwork.title}</strong>
        </div>
        <button type="button" className="controlPill" onClick={() => setPaused(!isPaused)}>
          {isPaused ? '继续' : '暂停'}
        </button>
      </div>

      <div className="hallCamera">
        <div className="corridorCeiling" />
        <div className="corridorFloor" />
        <div className="corridorWall left" />
        <div className="corridorWall right" />
        <div className="vanishPoint" />

        <div className="hallFrames">
          {artworks.map((item, index) => {
            const offset = index - currentArtworkIndex;
            return (
              <article
                key={item.id}
                className={`hallFrame ${index === currentArtworkIndex ? 'isCurrent' : ''}`}
                style={{ '--offset': offset } as CSSProperties}
              >
                <ProceduralArtwork variant={item.variant} title={item.title} compact />
                <span>{item.no}</span>
              </article>
            );
          })}
        </div>
      </div>

      <div className="nodeStop">
        <span />
        <em>STOP / {artwork.subtitle}</em>
      </div>
      <div className="speedLineOverlay" aria-hidden="true" />
    </section>
  );
}
