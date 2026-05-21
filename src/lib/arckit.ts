// src/lib/arckit.ts
export const sendUSDCTip = async (
  walletClient: any,
  toAddress: string,
  amount: string,
  publicClient?: any
) => {
  if (!walletClient) {
    throw new Error("Wallet not connected");
  }

  console.log(`Initiating USDC tip of $${amount} to ${toAddress}`);

  const parsedAmount = Math.floor(parseFloat(amount) * 1_000_000);
  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    throw new Error("Invalid transfer amount");
  }

  try {
    const hash = await walletClient.sendTransaction({
      to: toAddress as `0x${string}`,
      value: BigInt(parsedAmount),
    });

    console.log("USDC tip sent! Tx Hash:", hash);

    if (publicClient) {
      try {
        await publicClient.waitForTransactionReceipt({ hash });
      } catch (e) {
        console.warn("Could not confirm receipt, but tx submitted:", e);
      }
    }

    return { success: true, hash, method: "Arc Native USDC Transfer" };
  } catch (error: any) {
    console.error("USDC tip failed:", error);
    throw new Error(error.shortMessage || error.message || "Failed to send USDC tip");
  }
};
