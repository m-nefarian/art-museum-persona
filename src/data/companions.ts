export interface Companion {
  id: string;
  name: string;
  alias: string;
  quote: string;
  tagline: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const companions: Companion[] = [
  {
    id: 'karasu',
    name: '鸦羽',
    alias: '黑翼共犯',
    quote: '“我负责熄灯，你负责偷走月亮。”',
    tagline: '越接近黑暗，轮廓越锋利。',
    palette: {
      primary: '#0b0a12',
      secondary: '#c40018',
      accent: '#f4c56a'
    }
  },
  {
    id: 'kagami',
    name: '镜花',
    alias: '镜中证人',
    quote: '“别怕，真正的你会从裂缝里反光。”',
    tagline: '让破碎成为第二张脸。',
    palette: {
      primary: '#f7f3e8',
      secondary: '#7b0d18',
      accent: '#111018'
    }
  },
  {
    id: 'kitsune',
    name: '赤狐',
    alias: '红线向导',
    quote: '“跟紧我，迷路也是一种捷径。”',
    tagline: '所有弯路都藏着火光。',
    palette: {
      primary: '#8b0614',
      secondary: '#f1b85b',
      accent: '#fff8e8'
    }
  }
];

export function getCompanionById(id?: string) {
  return companions.find((companion) => companion.id === id) ?? companions[0];
}
