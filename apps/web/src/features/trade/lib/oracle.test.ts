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

// ---------------------------------------------------------------------------
// Pyth Benchmarks candle fetching & 4xx fallback (Issue #852)
// ---------------------------------------------------------------------------

describe("Pyth Benchmarks candle fetching & 4xx fallback", () => {
  afterEach(() => {
    vi.restoreAllMocks()
    server.resetHandlers()
  })

  it("fetches and validates candles when Pyth Benchmarks returns 200", async () => {
    server.use(
      http.get("https://benchmarks.pyth.network/v1/shims/tradingview/history", () => {
        return HttpResponse.json({
          s: "ok",
          t: [1700000000, 1700000300],
          o: [80000, 80100],
          h: [80500, 80600],
          l: [79500, 79900],
          c: [80200, 80400],
        })
      })
    )

    const bars = await fetchPythBenchmarkCandles("BTC", "5m", 10)
    expect(bars).toHaveLength(2)
    expect(bars[0]).toEqual({
      time: 1700000000,
      open: 80000,
      high: 80500,
      low: 79500,
      close: 80200,
    })
  })

  it("throws when Pyth Benchmarks returns 404", async () => {
    server.use(
      http.get("https://benchmarks.pyth.network/v1/shims/tradingview/history", () => {
        return new HttpResponse("Not Found", { status: 404 })
      })
    )

    await expect(fetchPythBenchmarkCandles("BTC", "5m", 10)).rejects.toThrow(/HTTP 404/)
  })

  it("fetchOracleCandles throws 'Chart data unavailable' when all sources return 404 or fail", async () => {
    server.use(
      http.get("https://api.binance.com/api/v3/klines", () => {
        return new HttpResponse("Not Found", { status: 404 })
      }),
      http.get("https://benchmarks.pyth.network/v1/shims/tradingview/history", () => {
        return new HttpResponse("Not Found", { status: 404 })
      }),
      http.get("*/prices/candles", () => {
        return new HttpResponse("Not Found", { status: 404 })
      })
    )

    await expect(fetchOracleCandles("BTC", "5m", 10)).rejects.toThrow(
      /Chart data unavailable for BTC: all candle sources failed/
    )
  })

  it("fetchOracleCandles successfully uses Pyth Benchmarks when Binance is unavailable", async () => {
    server.use(
      http.get("https://api.binance.com/api/v3/klines", () => {
        return new HttpResponse("Geo-blocked", { status: 451 })
      }),
      http.get("https://benchmarks.pyth.network/v1/shims/tradingview/history", () => {
        return HttpResponse.json({
          s: "ok",
          t: [1700000000],
          o: [80000],
          h: [80500],
          l: [79500],
          c: [80200],
        })
      })
    )

    const res = await fetchOracleCandles("BTC", "5m", 10)
    expect(res.venueName).toBe("Pyth Hermes Reference")
    expect(res.candles).toHaveLength(1)
    expect(res.candles[0]?.close).toBe(80200)
  })
})
