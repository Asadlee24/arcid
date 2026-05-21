// src/lib/arckit.ts
import { AppKit } from "@circle-fin/app-kit";
import { ViemAdapter } from "@circle-fin/adapter-viem-v2";

/**
 * Sends USDC tip on Arc Testnet
 * Uses Circle App Kit with a seamless, direct EVM fallback
 */
export const sendUSDCTip = async (walletClient: any, toAddress: string, amount: string, publicClient?: any) => {
  console.log(`Initiating USDC tip of $${amount} to ${toAddress}`);
  
  try {
    // 1. Attempt to use Circle App Kit
    const viemAdapter = new ViemAdapter(
      {
        getPublicClient: () => publicClient || walletClient,
        getWalletClient: async () => walletClient
      },
      {
        addressContext: "user-controlled",
        supportedChains: ["Arc_Testnet" as any]
      }
    );
    const kit = new AppKit();
    
    const result = await kit.send({
      from: { adapter: viemAdapter, chain: "Arc_Testnet" as any },
      to: toAddress,
      amount: amount,
      token: "USDC",
    });
    
    console.log("Circle App Kit transfer completed successfully:", result);
    return {
      success: true,
      hash: (result as any).transactionHash || (result as any).hash || "",
      method: "Circle App Kit"
    };
  } catch (error) {
    console.warn("Circle App Kit transfer failed, falling back to direct native USDC transfer:", error);
    
    // 2. Fallback: Since USDC is the native currency/gas token on Arc Testnet (with 6 decimals),
    // we can send a standard native transfer directly via Viem walletClient!
    try {
      // Parse amount with 6 decimal places for USDC
      const parsedAmount = Math.floor(parseFloat(amount) * 1e6);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error("Invalid transfer amount");
      }

      const hash = await walletClient.sendTransaction({
        to: toAddress,
        value: BigInt(parsedAmount),
      });

      console.log("Direct native USDC transfer completed successfully. Tx Hash:", hash);
      return {
        success: true,
        hash,
        method: "Arc Native USDC Transfer"
      };
    } catch (fallbackError: any) {
      console.error("Direct native USDC transfer failed:", fallbackError);
      throw new Error(fallbackError.message || "Failed to complete transaction");
    }
  }
};
