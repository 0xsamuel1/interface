import { defineConfig, mergeConfig } from "vitest/config"
import viteTsConfigPaths from "vite-tsconfig-paths"
import { reactConfig } from "@repo/vitest-config/react"

export default mergeConfig(
  reactConfig,
  defineConfig({
    plugins: [
      viteTsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
    ],
    define: {
      self: "globalThis",
      "import.meta.env.VITE_NETWORK": JSON.stringify("testnet"),
      "import.meta.env.VITE_RPC_URL": JSON.stringify("https://soroban-testnet.stellar.org"),
      "import.meta.env.VITE_HORIZON_URL": JSON.stringify("https://horizon-testnet.stellar.org"),
      "import.meta.env.VITE_CONTRACT_EXCHANGE_ROUTER": JSON.stringify(
        "CAASUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7",
      ),
      "import.meta.env.VITE_CONTRACT_SYNTHETICS_READER": JSON.stringify(
        "CABCUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSYU",
      ),
      "import.meta.env.VITE_CONTRACT_DATA_STORE": JSON.stringify(
        "CABSUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABDKN",
      ),
      "import.meta.env.VITE_CONTRACT_ORDER_VAULT": JSON.stringify(
        "CACCUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7WT",
      ),
      "import.meta.env.VITE_CONTRACT_STAKING_ROUTER": JSON.stringify(
        "CACSUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOEK",
      ),
      "import.meta.env.VITE_CONTRACT_GLV_ROUTER": JSON.stringify(
        "CADCUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4TB",
      ),
      "import.meta.env.VITE_CONTRACT_VESTING_ROUTER": JSON.stringify(
        "CADSUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABNBY",
      ),
      "import.meta.env.VITE_CONTRACT_REFERRAL_STORAGE": JSON.stringify(
        "CAECUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANKM",
      ),
      "import.meta.env.VITE_CONTRACT_MARKET_FACTORY": JSON.stringify(
        "CAESUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4YV",
      ),
      "import.meta.env.VITE_CONTRACT_DEPOSIT_HANDLER": JSON.stringify(
        "CAFCUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABOP6",
      ),
      "import.meta.env.VITE_CONTRACT_WITHDRAWAL_HANDLER": JSON.stringify(
        "CAFSUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB75H",
      ),
      "import.meta.env.VITE_CONTRACT_ORACLE": JSON.stringify(
        "CAGCUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADBZ",
      ),
      "import.meta.env.VITE_CONTRACT_ORDER_HANDLER": JSON.stringify(
        "CAGSUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASTA",
      ),
      "import.meta.env.VITE_FAUCET": JSON.stringify(
        "CAHCUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAEL",
      ),
      "import.meta.env.VITE_TOKEN_TUSDC": JSON.stringify(
        "CAHSUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABRWS",
      ),
      "import.meta.env.VITE_TOKEN_TWBTC": JSON.stringify(
        "CAICUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABATC",
      ),
      "import.meta.env.VITE_TOKEN_TETH": JSON.stringify(
        "CAISUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABRB3",
      ),
      "import.meta.env.VITE_TOKEN_TXLM": JSON.stringify(
        "CAJCUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADWQ",
      ),
      "import.meta.env.VITE_MARKET_TOKEN_TWBTC_TUSDC": JSON.stringify(
        "CAJSUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASEJ",
      ),
      "import.meta.env.VITE_MARKET_TOKEN_TETH_TUSDC": JSON.stringify(
        "CAKCUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABOYX",
      ),
      "import.meta.env.VITE_MARKET_TOKEN_TXLM_TUSDC": JSON.stringify(
        "CAKSUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7KO",
      ),
    },
    test: {
      include: ["src/**/*.{test,spec}.{ts,tsx}", "test/**/*.{test,spec}.{ts,tsx}"],
      server: {
        deps: {
          inline: [
            "react",
            "react-dom",
            "react/jsx-runtime",
            "react/jsx-dev-runtime",
            "@testing-library/react",
            "@testing-library/user-event",
            "@testing-library/jest-dom",
          ],
        },
      },
    },
  }),
)
