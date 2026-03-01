# 时光纪念站（Next.js + Vercel）

这是一个以**时间线为主轴**的纪念网站模板：

- 生平掠影
- 光影记忆（照片/视频）
- 字里行间（纪念文字）
- 她爱的一切（书、歌、诗句等）
- 足迹与贡献
- 访客互动（点亮蜡烛、送花）

所有内容都锚定在具体时间节点上，让回忆像“生命之书”一样被滚动阅读。

## 本地运行

```bash
npm install
npm run dev
```

打开 <http://localhost:3000>

## 内容编辑

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
- `favorites`：她爱的一切
- `contributions`：足迹与贡献
- `media`：照片/视频/音乐条目

## Vercel 部署

1. 将仓库推送到 GitHub。
2. 登录 Vercel 并导入该仓库。
3. 保持默认构建设置（Next.js）。
4. 点击 Deploy。

部署后每次 push 都会自动触发更新。

## 真实计数（Vercel Redis）

已实现真实计数接口：

- `GET /api/tribute`：读取蜡烛/鲜花计数
- `POST /api/tribute`：提交一次点亮（`type: candle | flower`）

推荐使用 Vercel Marketplace 的 Redis（Upstash）集成：

1. 在 Vercel 项目中进入 **Storage**，添加 Redis 集成。
2. Vercel 会自动注入环境变量（常见为 `UPSTASH_REDIS_REST_URL` 与 `UPSTASH_REDIS_REST_TOKEN`）。
3. 重新部署后，访客点击会写入持久化存储，不再是前端假数据。

如果你在本地开发想看到真实计数，可把相同环境变量写入本地 `.env.local`。

## 运行环境说明

当前依赖为 Next.js 16，建议 Node.js `>=20.9.0`。
如果你本地 Node 版本较低，建议升级 Node 后再执行开发与构建命令。
