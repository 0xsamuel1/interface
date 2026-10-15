import { HttpResponse, http } from "msw"
import { describe, expect, it, vi } from "vitest"
import { server } from "../../../../test/msw/server"
import { fetchTokenPrices } from "./oracle"

vi.mock("./pyth", () => ({
  fetchPythAttestations: vi.fn(async (symbols: Array<string>) =>
    symbols.map((symbol) => ({
      symbol,
      minPrice: 100,
      maxPrice: 101,
      publishTimeMs: 1_700_000_000_000,
      priceUpdateData: new Uint8Array(),
    })),
  ),
}))

describe("fetchTokenPrices", () => {
  it("never queries the third-party workers.dev price proxy and uses Pyth as primary", async () => {
    let proxyHits = 0
    server.use(
      http.get("https://oracle.biscotti-proxy-worker.workers.dev/*", () => {
        proxyHits += 1
        return HttpResponse.json([
          { token: "C", symbol: "TWBTC", min: 1e35, max: 1e35, timestamp: 1 },
        ])
      }),
      http.get("https://api.binance.com/*", () => new HttpResponse(null, { status: 503 })),
    )

    const prices = await fetchTokenPrices()

    expect(proxyHits).toBe(0)
    const btc = prices.find((p) => p.symbol === "BTC")
    expect(btc?.source).toBe("pyth")
    expect(btc?.minPrice).toBe(100)
  })
})
