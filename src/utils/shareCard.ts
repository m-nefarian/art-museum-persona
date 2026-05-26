import type { Companion } from '../data/companions';
import type { DimensionScores, ResultText } from './personality';

type PortraitParams = {
  scores: DimensionScores;
  companion: Companion;
  code: string;
  title: string;
  phase?: number;
};

type ShareCardParams = {
  result: ResultText;
  mappedScores: DimensionScores;
  companion: Companion;
};

export function drawPortraitToCanvas(canvas: HTMLCanvasElement, params: PortraitParams) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  drawPortrait(ctx, canvas.width, canvas.height, params);
}

export function exportShareCard({ result, mappedScores, companion }: ShareCardParams) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  drawShareBackground(ctx, width, height, companion);

  ctx.save();
  roundedRect(ctx, 86, 134, width - 172, height - 268, 46);
  ctx.clip();
  ctx.fillStyle = 'rgba(6, 4, 8, 0.84)';
  ctx.fillRect(86, 134, width - 172, height - 268);
  drawSpeedLines(ctx, width, height, 0.18, companion.palette.secondary);
  ctx.restore();

  ctx.save();
  ctx.translate(118, 178);
  ctx.fillStyle = companion.palette.accent;
  ctx.font = '700 34px serif';
  ctx.fillText('NIGHT GALLERY REPORT', 0, 0);
  ctx.fillStyle = 'rgba(255,255,255,0.68)';
  ctx.font = '24px sans-serif';
  ctx.fillText('线上美术馆互动人格测试', 0, 44);
  ctx.restore();

  const portraitCanvas = document.createElement('canvas');
  portraitCanvas.width = 760;
  portraitCanvas.height = 880;
  drawPortraitToCanvas(portraitCanvas, {
    scores: mappedScores,
    companion,
    code: result.code,
    title: result.title,
    phase: 0.36
  });

  ctx.save();
  roundedRect(ctx, 160, 326, 760, 880, 38);
  ctx.clip();
  ctx.drawImage(portraitCanvas, 160, 326, 760, 880);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = companion.palette.accent;
  ctx.lineWidth = 5;
  roundedRect(ctx, 160, 326, 760, 880, 38);
  ctx.stroke();
  ctx.restore();

  drawCompanionSilhouette(ctx, 748, 1144, 1.55, companion);

  ctx.save();
  ctx.fillStyle = '#fff8e8';
  ctx.font = '900 72px serif';
  wrapText(ctx, result.title, 118, 1348, 790, 84);

  ctx.fillStyle = companion.palette.secondary;
  ctx.font = '900 42px sans-serif';
  ctx.fillText(result.code, 118, 1516);

  ctx.fillStyle = 'rgba(255,255,255,0.78)';
  ctx.font = '30px sans-serif';
  wrapText(ctx, `${companion.name}：${companion.tagline}`, 118, 1584, 760, 44);

  ctx.fillStyle = companion.palette.accent;
  ctx.font = '700 28px sans-serif';
  ctx.fillText(`关键词 / ${result.keywords.join(' · ')}`, 118, 1718);

  ctx.fillStyle = 'rgba(255,255,255,0.52)';
  ctx.font = '24px sans-serif';
  ctx.fillText('保存这张预告函，在下一次闭馆后重新入场。', 118, 1782);
  ctx.restore();

  drawNoise(ctx, width, height, 3600, 0.12, 11);

  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = `night-gallery-${result.code}.png`;
  link.click();
}

