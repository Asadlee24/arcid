// src/config/wagmi.ts
import { createConfig, http } from "wagmi";
import { metaMask } from "wagmi/connectors";
import { defineChain } from "viem";

// Verified exact values at: https://docs.arc.network/arc/references/connect-to-arc
export const arcTestnet = defineChain({
  id: 5042002, // Verified Arc Testnet Chain ID
  name: "Arc Testnet",
  nativeCurrency: {
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.arc.network"],
    },
    public: {
      http: ["https://rpc.testnet.arc.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "ArcScan",
      url: "https://testnet.arcscan.app",
    },
  },
  testnet: true,
});

export const config = createConfig({
  chains: [arcTestnet],
  connectors: [metaMask()],
  transports: {
    [arcTestnet.id]: http(),
  },
});
