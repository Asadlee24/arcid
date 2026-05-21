// src/hooks/useReputation.ts
import { useState } from "react";
import { usePublicClient, useAccount, useWalletClient, useChainId } from "wagmi";
import { REPUTATION_REGISTRY, reputationAbi } from "../config/contracts";
import { arcTestnet } from "../config/wagmi";
import { useArcID, type ArcIDProfile, MOCK_PROFILES } from "./useArcID";
import { sendUSDCTip } from "../lib/arckit";

export function useReputation() {
  const publicClient = usePublicClient();
  const { data: walletClient, isLoading: walletLoading } = useWalletClient();
  const { address: userAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const { refreshProfiles } = useArcID();

  const [loading, setLoading] = useState(false);

  const requireWallet = () => {
    if (!isConnected || !userAddress) {
      throw new Error("Wallet not connected. Please connect MetaMask first.");
    }
    if (chainId !== arcTestnet.id) {
      throw new Error("Wrong network. Please switch to Arc Testnet in the navbar first.");
    }
    if (walletLoading) {
      throw new Error("Wallet is still loading. Please try again in a moment.");
    }
    if (!walletClient) {
      throw new Error("Wallet client not ready. Please reconnect your wallet.");
    }
    if (!publicClient) {
      throw new Error("Network client not ready. Please refresh the page.");
    }
  };

  /**
   * 1. Endorse a profile (calls ReputationRegistry.giveFeedback onchain)
   */
  const endorseProfile = async (recipientProfile: ArcIDProfile, comment: string = "Highly recommended!") => {
    requireWallet();

    setLoading(true);
    try {
      console.log(`Endorsing profile: ${recipientProfile.name} (Token ID: ${recipientProfile.tokenId})`);

      const agentId = BigInt(recipientProfile.tokenId);
      const scoreBoost = 10n; // +10 Reputation points
      const feedbackType = 2; // Type 2: Endorsement
      const tag = "Endorsement";
      const metadataURI = "";
      const evidenceURI = "";
      // Standard 32-byte empty hash for feedbackHash argument
      const feedbackHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

      // Call ReputationRegistry.giveFeedback
      const hash = await walletClient!.writeContract({
        address: REPUTATION_REGISTRY,
        abi: reputationAbi,
        functionName: "giveFeedback",
        args: [
          agentId,
          scoreBoost,
          feedbackType,
          tag,
          metadataURI,
          evidenceURI,
          comment,
          feedbackHash,
        ],
        chain: arcTestnet,
        account: userAddress,
      });

      console.log("Endorsement tx submitted! Tx Hash:", hash);
      await publicClient!.waitForTransactionReceipt({ hash });
      console.log("Endorsement tx confirmed onchain!");

      // Update the local storage profile data to reflect this onchain boost in the UI
      updateLocalProfileStats(recipientProfile.address, 10, 0.0, 1);
      await refreshProfiles();

      return { success: true, hash };
    } catch (error: any) {
      console.error("Endorsement failed:", error);
      throw new Error(error.shortMessage || error.message || "Failed to submit endorsement onchain");
    } finally {
      setLoading(false);
    }
  };

  /**
   * 2. Send a USDC tip & record reputation feedback
   */
  const sendTipAndEndorse = async (
    recipientProfile: ArcIDProfile,
    amount: string,
    comment: string = "Generous USDC Tipping"
  ) => {
    requireWallet();

    setLoading(true);
    try {
      // Step A: Send the USDC tip via AppKit / Viem
      const tipResult = await sendUSDCTip(walletClient, recipientProfile.address, amount, publicClient);
      if (!tipResult.success) {
        throw new Error("USDC tip payment failed");
      }

      console.log("Tipped USDC! Now recording reputation feedback onchain...");

      // Step B: Record the tip as feedback on the ReputationRegistry
      const agentId = BigInt(recipientProfile.tokenId);
      const tipValue = parseFloat(amount);
      
      // Calculate reputation boost based on tip size
      // e.g. $0.10 tip = +1, $1.00 tip = +10, capped at +30 points
      const scoreBoost = BigInt(Math.min(Math.max(Math.floor(tipValue * 10), 1), 30));
      const feedbackType = 1; // Type 1: Tip & Support
      const tag = `USDC Tip ($${amount})`;
      const metadataURI = "";
      const evidenceURI = tipResult.hash; // Link to transaction hash as evidence
      const feedbackHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

      // Call ReputationRegistry.giveFeedback
      const feedbackHashTx = await walletClient!.writeContract({
        address: REPUTATION_REGISTRY,
        abi: reputationAbi,
        functionName: "giveFeedback",
        args: [
          agentId,
          scoreBoost,
          feedbackType,
          tag,
          metadataURI,
          evidenceURI,
          comment,
          feedbackHash,
        ],
        chain: arcTestnet,
        account: userAddress,
      });

      console.log("Tipping reputation registered! Tx Hash:", feedbackHashTx);
      await publicClient!.waitForTransactionReceipt({ hash: feedbackHashTx });
      console.log("Tipping reputation confirmed onchain!");

      // Update the local storage profile data to reflect this onchain boost in the UI
      updateLocalProfileStats(recipientProfile.address, Number(scoreBoost), tipValue, 0);
      await refreshProfiles();

      return {
        success: true,
        tipHash: tipResult.hash,
        reputationHash: feedbackHashTx
      };
    } catch (error: any) {
      console.error("Tipping process failed:", error);
      throw new Error(error.shortMessage || error.message || "Tipping process failed");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Helper to persist score boosts and tips count in localStorage
   */
  const updateLocalProfileStats = (
    address: string,
    scoreIncrease: number,
    tipAmount: number,
    endorsementIncrease: number
  ) => {
    // 1. Check if profile exists in local minted profiles
    const stored = localStorage.getItem("arcid_minted_profiles");
    let customProfiles: ArcIDProfile[] = stored ? JSON.parse(stored) : [];
    
    // Find in custom profiles
    let found = customProfiles.find(p => p.address.toLowerCase() === address.toLowerCase());
    
    // If not in custom profiles (i.e. it's a mock profile), let's create a custom entry overriding it
    if (!found) {
      const mock = MOCK_PROFILES.find((p: any) => p.address.toLowerCase() === address.toLowerCase());
      if (mock) {
        found = { ...mock };
        customProfiles.push(found);
      }
    }

    if (found) {
      found.reputationScore = Math.min((found.reputationScore || 0) + scoreIncrease, 100);
      found.tipsReceived = parseFloat(((found.tipsReceived || 0) + tipAmount).toFixed(2));
      found.endorsements = (found.endorsements || 0) + endorsementIncrease;
      
      // Also add endorsement/tip to reputation score and save back
      localStorage.setItem("arcid_minted_profiles", JSON.stringify(customProfiles));
    }
  };

  return {
    loading,
    endorseProfile,
    sendTipAndEndorse
  };
}