function drawPortrait(ctx: CanvasRenderingContext2D, width: number, height: number, params: PortraitParams) {
  const { scores, companion, code, title, phase = 0 } = params;
  const seed = hashString(`${code}-${companion.id}-${title}`);
  const random = mulberry32(seed);
  const centerX = width / 2;
  const centerY = height / 2;
  const maxBand = Math.max(1, scores.intuition + scores.control + scores.emotion + scores.curiosity + scores.affinity);

  ctx.clearRect(0, 0, width, height);

  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#040205');
  bg.addColorStop(0.34, companion.palette.primary);
  bg.addColorStop(0.72, '#170308');
  bg.addColorStop(1, companion.palette.secondary);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  const halo = ctx.createRadialGradient(centerX, height * 0.38, 20, centerX, height * 0.42, width * 0.64);
  halo.addColorStop(0, withAlpha(companion.palette.accent, 0.76));
  halo.addColorStop(0.36, withAlpha(companion.palette.secondary, 0.22));
  halo.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, width, height);

  drawSpeedLines(ctx, width, height, 0.2 + scores.curiosity * 0.035, companion.palette.accent);

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(-0.18 + scores.control * 0.035 + Math.sin(phase) * 0.025);
  ctx.globalAlpha = 0.82;
  ctx.fillStyle = withAlpha('#fff8e8', 0.72);
  polygon(ctx, [
    [-width * 0.42, -height * 0.24],
    [width * 0.34, -height * 0.34],
    [width * 0.44, height * 0.18],
    [-width * 0.32, height * 0.34]
  ]);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(centerX, centerY + height * 0.02);
  ctx.rotate(0.24 - scores.intuition * 0.04 + Math.cos(phase * 0.7) * 0.02);
  ctx.fillStyle = withAlpha(companion.palette.secondary, 0.82);
  polygon(ctx, [
    [-width * 0.34, -height * 0.28],
    [width * 0.16, -height * 0.36],
    [width * 0.38, height * 0.24],
    [-width * 0.12, height * 0.36]
  ]);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(centerX, centerY - height * 0.02);
  const maskGradient = ctx.createLinearGradient(-width * 0.24, -height * 0.2, width * 0.24, height * 0.24);
  maskGradient.addColorStop(0, '#070407');
  maskGradient.addColorStop(0.5, withAlpha(companion.palette.accent, 0.95));
  maskGradient.addColorStop(1, '#12050a');
  ctx.fillStyle = maskGradient;
  ctx.beginPath();
  ctx.moveTo(0, -height * 0.28);
  ctx.bezierCurveTo(width * 0.25, -height * 0.25, width * 0.31, height * 0.02, width * 0.18, height * 0.24);
  ctx.bezierCurveTo(width * 0.08, height * 0.39, -width * 0.1, height * 0.39, -width * 0.2, height * 0.22);
  ctx.bezierCurveTo(-width * 0.32, height * 0.01, -width * 0.26, -height * 0.25, 0, -height * 0.28);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#080509';
  ctx.lineWidth = 12 + scores.control * 2;
  ctx.beginPath();
  ctx.moveTo(-width * 0.17, -height * 0.04);
  ctx.quadraticCurveTo(-width * 0.07, -height * 0.1, width * 0.03, -height * 0.02);
  ctx.moveTo(width * 0.05, -height * 0.02);
  ctx.quadraticCurveTo(width * 0.14, -height * 0.11, width * 0.23, -height * 0.04);
  ctx.stroke();

  ctx.strokeStyle = withAlpha('#fff8e8', 0.66);
  ctx.lineWidth = 5 + scores.emotion;
  ctx.beginPath();
  ctx.arc(0, height * 0.05, width * 0.16 + scores.affinity * 9, 0.18 + phase * 0.05, Math.PI - 0.18);
  ctx.stroke();
  ctx.restore();

  const arcCount = 4 + scores.intuition + scores.curiosity;
  for (let i = 0; i < arcCount; i += 1) {
    const radius = width * (0.18 + i * 0.038 + random() * 0.02);
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(random() * Math.PI + phase * 0.06);
    ctx.strokeStyle = i % 2 ? withAlpha(companion.palette.accent, 0.55) : withAlpha('#fff8e8', 0.42);
    ctx.lineWidth = 2 + random() * 5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, random() * Math.PI, random() * Math.PI + Math.PI * (0.4 + scores.emotion * 0.08));
    ctx.stroke();
    ctx.restore();
  }

  const shardCount = 18 + maxBand * 3;
  for (let i = 0; i < shardCount; i += 1) {
    const x = random() * width;
    const y = random() * height;
    const size = 14 + random() * (34 + scores.curiosity * 5);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(random() * Math.PI + phase * 0.08);
    ctx.globalAlpha = 0.18 + random() * 0.5;
    ctx.fillStyle = random() > 0.62 ? companion.palette.accent : random() > 0.36 ? companion.palette.secondary : '#fff8e8';
    polygon(ctx, [
      [0, -size],
      [size * (0.3 + random() * 0.6), size * 0.4],
      [-size * (0.4 + random() * 0.5), size * 0.62]
    ]);
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.strokeStyle = withAlpha('#ffffff', 0.18 + scores.emotion * 0.035);
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 18; i += 1) {
    const y = (height / 18) * i + Math.sin(phase + i) * 12;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y - 90 + random() * 180);
    ctx.stroke();
  }
  ctx.restore();

  drawNoise(ctx, width, height, 1800, 0.16, seed);

  ctx.save();
  ctx.fillStyle = 'rgba(255, 248, 232, 0.78)';
  ctx.font = `${Math.max(20, width * 0.038)}px serif`;
  ctx.fillText(title, width * 0.075, height * 0.1);
  ctx.fillStyle = withAlpha(companion.palette.accent, 0.78);
  ctx.font = `${Math.max(16, width * 0.03)}px monospace`;
  ctx.fillText(code, width * 0.075, height * 0.15);
  ctx.restore();
}

