import { NextResponse } from "next/server";
import {
  getTributeCounts,
  increaseTributeCount,
  type TributeType,
} from "@/lib/tribute-counter";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const counts = await getTributeCounts();
    return NextResponse.json(counts);
  } catch {
    return NextResponse.json(
      { error: "计数服务暂不可用，请稍后重试。" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { type?: TributeType };

    if (body.type !== "candle" && body.type !== "flower") {
      return NextResponse.json(
        { error: "参数错误：type 必须是 candle 或 flower。" },
        { status: 400 },
      );
    }

    const counts = await increaseTributeCount(body.type);
    return NextResponse.json(counts);
  } catch {
    return NextResponse.json(
      { error: "写入失败，请稍后重试。" },
      { status: 500 },
    );
  }
}
