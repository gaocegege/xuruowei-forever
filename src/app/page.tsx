"use client";

import { useEffect, useMemo, useState } from "react";
import { timelineBlocks } from "@/content/timeline";
import { AutoQualityImage } from "@/components/auto-quality-image";
import { speakerMap } from "@/content/speaker-map";

type TributeCounts = {
  candles: number;
  flowers: number;
};

type TributeType = "candle" | "flower";

type MemorialComment = {
  id: number;
  name: string;
  content: string;
  createdAt: string;
};

export default function Home() {
  const [counts, setCounts] = useState<TributeCounts>({ candles: 0, flowers: 0 });
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);
  const [pendingType, setPendingType] = useState<TributeType | null>(null);
  const [isTributePanelOpen, setIsTributePanelOpen] = useState(false);
  const [comments, setComments] = useState<MemorialComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [commentName, setCommentName] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState("");
  const memoryTimeline = useMemo(
    () =>
      timelineBlocks
        .flatMap((block) => block)
        .sort((left, right) => left.orderDate.localeCompare(right.orderDate)),
    [],
  );

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await fetch("/api/tribute", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as TributeCounts;
        setCounts(data);
      } finally {
        setIsLoadingCounts(false);
      }
    };

    void fetchCounts();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch("/api/comments", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { comments: MemorialComment[] };
        setComments(data.comments);
      } finally {
        setIsLoadingComments(false);
      }
    };

    void fetchComments();
  }, []);

  const submitTribute = async (type: TributeType) => {
    if (pendingType) {
      return;
    }

    setPendingType(type);

    try {
      const response = await fetch("/api/tribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as TributeCounts;
      setCounts(data);
    } finally {
      setPendingType(null);
    }
  };

  const submitComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmittingComment) {
      return;
    }

    setCommentError("");
    setIsSubmittingComment(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: commentName,
          content: commentContent,
        }),
      });

      const data = (await response.json()) as
        | { comment: MemorialComment }
        | { error: string };

      if (!response.ok || !("comment" in data)) {
        setCommentError("error" in data ? data.error : "提交失败，请稍后重试。");
        return;
      }

      setComments((prev) => [data.comment, ...prev]);
      setCommentName("");
      setCommentContent("");
    } catch {
      setCommentError("提交失败，请稍后重试。");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const renderSpeakerAvatar = (speaker: { name: string; avatarSrc?: string }) => {
    const hasAvatar = Boolean(speaker.avatarSrc && speaker.avatarSrc.trim().length > 0);

    if (hasAvatar) {
      return (
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-amber-100 bg-white">
          <AutoQualityImage
            src={speaker.avatarSrc!}
            alt={`${speaker.name}头像`}
            fill
            quality={58}
            sizes="32px"
            className="object-cover"
          />
        </div>
      );
    }

    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-[11px] text-amber-700">
        {speaker.name.slice(0, 2)}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-amber-50 text-stone-700">
      <header className="mx-auto w-full max-w-5xl px-6 pt-14 pb-10">
        <div className="relative mb-16 h-8">
          <div className="absolute -bottom-12 left-6 h-24 w-24 overflow-hidden rounded-full border-4 border-amber-50 bg-white shadow md:h-32 md:w-32">
            <AutoQualityImage
              src="/avatar.JPG"
              alt="徐若薇头像"
              fill
              quality={60}
              sizes="(max-width: 768px) 96px, 128px"
              className="object-cover"
            />
          </div>
        </div>

        <p className="text-sm tracking-[0.24em] text-amber-700">也许世界上也有五千朵和你一模一样的花，但只有你是我独一无二的蔷薇</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-stone-800 md:text-5xl">
          徐若薇短暂又灿烂的，一生
        </h1>
        <p className="mt-4 w-full text-base leading-8 text-stone-600 md:text-lg">
          这是她的家人朋友们和她的爱人<a href="https://gaocegege.com" className="text-amber-700 hover:underline">高策</a>为纪念她留下的。徐若薇于 2026 年 2 月 28 日离世。我们希望通过这个时间线纪念她的一生——照片、故事、文字、音乐与她钟爱的一切。沿着她生命的轨迹漫步，重新触摸那些有温度的瞬间。
        </p>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 pb-20">
        <div className="relative border-l-2 border-amber-200 pl-8 md:pl-12">
          {memoryTimeline.map((node) => (
            <article key={`${node.year}-${node.title}`} className="relative mb-12 rounded-2xl border border-amber-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm md:p-8">
              <span className="absolute -left-[41px] top-8 h-4 w-4 rounded-full border-4 border-amber-50 bg-amber-400 md:-left-[50px]" />

              <p className="text-sm font-medium tracking-wide text-amber-700">{node.year}</p>
              <h2 className="mt-2 text-2xl font-semibold text-stone-800">{node.title}</h2>
              <p className="mt-3 leading-8 text-stone-600">{node.summary}</p>

              {node.biography && (
                <section className="mt-5 rounded-xl bg-amber-50/70 p-4">
                  <h3 className="text-sm font-semibold tracking-wide text-amber-700">生平掠影</h3>
                  <p className="mt-2 leading-8 text-stone-600">{node.biography}</p>
                </section>
              )}

              {node.media && (
                <section className="mt-5 rounded-xl bg-amber-50/70 p-4">
                  <h3 className="text-sm font-semibold tracking-wide text-amber-700">光影记忆</h3>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {node.media.map((item) => (
                      <div key={`${node.year}-${item.type}-${item.caption}`} className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                        <p className="text-sm text-amber-700">{item.type}</p>
                        <p className="mt-1 font-medium text-stone-700">{item.caption}</p>
                        {item.type === "照片" && item.src && (
                          <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-lg bg-amber-100/40">
                            <AutoQualityImage
                              src={item.src}
                              alt={item.caption}
                              fill
                              quality={62}
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover"
                              style={{
                                objectPosition: item.imagePosition ?? "center center",
                                transform: `scale(${item.imageScale ?? 1})`,
                              }}
                            />
                          </div>
                        )}
                        {item.hint && <p className="mt-2 text-xs text-stone-500">{item.hint}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {node.writing && (
                <section className="mt-5 rounded-xl bg-sky-50/70 p-4">
                  <h3 className="text-sm font-semibold tracking-wide text-sky-700">字里行间</h3>
                  <p className="mt-2 leading-8 text-stone-600">{node.writing}</p>
                </section>
              )}

              {node.dialogues && node.dialogues.length > 0 && (
                <section className="mt-5 rounded-xl bg-stone-50/80 p-4">
                  <h3 className="text-sm font-semibold tracking-wide text-stone-700">对话时刻</h3>
                  <div className="mt-3 space-y-3">
                    {node.dialogues.map((item, index) => (
                      (() => {
                        const speaker =
                          speakerMap[item.speakerId] ?? {
                            id: item.speakerId,
                            name: item.speakerId,
                            avatarSrc: "",
                            side: "left" as const,
                          };

                        const isRight = speaker.side === "right";

                        return (
                          <div
                            key={`${node.year}-dialogue-${index}`}
                            className={`flex items-end gap-2 ${isRight ? "justify-end" : "justify-start"}`}
                          >
                            {!isRight && (
                              renderSpeakerAvatar(speaker)
                            )}

                            <div
                              className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                                isRight
                                  ? "bg-amber-100 text-amber-900"
                                  : "bg-white text-stone-700 ring-1 ring-stone-200"
                              }`}
                            >
                              <p>{item.content}</p>
                              {item.time && (
                                <p className="mt-1 text-[11px] text-stone-400">{item.time}</p>
                              )}
                            </div>

                            {isRight && (
                              renderSpeakerAvatar(speaker)
                            )}
                          </div>
                        );
                      })()
                    ))}
                  </div>
                </section>
              )}

              {node.favorites && (
                <section className="mt-5 rounded-xl bg-emerald-50/40 p-4">
                  <h3 className="text-sm font-semibold tracking-wide text-emerald-700">她爱的一切</h3>
                  <ul className="mt-2 space-y-2 text-stone-600">
                    {node.favorites.map((item) => (
                      <li key={`${node.year}-${item}`} className="rounded-lg bg-emerald-50/70 px-3 py-2 leading-7">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {node.moments && (
                <section className="mt-5 rounded-xl bg-amber-50/40 p-4">
                  <h3 className="text-sm font-semibold tracking-wide text-amber-700">记忆片段</h3>
                  <ul className="mt-2 space-y-2 text-stone-600">
                    {node.moments.map((moment) => (
                      <li key={`${node.year}-${moment}`} className="rounded-lg bg-white px-3 py-2 ring-1 ring-amber-100 leading-7">
                        {moment}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {node.contributions && (
                <section className="mt-5 rounded-xl bg-cyan-50/40 p-4">
                  <h3 className="text-sm font-semibold tracking-wide text-cyan-700">足迹与贡献</h3>
                  <ul className="mt-2 space-y-2 text-stone-600">
                    {node.contributions.map((item) => (
                      <li key={`${node.year}-${item}`} className="rounded-lg bg-cyan-50/60 px-3 py-2 leading-7">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </article>
          ))}
        </div>

          <div className="rounded-2xl border border-amber-100 bg-white/80 px-6 py-8 shadow-sm">
            <p className="text-lg font-semibold tracking-wide text-amber-700">未完待续</p>
            <p className="mt-3 text-sm leading-7 text-stone-600 md:text-base">
              这个纪念空间，将继续带着我们的爱去构建。关于她的回忆，都将被珍藏在这里，成为我们共同的精神家园。如果你想添加自己的回忆到时间线，补充她更多的故事，可以添加她的爱人高策的微信 (gaocedidi)。
            </p>
          </div>

        <section
          id="comments-section"
          className="mt-10 rounded-2xl border border-amber-100 bg-white/80 p-6 shadow-sm md:p-8"
        >
          <h2 className="text-2xl font-semibold text-stone-800">写给徐若薇的话</h2>
          <p className="mt-2 text-sm leading-7 text-stone-500">
            请留下你的名字与想说的话，让这份思念被我们一起珍藏。如果你也有关于她的回忆，欢迎分享。
          </p>
          <p className="mt-2 text-sm leading-7 text-stone-500">
          </p>

          <form onSubmit={submitComment} className="mt-4 space-y-3">
            <input
              value={commentName}
              onChange={(event) => setCommentName(event.target.value)}
              placeholder="署名（如：高策 / 某某）"
              maxLength={40}
              className="w-full rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-2 text-sm text-stone-700 outline-none transition focus:border-amber-300"
            />
            <textarea
              value={commentContent}
              onChange={(event) => setCommentContent(event.target.value)}
              placeholder="想对若薇说的话……"
              maxLength={1000}
              rows={4}
              className="w-full rounded-xl border border-amber-200 bg-amber-50/40 px-3 py-2 text-sm leading-7 text-stone-700 outline-none transition focus:border-amber-300"
            />

            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-rose-500">{commentError}</p>
              <button
                type="submit"
                disabled={isSubmittingComment}
                className="rounded-xl bg-amber-100 px-4 py-2 text-sm text-amber-800 transition hover:bg-amber-200 disabled:opacity-70"
              >
                {isSubmittingComment ? "正在送达..." : "留下这句话"}
              </button>
            </div>
          </form>

          <div className="mt-5 space-y-3">
            {isLoadingComments ? (
              <p className="text-sm text-stone-500">正在翻看这些心意...</p>
            ) : comments.length === 0 ? (
              <p className="text-sm text-stone-500">这里还很安静，欢迎留下第一句想念。</p>
            ) : (
              comments.map((comment) => (
                <article key={comment.id} className="rounded-xl border border-amber-100 bg-amber-50/30 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-stone-700">{comment.name}</p>
                    <p className="text-xs text-stone-400">
                      {new Date(comment.createdAt).toLocaleString("zh-CN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-stone-600">{comment.content}</p>
                </article>
              ))
            )}
          </div>
        </section>
      </main>

      <a
        href="#comments-section"
        className="group fixed right-4 bottom-4 z-10 w-[min(88vw,340px)] rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-rose-50/70 to-amber-100/70 px-4 py-3 shadow-lg backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-xl"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-base shadow-sm">
              💬
            </span>
            <div className="leading-5">
              <p className="text-sm font-semibold text-stone-700">分享你对徐若薇的回忆，让我们了解更多关于她的故事。</p>
              <p className="text-xs tracking-wide text-amber-700">已有 {comments.length} 条对她的话</p>
            </div>
          </div>
          <span className="text-amber-600 transition group-hover:translate-x-0.5">→</span>
        </div>
      </a>

      <aside className="fixed right-4 bottom-4 z-10">
        {isTributePanelOpen && (
          <div className="w-[min(92vw,360px)] rounded-2xl border border-amber-100 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-stone-700">访客心意</p>
                <p className="mt-1 text-xs leading-6 text-stone-500">你可以点亮蜡烛，或送上一朵花。</p>
              </div>
              <button
                onClick={() => setIsTributePanelOpen(false)}
                className="rounded-lg bg-stone-100 px-2 py-1 text-xs text-stone-600 transition hover:bg-stone-200"
              >
                收起
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <button
                onClick={() => submitTribute("candle")}
                disabled={pendingType !== null}
                className="rounded-xl bg-amber-100 px-3 py-2 text-amber-800 transition hover:bg-amber-200"
              >
                {pendingType === "candle" ? "提交中..." : "🕯 +1"}
              </button>
              <button
                onClick={() => submitTribute("flower")}
                disabled={pendingType !== null}
                className="rounded-xl bg-rose-100 px-3 py-2 text-rose-700 transition hover:bg-rose-200"
              >
                {pendingType === "flower" ? "提交中..." : "🌸 +1"}
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl bg-stone-50 px-3 py-2 text-xs text-stone-600">
              <span>已点亮蜡烛 {isLoadingCounts ? "..." : counts.candles}</span>
              <span>已送花 {isLoadingCounts ? "..." : counts.flowers}</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
