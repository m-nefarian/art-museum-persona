import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import type { ArtworkOption } from '../data/artworks';
import { artworks } from '../data/artworks';
import { ProceduralArtwork } from '../components/ProceduralArtwork';
import { SubtitlesChoice } from '../components/SubtitlesChoice';
import { useMuseumStore } from '../store/useMuseumStore';

export function ChoiceScene() {
  const rootRef = useRef<HTMLElement | null>(null);
  const [locked, setLocked] = useState(false);
  const currentArtworkIndex = useMuseumStore((state) => state.currentArtworkIndex);
  const answerChoice = useMuseumStore((state) => state.answerChoice);
  const artwork = artworks[currentArtworkIndex];

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.24 })
        .fromTo('.choiceArtworkWrap', { scale: 1.18, y: 34, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.84, ease: 'expo.out' }, 0.05)
        .fromTo('.choiceMeta > *', { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.5 }, 0.32)
        .fromTo('.subtitleButton', { y: 44, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.52, ease: 'power3.out' }, 0.72);
    }, root);

    return () => ctx.revert();
  }, [currentArtworkIndex]);

  const handleSelect = (option: ArtworkOption) => {
    if (locked) return;
    setLocked(true);

    const root = rootRef.current;
    if (!root) {
      answerChoice(option.delta);
      return;
    }

    gsap
      .timeline({ onComplete: () => answerChoice(option.delta) })
      .to(root.querySelectorAll('.subtitleButton'), { y: 30, opacity: 0, stagger: 0.04, duration: 0.22, ease: 'power2.in' })
      .to(root.querySelector('.choiceArtworkWrap'), { scale: 1.16, rotate: -1.6, duration: 0.26, ease: 'power3.inOut' }, 0.02)
      .to(root.querySelector('.slashWipe'), { xPercent: 120, duration: 0.34, ease: 'power4.inOut' }, 0.12)
      .to(root.querySelector('.choiceFlash'), { opacity: 1, duration: 0.05 }, 0.28)
      .to(root.querySelector('.choiceFlash'), { opacity: 0, duration: 0.18 }, 0.34)
      .to(root, { autoAlpha: 0, duration: 0.16 }, 0.44);
  };

  return (
    <section className="scene choiceScene" ref={rootRef}>
      <div className="choiceFlash" />
      <div className="slashWipe" />
      <div className="choiceFrameGrid" aria-hidden="true" />

      <div className="choiceMeta">
        <span>ART NODE / {artwork.no}</span>
        <h2>{artwork.title}</h2>
        <p>{artwork.curatorLine}</p>
      </div>

      <div className="choiceArtworkWrap">
        <ProceduralArtwork variant={artwork.variant} title={artwork.title} />
        <div className="artworkPlate">
          <span>{artwork.no}</span>
          <strong>{artwork.subtitle}</strong>
        </div>
      </div>

      <SubtitlesChoice options={artwork.options} disabled={locked} onSelect={handleSelect} />
    </section>
  );
}
