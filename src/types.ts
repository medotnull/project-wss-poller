// src/types.ts
export type Asset = "BTC" | "ETH" | "SOL";

export interface PriceUpdate {
  asset: Asset;
  price: number;
  decimal: number;
}

export interface PublishPayload {
  price_updates: PriceUpdate[];
}