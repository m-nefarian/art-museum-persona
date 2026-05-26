import type { CSSProperties, ReactNode } from 'react';

interface StageProps {
  children: ReactNode;
}

export function Stage({ children }: StageProps) {
  return (
    <main className="stage" aria-live="polite">
      <div className="ambientGradient" />
      <div className="cinemaNoise" />
      <div className="particleField" aria-hidden="true">
        {Array.from({ length: 16 }).map((_, index) => (
          <span key={index} style={{ '--i': index } as CSSProperties} />
        ))}
      </div>
      {children}
    </main>
  );
}
