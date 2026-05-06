export const BACKPACK_WS_URL = "wss://ws.backpack.exchange";
export const REDIS_CHANNEL = "prices.backpack";
export const PUBLISH_INTERVAL_MS = 100;

export const MARKETS = {
    BTC_USDC: { asset: "BTC", decimal: 4 },
    ETH_USDC: { asset: "ETH", decimal: 4 },
    SOL_USDC: { asset: "SOL", decimal: 6 },
} as const;

export type MarketSymbol = keyof typeof MARKETS;
export type Asset = (typeof MARKETS)[MarketSymbol]["asset"];