function drawShareBackground(ctx: CanvasRenderingContext2D, width: number, height: number, companion: Companion) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#050307');
  gradient.addColorStop(0.45, companion.palette.primary);
  gradient.addColorStop(1, '#160106');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = companion.palette.secondary;
  ctx.globalAlpha = 0.72;
  ctx.beginPath();
  ctx.moveTo(0, 246);
  ctx.lineTo(width, 82);
  ctx.lineTo(width, 318);
  ctx.lineTo(0, 472);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawCompanionSilhouette(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  companion: Companion
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = withAlpha(companion.palette.primary, 0.92);
  ctx.strokeStyle = companion.palette.accent;
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.moveTo(-92, -148);
  ctx.lineTo(90, -176);
  ctx.lineTo(116, -124);
  ctx.lineTo(-112, -104);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(0, -52, 58, 78, -0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-136, 128);
  ctx.bezierCurveTo(-94, 18, 92, 8, 142, 128);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = withAlpha(companion.palette.secondary, 0.58);
  ctx.beginPath();
  ctx.arc(-22, -62, 8, 0, Math.PI * 2);
  ctx.arc(28, -64, 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawSpeedLines(ctx: CanvasRenderingContext2D, width: number, height: number, alpha: number, color: string) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  for (let i = 0; i < 44; i += 1) {
    const y = (height / 44) * i;
    const offset = (i % 5) * 42;
    ctx.beginPath();
    ctx.moveTo(-120 + offset, y + 80);
    ctx.lineTo(width * 0.64 + offset, y - 30);
    ctx.stroke();
  }
  ctx.restore();
}

function drawNoise(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number,
  alpha: number,
  seed: number
) {
  const random = mulberry32(seed + 99);
  ctx.save();
  ctx.globalAlpha = alpha;
  for (let i = 0; i < amount; i += 1) {
    const value = Math.floor(random() * 255);
    ctx.fillStyle = `rgb(${value}, ${value}, ${value})`;
    ctx.fillRect(random() * width, random() * height, 1 + random() * 2, 1 + random() * 2);
  }
  ctx.restore();
}

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function polygon(ctx: CanvasRenderingContext2D, points: Array<[number, number]>) {
  ctx.beginPath();
  points.forEach(([x, y], index) => {
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const chars = text.split('');
  let line = '';
  let currentY = y;

  chars.forEach((char) => {
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = char;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  });

  if (line) ctx.fillText(line, x, currentY);
}

function withAlpha(hex: string, alpha: number) {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return hex;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number) {
  return function random() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
