src/index.ts → app entry point, Redis connect + WS start.

src/config.ts → all env vars and constants like REDIS_URL, publish interval, market mapping.

src/types.ts → shared TS types for asset, payload, and stream messages.

src/backpackWs.ts → WebSocket connect, subscribe, parse, reconnect. Backpack’s docs show public stream subscription through SUBSCRIBE and stream names like trade.SOL_USDC.

src/priceAggregator.ts → keeps latest BTC/ETH/SOL values in memory and emits every 100ms.

src/publisher.ts → Redis publisher logic.

src/fixedPoint.ts → converts string price to integer + decimal format.

scripts/subscriber.ts → local test subscriber to verify Redis messages.