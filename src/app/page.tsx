"use client";

import { useEffect, useMemo, useState } from "react";
import { timelineBlocks } from "@/content/timeline";

type TributeCounts = {
  candles: number;
  flowers: number;
};

type TributeType = "candle" | "flower";

export default function Home() {
  const [counts, setCounts] = useState<TributeCounts>({ candles: 0, flowers: 0 });
  const [isLoadingCounts, setIsLoadingCounts] = useState(true);
  const [pendingType, setPendingType] = useState<TributeType | null>(null);
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

  return (
    <div className="min-h-screen bg-amber-50 text-stone-700">
      <header className="mx-auto w-full max-w-5xl px-6 pt-14 pb-10">
        <p className="text-sm tracking-[0.24em] text-amber-700">也许世界上也有五千朵和你一模一样的花，但只有你是我独一无二的蔷薇</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight text-stone-800 md:text-5xl">
          徐若薇的美好时光纪念馆
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-stone-600 md:text-lg">
          这是她的丈夫高策（<a href="https://gaocegege.com" className="text-amber-700 hover:underline">gaocegege.com</a>）和她的家人们为纪念徐若薇而创建的空间。徐若薇于 2026 年 2 月 28 日离世。我们希望通过这个时间线纪念她的一生——照片、故事、文字、音乐与她钟爱的一切，都被锚定在具体的时刻。当你向下滚动，就是沿着她生命的轨迹漫步，重新触摸那些有温度的瞬间。
        </p>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 pb-28">
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
                <section className="mt-5">
                  <h3 className="text-sm font-semibold tracking-wide text-amber-700">光影记忆</h3>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    {node.media.map((item) => (
                      <div key={`${node.year}-${item.type}-${item.caption}`} className="rounded-xl border border-amber-100 bg-amber-50/50 p-4">
                        <p className="text-sm text-amber-700">{item.type}</p>
                        <p className="mt-1 font-medium text-stone-700">{item.caption}</p>
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

              {node.favorites && (
                <section className="mt-5">
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
                <section className="mt-5">
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
                <section className="mt-5">
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
      </main>

      <aside className="fixed right-4 bottom-4 z-10 w-[min(92vw,360px)] rounded-2xl border border-amber-100 bg-white/95 p-4 shadow-lg backdrop-blur-sm">
        <p className="text-sm font-semibold text-stone-700">访客心意</p>
        <p className="mt-1 text-xs leading-6 text-stone-500">你可以点亮蜡烛，或送上一朵花。</p>

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
      </aside>
    </div>
  );
}
