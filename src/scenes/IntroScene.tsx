import { useLayoutEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import { gsap } from 'gsap';
import { useMuseumStore } from '../store/useMuseumStore';

export function IntroScene() {
  const rootRef = useRef<HTMLElement | null>(null);
  const finishIntro = useMuseumStore((state) => state.finishIntro);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: finishIntro });
      timelineRef.current = tl;

      tl.fromTo(root, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 })
        .fromTo('.introGate', { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.8, ease: 'power3.out' }, 0.1)
        .fromTo('.introShard', { y: 80, rotate: -18, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, stagger: 0.05, duration: 0.62, ease: 'back.out(1.8)' }, 0.28)
        .fromTo('.introKicker', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.65)
        .fromTo('.introTitle span', { yPercent: 120 }, { yPercent: 0, duration: 0.86, stagger: 0.06, ease: 'expo.out' }, 0.88)
        .fromTo('.introCaption', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.18 }, 1.7)
        .to('.introFlash', { opacity: 0.86, duration: 0.06 }, 3.45)
        .to('.introFlash', { opacity: 0, duration: 0.28 }, 3.52)
        .to('.introGate', { scale: 1.45, y: -80, opacity: 0.45, duration: 0.9, ease: 'power3.inOut' }, 3.48)
        .to(root, { autoAlpha: 0, duration: 0.4 }, 4.2);
    }, root);

    return () => {
      timelineRef.current?.kill();
      ctx.revert();
    };
  }, [finishIntro]);

  const handleSkip = () => {
    timelineRef.current?.kill();
    finishIntro();
  };

  return (
    <section className="scene introScene" ref={rootRef}>
      <button type="button" className="skipButton" onClick={handleSkip}>
        跳过开场
      </button>
      <div className="introFlash" />
      <div className="introGate" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="introShards" aria-hidden="true">
        {Array.from({ length: 9 }).map((_, index) => (
          <i key={index} className="introShard" style={{ '--i': index } as CSSProperties} />
        ))}
      </div>
      <div className="introCopy">
        <p className="introKicker">閉館後 / 00:00 / 予告状</p>
        <h1 className="introTitle" aria-label="夜廊盗影">
          {'夜廊盗影'.split('').map((char) => (
            <span key={char}>{char}</span>
          ))}
        </h1>
        <p className="introCaption">你收到一封没有署名的展览邀请。</p>
        <p className="introCaption">三幅画、三次停顿、一次人格盗取。</p>
        <p className="introCaption isRed">请勿相信墙上的出口。</p>
      </div>
    </section>
  );
}
