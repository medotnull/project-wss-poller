# project-wss-poller
A small TypeScript service that listens to Backpack market prices over WebSocket, batches the latest updates every 100ms, and publishes them to Redis Pub/Sub.

This project is meant for one job only: keep a lightweight live feed running for BTC, ETH, and SOL without spamming downstream consumers on every single tick.
