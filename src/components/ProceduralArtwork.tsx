import { useId } from 'react';
import type { ArtworkVariant } from '../data/artworks';

interface ProceduralArtworkProps {
  variant: ArtworkVariant;
  title?: string;
  compact?: boolean;
  className?: string;
}

export function ProceduralArtwork({ variant, title, compact = false, className = '' }: ProceduralArtworkProps) {
  const uid = useId().replace(/:/g, '');
  const viewBox = compact ? '0 0 360 260' : '0 0 720 520';
  const classes = ['proceduralArtwork', `artwork-${variant}`, compact ? 'isCompact' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <svg className={classes} viewBox={viewBox} role="img" aria-label={title ?? '程序化抽象画作'}>
      <defs>
        <linearGradient id={`${uid}-red`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#11080c" />
          <stop offset="0.44" stopColor="#b60018" />
          <stop offset="1" stopColor="#fff1d3" />
        </linearGradient>
        <linearGradient id={`${uid}-white`} x1="0" x2="1" y1="1" y2="0">
          <stop offset="0" stopColor="#07070b" />
          <stop offset="0.55" stopColor="#f8f3e8" />
          <stop offset="1" stopColor="#d4a24c" />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="44%" r="55%">
          <stop offset="0" stopColor="#fff4d8" stopOpacity="0.9" />
          <stop offset="0.36" stopColor="#d50920" stopOpacity="0.52" />
          <stop offset="1" stopColor="#050205" stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}-rough`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.22" />
          </feComponentTransfer>
        </filter>
      </defs>

      <rect width="100%" height="100%" rx={compact ? 12 : 24} fill="#070407" />
      <rect width="100%" height="100%" fill={`url(#${uid}-glow)`} opacity="0.72" />
      {variant === 'lens' && <LensArtwork uid={uid} compact={compact} />}
      {variant === 'crane' && <CraneArtwork uid={uid} compact={compact} />}
      {variant === 'mask' && <MaskArtwork uid={uid} compact={compact} />}
      <rect width="100%" height="100%" filter={`url(#${uid}-rough)`} opacity="0.65" />
    </svg>
  );
}

function LensArtwork({ uid, compact }: { uid: string; compact: boolean }) {
  const scale = compact ? 0.5 : 1;
  return (
    <g transform={`scale(${scale})`}>
      <path d="M60 82 L620 30 L685 168 L110 226 Z" fill={`url(#${uid}-red)`} opacity="0.84" />
      <path d="M84 392 L650 250 L704 394 L168 500 Z" fill="#f7f1e6" opacity="0.9" />
      <circle cx="360" cy="260" r="145" fill="none" stroke="#fff6df" strokeWidth="12" opacity="0.86" />
      <circle cx="360" cy="260" r="72" fill="#050205" stroke="#c8001b" strokeWidth="18" />
      <path d="M190 272 C258 184 450 144 542 246 C464 348 292 362 190 272 Z" fill="none" stroke="#0a0709" strokeWidth="24" opacity="0.78" />
      <path d="M0 160 L240 126 M472 80 L720 12 M42 458 L318 386 M510 438 L720 392" stroke="#f0b65d" strokeWidth="6" opacity="0.78" />
      <g fill="#fff7e6">
        <path d="M98 108 L150 86 L138 146 Z" />
        <path d="M574 104 L634 98 L612 154 Z" />
        <path d="M470 404 L522 384 L540 444 Z" />
      </g>
    </g>
  );
}

function CraneArtwork({ uid, compact }: { uid: string; compact: boolean }) {
  const scale = compact ? 0.5 : 1;
  return (
    <g transform={`scale(${scale})`}>
      <rect x="44" y="44" width="632" height="432" fill="#f5f0e5" opacity="0.94" />
      <path d="M80 150 L220 84 L340 172 L476 92 L646 158" fill="none" stroke="#09070b" strokeWidth="9" />
      <path d="M136 352 L258 214 L372 330 L514 202 L640 360" fill="none" stroke="#b80018" strokeWidth="16" opacity="0.9" />
      <path d="M258 214 L340 172 L372 330 Z" fill={`url(#${uid}-white)`} opacity="0.96" />
      <path d="M372 330 L476 92 L514 202 Z" fill="#111018" opacity="0.94" />
      <path d="M220 84 L258 214 L80 150 Z" fill="#d6a24e" opacity="0.86" />
      <g stroke="#111018" strokeWidth="3" opacity="0.22">
        {Array.from({ length: 11 }).map((_, index) => (
          <path key={index} d={`M${70 + index * 58} 44 L${20 + index * 66} 476`} />
        ))}
      </g>
      <circle cx="560" cy="136" r="38" fill="#b80018" />
      <circle cx="560" cy="136" r="12" fill="#fff8df" />
    </g>
  );
}

function MaskArtwork({ uid, compact }: { uid: string; compact: boolean }) {
  const scale = compact ? 0.5 : 1;
  return (
    <g transform={`scale(${scale})`}>
      <path d="M120 58 L600 72 L650 442 L358 500 L78 430 Z" fill="#0b0910" stroke="#f0bd62" strokeWidth="10" />
      <path d="M212 120 C270 78 446 76 512 124 C548 206 536 330 468 402 C408 460 298 456 246 398 C178 324 176 204 212 120 Z" fill={`url(#${uid}-red)`} />
      <path d="M252 214 C294 184 330 184 360 218 C322 242 288 246 252 214 Z" fill="#08070a" />
      <path d="M398 218 C434 184 478 184 512 214 C474 246 434 244 398 218 Z" fill="#08070a" />
      <path d="M360 236 C330 292 318 340 360 374 C408 340 392 292 360 236 Z" fill="#f8f1dc" opacity="0.82" />
      <path d="M226 144 C280 188 448 188 510 146" fill="none" stroke="#f7ebcc" strokeWidth="7" opacity="0.78" />
      <path d="M220 382 C294 418 432 418 502 380" fill="none" stroke="#09070a" strokeWidth="12" opacity="0.75" />
      <g fill="#f4bd62" opacity="0.9">
        <path d="M124 94 L178 112 L140 152 Z" />
        <path d="M578 106 L642 96 L618 166 Z" />
        <path d="M92 376 L146 352 L156 422 Z" />
      </g>
      <path d="M40 248 H680" stroke="#fff4dc" strokeWidth="4" strokeDasharray="18 20" opacity="0.42" />
    </g>
  );
}
