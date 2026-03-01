export type MemoryMediaType = "照片" | "视频" | "音乐";

export type MemoryMedia = {
  type: MemoryMediaType;
  caption: string;
  hint?: string;
};

export type MemoryNode = {
  orderDate: string;
  year: string;
  title: string;
  summary: string;
  biography?: string;
  moments?: string[];
  writing?: string;
  favorites?: string[];
  contributions?: string[];
  media?: MemoryMedia[];
};
