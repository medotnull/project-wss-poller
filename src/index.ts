// src/index.ts
import dotenv from "dotenv";
dotenv.config();

import { PUBLISH_INTERVAL_MS } from "./config";
import { connectRedis } from "./publisher";
import { PriceAggregator } from "./priceAggregator";
import { BackpackPriceStream } from "./backpackWs";

async function main() {
  await connectRedis();

  const aggregator = new PriceAggregator();
  aggregator.start(PUBLISH_INTERVAL_MS);

  const stream = new BackpackPriceStream(aggregator);
  stream.connect();

  console.log("Poller started");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});