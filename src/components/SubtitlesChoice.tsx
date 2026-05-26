import type { CSSProperties } from 'react';
import type { ArtworkOption } from '../data/artworks';

interface SubtitlesChoiceProps {
  options: ArtworkOption[];
  disabled?: boolean;
  onSelect: (option: ArtworkOption) => void;
}

export function SubtitlesChoice({ options, disabled = false, onSelect }: SubtitlesChoiceProps) {
  return (
    <div className="subtitlesChoice" role="group" aria-label="选择你的反应">
      {options.map((option, index) => (
        <button
          className="subtitleButton"
          key={option.id}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(option)}
          style={{ '--delay': `${index * 0.08}s` } as CSSProperties}
        >
          <span className="subtitleIndex">0{index + 1}</span>
          <span className="subtitleLabel">{option.label}</span>
          <span className="subtitleLine">{option.line}</span>
        </button>
      ))}
    </div>
  );
}
