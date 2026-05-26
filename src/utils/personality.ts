import { archetypeWords, dimensionAliases, moodWords, titleLeads } from '../data/resultText';
import type { Companion } from '../data/companions';

export const dimensionKeys = ['intuition', 'control', 'emotion', 'curiosity', 'affinity'] as const;

export type DimensionKey = (typeof dimensionKeys)[number];
export type DimensionScores = Record<DimensionKey, number>;

export interface ResultText {
  title: string;
  code: string;
  description: string[];
  keywords: string[];
  dominant: DimensionKey;
  secondary: DimensionKey;
}

export function createEmptyScores(): DimensionScores {
  return {
    intuition: 0,
    control: 0,
    emotion: 0,
    curiosity: 0,
    affinity: 0
  };
}

export function addScores(base: DimensionScores, delta: Partial<DimensionScores>): DimensionScores {
  const next = { ...base };
  dimensionKeys.forEach((key) => {
    next[key] += delta[key] ?? 0;
  });
  return next;
}

export function mapScoresToBands(scores: DimensionScores): DimensionScores {
  const mapped = createEmptyScores();
  dimensionKeys.forEach((key) => {
    const raw = scores[key];
    mapped[key] = clamp(Math.round(((raw + 2) / 7) * 4), 0, 4);
  });
  return mapped;
}

export function createPersonalityCode(mapped: DimensionScores): string {
  return `I${mapped.intuition}-C${mapped.control}-E${mapped.emotion}-U${mapped.curiosity}-A${mapped.affinity}`;
}

export function generateResultText(mapped: DimensionScores, companion: Companion): ResultText {
  const ranked = [...dimensionKeys].sort((a, b) => mapped[b] - mapped[a]);
  const dominant = ranked[0];
  const secondary = ranked[1];
  const code = createPersonalityCode(mapped);
  const power = mapped[dominant];
  const hinge = mapped[secondary];

  const lead = pick(titleLeads[dominant], power + hinge + companion.name.length);
  const archetype = pick(archetypeWords[secondary], power * 2 + hinge + companion.id.length);
  const mood = pick(moodWords, mapped.emotion + mapped.curiosity + companion.quote.length);
  const title = `${lead}的${archetype}`;

  const relation = mapped.affinity >= 3 ? '你会主动向陌生的光靠近' : mapped.affinity <= 1 ? '你更习惯把真心藏在展柜背面' : '你在亲近与退后之间保持漂亮的距离';
  const method = mapped.control >= 3 ? '每一步都像预先标过刻度' : mapped.control <= 1 ? '你允许混乱先于答案出现' : '你会给冲动留出一条可撤退的暗道';
  const drive = mapped.curiosity >= 3 ? '越被禁止的门牌越容易点亮你的眼睛' : mapped.curiosity <= 1 ? '你只在确信安全时打开新的抽屉' : '你对未知保持克制但不冷淡';

  return {
    title,
    code,
    dominant,
    secondary,
    description: [
      `你像一位在闭馆后行动的观展者，${method}。`,
      `${relation}，同时让${companion.name}替你保存那枚不能示人的线索。`,
      `${drive}；这让你的画像呈现出“${mood}”的边缘光。`
    ],
    keywords: [dimensionAliases[dominant], dimensionAliases[secondary], companion.alias, mood]
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function pick<T>(items: readonly T[], index: number): T {
  return items[Math.abs(index) % items.length];
}
