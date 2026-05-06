// src/backpackWs.ts
import WebSocket from "ws";
import { BACKPACK_WS_URL, MARKETS, MarketSymbol } from "./config";
import { toFixedInt } from "./fixedPoint";
import { PriceAggregator } from "./priceAggregator";

type BackpackMessage = {
  stream?: string;
  data?: any;
  result?: any;
  error?: any;
};

const SUBSCRIPTION_STREAMS = [
  "trade.BTC_USDC",
  "trade.ETH_USDC",
  "trade.SOL_USDC",
];

export class BackpackPriceStream {
  private ws?: WebSocket;
   private reconnectTimer: NodeJS.Timeout | undefined;

  constructor(private aggregator: PriceAggregator) {}

  connect() {
    this.ws = new WebSocket(BACKPACK_WS_URL);

    this.ws.on("open", () => {
      console.log("Connected to Backpack WS");

      this.ws?.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          params: SUBSCRIPTION_STREAMS,
        })
      );
    });

    this.ws.on("message", (raw) => {
      try {
        const msg: BackpackMessage = JSON.parse(raw.toString());

        if (msg.error) {
          console.error("Backpack WS error message:", msg.error);
          return;
        }

        if (!msg.stream || !msg.data) return;
        if (!msg.stream.startsWith("trade.")) return;

        const market = msg.stream.replace("trade.", "") as MarketSymbol;
        const meta = MARKETS[market];
        if (!meta) return;

        // Backpack trade streams are documented as public trade data streams.
        // In practice, trade payload price is typically a string field like `p` or `price`.
        const rawPrice = msg.data.p ?? msg.data.price;
        if (!rawPrice) return;

        const fixedPrice = toFixedInt(String(rawPrice), meta.decimal);

        this.aggregator.upsert({
          asset: meta.asset,
          price: fixedPrice,
          decimal: meta.decimal,
          updatedAt: Date.now(),
        });
      } catch (err) {
        console.error("Failed to parse WS message:", err);
      }
    });

    this.ws.on("close", () => {
      console.warn("Backpack WS closed, reconnecting...");
      this.scheduleReconnect();
    });

    this.ws.on("error", (err) => {
      console.error("Backpack WS error:", err);
      this.ws?.close();
    });
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined;
      this.connect();
    }, 2000);
  }
}