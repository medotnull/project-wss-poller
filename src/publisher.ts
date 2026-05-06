import { createClient } from "redis";
import { REDIS_CHANNEL } from "./config";


const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";

export const redis = createClient({
    url: redisUrl
});

export async function connectRedis() {
    redis.on("error", (err) => {
        console.error("Redis error:", err);
    });

    await redis.connect();
    console.log("Connected to redis");
}

export async function publishPrices(payload: {
  price_updates: Array<{
    asset: string;
    price: number;
    decimal: number;
  }>;
}) {
  await redis.publish(REDIS_CHANNEL, JSON.stringify(payload));
}