# 徐若薇短暂又灿烂的一生

[xuruowei.com](xuruowei.com) 是她的家人朋友们和她的爱人高策为纪念她留下的。徐若薇于 2026 年 2 月 28 日离世。我们希望通过这个时间线纪念她的一生——照片、故事、文字、音乐与她钟爱的一切。沿着她生命的轨迹漫步，重新触摸那些有温度的瞬间。

所有内容都锚定在具体时间节点上，让回忆像“生命之书”一样被滚动阅读。

## 本地运行

```bash
npm install
npm run dev
```

打开 <http://localhost:3000>

## 内容编辑（高策维护）

核心内容在：

- `src/content/timeline/` 目录下的各个节点文件（每个块一个文件）
- `src/content/timeline/index.ts` 统一 merge 所有块
- `src/types/memory.ts` 统一类型定义

你可以按节点修改：

- `orderDate`：用于 merge 后排序（推荐格式：`YYYY-MM` 或 `YYYY-MM-DD`）
- `year`：日期/年份
- `title`：节点标题
- `summary`：核心叙述
- `biography`：生平掠影
- `moments`：记忆片段列表
- `writing`：纪念文字
- `dialogues`：对话记录（微信聊天风格）
- `favorites`：她爱的一切
- `contributions`：足迹与贡献
- `media`：照片/视频/音乐条目

`dialogues` 示例：

- `{ speakerId: "xuruowei", content: "你到家了吗？", time: "22:14" }`
- `{ speakerId: "gaoce", content: "刚到，放心。", time: "22:15" }`

对话角色配置在：`src/content/speaker-map.ts`

- 每个角色有唯一 `id`
- 每个 `id` 都可以配置 `avatarSrc`（头像）和 `side`（left/right）

如果某条 `media` 是图片，可增加 `src` 字段，例如：

- `src: "/memories/2015/photo.JPG"`
- `imagePosition: "center 25%"`（控制显示区域，等同 CSS `object-position`）
- `imageScale: 1.08`（可选，轻微放大裁剪）

页面会自动优先读取 `/optimized/...webp`，不存在时回退到原图。

## 顶部图片（avatar/photo）

- 文件位置：`public/avatar.JPG`、`public/photo.JPG`
- 页面展示：`src/app/page.tsx` 顶部 Hero 区
- `photo.JPG` 当前使用横幅裁剪（`object-cover` + `object-[center_30%]`），可调这个位置参数来改变取景
- 移动端优化：已配置 `sizes`
- 画质压缩：已配置 `quality`（主图 68、头像 60），用于降低网页传输体积

## 自动图片降精度

- 运行命令：`npm run optimize:images`
- 脚本会自动扫描 `public/` 下的图片，并生成压缩后的 WebP 到 `public/optimized/`
- 页面会优先加载 `optimized` 图片；若不存在则自动回退到原图

可选环境变量（执行命令时设置）：

- `IMAGE_QUALITY`：默认 `68`
- `IMAGE_MAX_WIDTH`：默认 `1600`

示例：`IMAGE_QUALITY=60 IMAGE_MAX_WIDTH=1280 npm run optimize:images`

## 真实计数（Neon Postgres）

已实现真实计数接口：

- `GET /api/tribute`：读取蜡烛/鲜花计数
- `POST /api/tribute`：提交一次点亮（`type: candle | flower`）

实现方式：

1. 接口使用 `.env` 中的 `DATABASE_URL` 连接 Neon PostgreSQL。
2. 服务端会自动创建 `tribute_counts` 表（若不存在）。
3. `POST /api/tribute` 使用原子 upsert 自增蜡烛/鲜花计数。

## 匿名评论（Neon Postgres）

已实现评论接口：

- `GET /api/comments`：按时间顺序读取评论（从早到晚）
- `POST /api/comments`：提交评论（仅需 `name` 和 `content`）

特性：

- 无需注册登录
- 自动记录创建时间 `created_at`
- 服务端自动创建 `memorial_comments` 表（若不存在）

留言文本导出：

- 运行 `npm run dump:comments`
- 导出文件会写入 `data/comments-dump.txt`

请确保环境变量中存在 `DATABASE_URL`。

## 运行环境说明

当前依赖为 Next.js 16，建议 Node.js `>=20.9.0`。
如果你本地 Node 版本较低，建议升级 Node 后再执行开发与构建命令。
