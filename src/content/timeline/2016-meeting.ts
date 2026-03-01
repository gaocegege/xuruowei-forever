import type { MemoryNode } from "@/types/memory";

export const block2016Meeting: MemoryNode[] = [
  {
    orderDate: "2016-03",
    year: "2016 · 春",
    title: "相遇的那一天",
    summary: "你们在人群中认出彼此，从一句问候开始，走进漫长的同行。",
    biography:
      "她让寻常日子有了光：晚饭后的散步、雨夜里共撑一把伞、每次离别前的回头。",
    moments: ["第一次一起旅行", "在海边看日出", "争吵后仍会认真道歉和拥抱"],
    writing:
      "“谢谢你把平凡岁月过成诗。每当我回头，总能看见你在光里微笑。”",
    media: [
      {
        type: "照片",
        caption: "我们走过的路",
        hint: "可替换为 public/memories/2016-road.jpg",
      },
      {
        type: "视频",
        caption: "旅途片段",
        hint: "可替换为 public/memories/2016-trip.mp4",
      },
    ],
  },
];
