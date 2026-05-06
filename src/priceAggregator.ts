// src/priceAggregator.ts
import { publishPrices } from "./publisher";
import { Asset } from "./config";

type LatestEntry = {
  asset: Asset;
  price: number;
  decimal: number;
  updatedAt: number;
};

export class PriceAggregator {
  private latest = new Map<Asset, LatestEntry>();

  upsert(entry: LatestEntry) {
    this.latest.set(entry.asset, entry);
  }

  start(intervalMs: number) {
    setInterval(async () => {
      const updates = Array.from(this.latest.values())
        .sort((a, b) => a.asset.localeCompare(b.asset))
        .map(({ asset, price, decimal }) => ({
          asset,
          price,
          decimal,
        }));

      if (updates.length === 0) return;

      try {
        await publishPrices({ price_updates: updates });
      } catch (err) {
        console.error("Publish failed:", err);
      }
    }, intervalMs);
  }
}