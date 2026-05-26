import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { companions } from '../data/companions';
import { CompanionCard } from '../components/CompanionCard';
import { useMuseumStore } from '../store/useMuseumStore';

export function CompanionScene() {
  const rootRef = useRef<HTMLElement | null>(null);
  const [locked, setLocked] = useState(false);
  const selectCompanion = useMuseumStore((state) => state.selectCompanion);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.28 })
        .fromTo('.companionHeading > *', { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.12, duration: 0.48 }, 0.12)
        .fromTo('.companionCard', { y: 60, opacity: 0, rotateX: 12 }, { y: 0, opacity: 1, rotateX: 0, stagger: 0.12, duration: 0.7, ease: 'back.out(1.5)' }, 0.38);
    }, root);

    return () => ctx.revert();
  }, []);

  const handleChoose = (id: string) => {
    if (locked) return;
    setLocked(true);
    const root = rootRef.current;
    if (!root) {
      selectCompanion(id);
      return;
    }

    gsap
      .timeline({ onComplete: () => selectCompanion(id) })
      .to(root.querySelectorAll('.companionCard'), {
        scale: (_index, target) => ((target as HTMLElement).dataset.companionId === id ? 1.04 : 0.88),
        opacity: 0.36,
        stagger: 0.04,
        duration: 0.24
      })
      .to(root.querySelector('.companionSlash'), { xPercent: 115, duration: 0.42, ease: 'power4.inOut' }, 0.12)
      .to(root.querySelector('.companionWhite'), { opacity: 1, duration: 0.06 }, 0.32)
      .to(root, { autoAlpha: 0, duration: 0.24 }, 0.44);
  };

  return (
    <section className="scene companionScene" ref={rootRef}>
      <div className="companionWhite" />
      <div className="companionSlash" />
      <div className="companionHeading">
        <span>FINAL ROOM / COMPANION</span>
        <h2>闭上眼，选择一位共犯</h2>
        <p>他们不会改变你的答案，只会改变你画像里的光。</p>
      </div>
      <div className="companionGrid">
        {companions.map((companion) => (
          <CompanionCard key={companion.id} companion={companion} disabled={locked} onChoose={handleChoose} />
        ))}
      </div>
    </section>
  );
}
