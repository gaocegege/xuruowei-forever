import { Redis } from "@upstash/redis";

export type TributeType = "candle" | "flower";

export type TributeCounts = {
  candles: number;
  flowers: number;
};

const CANDLE_KEY = "tribute:candles";
const FLOWER_KEY = "tribute:flowers";

const redis = Redis.fromEnv();

export async function getTributeCounts(): Promise<TributeCounts> {
  const [candlesRaw, flowersRaw] = await Promise.all([
    redis.get<number>(CANDLE_KEY),
    redis.get<number>(FLOWER_KEY),
  ]);

  return {
    candles: candlesRaw ?? 0,
    flowers: flowersRaw ?? 0,
  };
}

export async function increaseTributeCount(
  type: TributeType,
): Promise<TributeCounts> {
  if (type === "candle") {
    await redis.incr(CANDLE_KEY);
  } else {
    await redis.incr(FLOWER_KEY);
  }

  return getTributeCounts();
}
