# 夜廊盗影｜线上美术馆互动人格测试 MVP

一个纯静态、可部署到 GitHub Pages 的 React + Vite + TypeScript 前端项目。项目没有后端、没有数据库、没有远程图片资源，画作、肖像、分享卡全部由 SVG / CSS / Canvas 2D 程序化生成。

## 技术栈

- React + Vite + TypeScript
- GSAP：主时间轴、入场、斜切、闪白、推拉转场
- Zustand：单页状态管理
- Canvas 2D：结果艺术肖像与 PNG 分享卡导出
- CSS：噪点、速度线、光影、字幕式选项、戏剧化 UI

## 本地运行

```bash
npm install
npm run dev
```

开发服务器启动后，按终端提示访问本地地址，通常是：

```bash
http://localhost:5173/
```

## 构建

```bash
npm run build
```

构建完成后会生成 `dist/` 目录。

本项目的 `vite.config.ts` 已设置：

```ts
base: './'
```

因此部署到 `https://用户名.github.io/仓库名/` 这类 GitHub Pages 二级路径时，不会因为资源路径写死为 `/` 而白屏。

## 本地预览构建产物

```bash
npm run preview
```

## 上传到 GitHub

```bash
git init
git add .
git commit -m "init art museum persona mvp"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

## 开启 GitHub Pages

### 方式一：使用 GitHub Actions 自动部署（推荐）

项目已经包含：

```txt
.github/workflows/deploy.yml
```

操作步骤：

1. 将代码推送到 GitHub 的 `main` 分支。
2. 打开仓库页面：`Settings` → `Pages`。
3. 在 `Build and deployment` 中，将 `Source` 选择为 `GitHub Actions`。
4. 回到 `Actions` 页面，等待 `Deploy to GitHub Pages` 工作流完成。
5. 部署完成后访问：

```txt
https://你的用户名.github.io/你的仓库名/
```

### 方式二：手动发布 dist 到 gh-pages 分支

先构建：

```bash
npm run build
```

然后把 `dist/` 的内容发布到 `gh-pages` 分支。一个简单做法：

```bash
# 在项目根目录执行
npm run build
mkdir -p ../museum-dist
cp -R dist/* ../museum-dist/

git checkout --orphan gh-pages
git rm -rf .
cp -R ../museum-dist/* .
touch .nojekyll

git add .
git commit -m "deploy to gh-pages"
git push -f origin gh-pages

git checkout main
```

随后进入仓库：`Settings` → `Pages`，将发布来源设置为：

```txt
Deploy from a branch → gh-pages → /root
```

访问地址同样是：

```txt
https://你的用户名.github.io/你的仓库名/
```

## 项目结构

```txt
project-root/
├─ index.html
├─ package.json
├─ vite.config.ts
├─ tsconfig.json
├─ README.md
├─ .github/
│  └─ workflows/
│     └─ deploy.yml
└─ src/
   ├─ main.tsx
   ├─ App.tsx
   ├─ store/
   │  └─ useMuseumStore.ts
   ├─ data/
   │  ├─ artworks.ts
   │  ├─ companions.ts
   │  └─ resultText.ts
   ├─ scenes/
   │  ├─ IntroScene.tsx
   │  ├─ HallScene.tsx
   │  ├─ ChoiceScene.tsx
   │  ├─ CompanionScene.tsx
   │  └─ ResultScene.tsx
   ├─ components/
   │  ├─ Stage.tsx
   │  ├─ SubtitlesChoice.tsx
   │  ├─ CompanionCard.tsx
   │  ├─ CanvasPortrait.tsx
   │  └─ ProceduralArtwork.tsx
   ├─ utils/
   │  ├─ personality.ts
   │  └─ shareCard.ts
   └─ styles/
      ├─ global.css
      ├─ stage.css
      └─ effects.css
```

## 体验流程

1. 开场 Intro：黑场、碎片、门廊、字幕动画，可跳过。
2. 展厅 Hall：自动镜头推进，用户只能暂停 / 继续。
3. 画作 Choice：3 个画作节点，每个节点 2 个字幕式选择。
4. 伙伴 Companion：3 张神秘剪影卡片，选择后进入结果。
5. 结果 Result：根据五维分数生成编码、称号、描述和 Canvas 抽象肖像。
6. 分享 Export：点击按钮生成并下载 PNG 分享卡。

## 人格维度

五个维度：

- `intuition`：直觉
- `control`：控制
- `emotion`：情绪
- `curiosity`：好奇
- `affinity`：亲和

最终映射到 `0-4`，编码格式示例：

```txt
I3-C1-E4-U2-A0
```

由于五个维度各 5 档，天然可形成 `5^5 = 3125` 种编码组合，不需要手写大量结果文案。
