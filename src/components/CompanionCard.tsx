import type { CSSProperties } from 'react';
import type { Companion } from '../data/companions';

interface CompanionCardProps {
  companion: Companion;
  disabled?: boolean;
  onChoose: (id: string) => void;
}

export function CompanionCard({ companion, disabled = false, onChoose }: CompanionCardProps) {
  return (
    <button
      type="button"
      className="companionCard"
      data-companion-id={companion.id}
      disabled={disabled}
      onClick={() => onChoose(companion.id)}
      style={
        {
          '--companion-primary': companion.palette.primary,
          '--companion-secondary': companion.palette.secondary,
          '--companion-accent': companion.palette.accent
        } as CSSProperties
      }
    >
      <span className="companionLight" />
      <span className="companionSilhouette" aria-hidden="true">
        <span className="silhouetteHat" />
        <span className="silhouetteHead" />
        <span className="silhouetteBody" />
      </span>
      <span className="companionMeta">
        <span className="companionAlias">{companion.alias}</span>
        <strong>{companion.name}</strong>
        <small>{companion.quote}</small>
      </span>
    </button>
  );
}
