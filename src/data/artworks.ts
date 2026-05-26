import type { DimensionScores } from '../utils/personality';

export type ArtworkVariant = 'lens' | 'crane' | 'mask';

export interface ArtworkOption {
  id: string;
  label: string;
  line: string;
  delta: Partial<DimensionScores>;
}

export interface ArtworkNode {
  id: string;
  no: string;
  title: string;
  subtitle: string;
  variant: ArtworkVariant;
  curatorLine: string;
  options: ArtworkOption[];
}

export const artworks: ArtworkNode[] = [
  {
    id: 'scarlet-lens',
    no: '01',
    title: '赤之盗镜',
    subtitle: '红光把所有出口都伪装成入口。',
    variant: 'lens',
    curatorLine: '第一幅画在眨眼。它问你：看见真相之前，要不要先相信预感？',
    options: [
      {
        id: 'follow-red-signal',
        label: '跟随红光，先行动再解释',
        line: '“预告函已经寄出，答案会追上我。”',
        delta: { intuition: 2, emotion: 1, curiosity: 1 }
      },
      {
        id: 'count-cracks',
        label: '数清裂纹，等机关露出节奏',
        line: '“所有魔术都有缝，只是观众太急。”',
        delta: { control: 2, curiosity: 1, affinity: -1 }
      }
    ]
  },
  {
    id: 'paper-crane-corridor',
    no: '02',
    title: '纸鹤回廊',
    subtitle: '白色折线在夜里练习逃亡。',
    variant: 'crane',
    curatorLine: '第二幅画没有人物，只有一阵折好的风。你要把它交给谁？',
    options: [
      {
        id: 'send-message',
        label: '把纸鹤放飞，给未知的同伴',
        line: '“真正的密道，通常从信任开始。”',
        delta: { affinity: 2, emotion: 1, intuition: 1 }
      },
      {
        id: 'keep-map',
        label: '拆开纸鹤，记住里面的地图',
        line: '“浪漫可以稍后，路线必须现在。”',
        delta: { control: 2, curiosity: 1, emotion: -1 }
      }
    ]
  },
  {
    id: 'golden-mask',
    no: '03',
    title: '金色假面',
    subtitle: '它只在你不看它的时候转身。',
    variant: 'mask',
    curatorLine: '第三幅画递来一张假面。戴上它，你会隐身；摘下它，你会被记住。',
    options: [
      {
        id: 'wear-mask',
        label: '戴上假面，完成无声潜入',
        line: '“名字是负担，剪影才是通行证。”',
        delta: { control: 1, intuition: 1, curiosity: 2 }
      },
      {
        id: 'remove-mask',
        label: '摘下面具，让心跳成为证词',
        line: '“被看见不是失败，是另一种开锁。”',
        delta: { emotion: 2, affinity: 2, control: -1 }
      }
    ]
  }
];
