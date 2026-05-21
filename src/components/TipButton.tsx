import { useState } from "react";
import { Coins, X, Loader2, Heart, ExternalLink, CheckCircle } from "lucide-react";
import type { ArcIDProfile } from "../hooks/useArcID";
import { useReputation } from "../hooks/useReputation";
import { useAccount } from "wagmi";

interface TipButtonProps {
  recipient: ArcIDProfile;
}

export default function TipButton({ recipient }: TipButtonProps) {
  const { isConnected } = useAccount();
  const { sendTipAndEndorse } = useReputation();

  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("0.10");
  const [comment, setComment] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  
  // Transaction flow states
  const [txStep, setTxStep] = useState<"idle" | "sending-usdc" | "registering-reputation" | "success" | "error">("idle");
  const [usdcTxHash, setUsdcTxHash] = useState("");
  const [reputationTxHash, setReputationTxHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const presets = ["0.10", "0.50", "1.00"];

  const handleOpen = () => {
    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }
    setIsOpen(true);
    setTxStep("idle");
    setUsdcTxHash("");
    setReputationTxHash("");
    setErrorMessage("");
    setComment("");
    setAmount("0.10");
    setCustomAmount("");
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = amount === "custom" ? customAmount : amount;
    
    if (!finalAmount || isNaN(parseFloat(finalAmount)) || parseFloat(finalAmount) <= 0) {
      alert("Please specify a valid USDC amount.");
      return;
    }

    try {
      // Step 1: Sending USDC
      setTxStep("sending-usdc");
      setErrorMessage("");
      
      const finalComment = comment || `Vouch and USDC tip of $${finalAmount}`;
      
      const result = await sendTipAndEndorse(recipient, finalAmount, finalComment);
      
      // Step 2: Registering feedback
      setTxStep("registering-reputation");
      setUsdcTxHash(result.tipHash);
      setReputationTxHash(result.reputationHash);
      
      // Step 3: Success
      setTxStep("success");
    } catch (err: any) {
      console.error(err);
      setTxStep("error");
      setErrorMessage(err.message || "An unexpected error occurred during tipping.");
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleOpen}
        className="flex-1 flex items-center justify-center gap-2 bg-accent-primary text-bg-primary font-display font-bold py-3 px-4 rounded-xl hover:bg-accent-primary/80 transition-all hover:shadow-[0_0_15px_rgba(0,255,136,0.4)]"
      >
        <Coins className="w-5 h-5" />
        Send USDC Tip
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/95 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-bg-card border border-accent-primary/30 rounded-2xl shadow-[0_0_50px_rgba(0,255,136,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-accent-primary/10">
              <h3 className="text-lg font-bold font-display tracking-wider text-text-primary flex items-center gap-2">
                <Coins className="text-accent-primary w-5 h-5" />
                TIP <span className="text-accent-primary">{recipient.name.split(" ")[0]}</span>
              </h3>
              <button
                onClick={handleClose}
                className="text-text-secondary hover:text-accent-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Multi-step Form */}
            <div className="p-6">
              {txStep === "idle" && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Preset selections */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-secondary uppercase tracking-widest block">Select Amount (USDC)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {presets.map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => {
                            setAmount(val);
                            setCustomAmount("");
                          }}
                          className={`py-2.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                            amount === val
                              ? "bg-accent-primary/20 border-accent-primary text-accent-primary shadow-[0_0_10px_rgba(0,255,136,0.2)]"
                              : "bg-bg-secondary border-accent-primary/10 hover:border-accent-primary/40 text-text-secondary"
                          }`}
                        >
                          ${val}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setAmount("custom")}
                        className={`py-2.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                          amount === "custom"
                            ? "bg-accent-primary/20 border-accent-primary text-accent-primary shadow-[0_0_10px_rgba(0,255,136,0.2)]"
                            : "bg-bg-secondary border-accent-primary/10 hover:border-accent-primary/40 text-text-secondary"
                        }`}
                      >
                        Custom
                      </button>
                    </div>
                  </div>

                  {/* Custom input if selected */}
                  {amount === "custom" && (
                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-150">
                      <label className="text-xs font-mono text-text-secondary uppercase tracking-widest block">Custom Amount (USDC)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.05"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full bg-bg-secondary border border-accent-primary/20 hover:border-accent-primary/40 focus:border-accent-primary focus:outline-none rounded-xl px-4 py-3 text-sm font-mono text-accent-primary"
                        required
                      />
                    </div>
                  )}

                  {/* Comment */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-text-secondary uppercase tracking-widest block">Message / Vouch Comment</label>
                    <textarea
                      placeholder="e.g. Great work on the smart contract integration! 🚀"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      maxLength={100}
                      rows={3}
                      className="w-full bg-bg-secondary border border-accent-primary/20 hover:border-accent-primary/40 focus:border-accent-primary focus:outline-none rounded-xl px-4 py-3 text-sm text-text-primary"
                    />
                  </div>

                  {/* Submit Trigger */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-accent-primary text-bg-primary font-display font-bold py-3.5 rounded-xl hover:bg-accent-primary/80 transition-all hover:shadow-[0_0_15px_rgba(0,255,136,0.3)]"
                  >
                    <Heart className="w-4 h-4 fill-bg-primary" />
                    Confirm Tip & Endorse
                  </button>
                </form>
              )}

              {/* Step 1 Loading: Tipping USDC */}
              {txStep === "sending-usdc" && (
                <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
                  <Loader2 className="w-10 h-10 text-accent-secondary animate-spin" />
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-text-primary">Step 1: Sending USDC Tip</h4>
                    <p className="text-xs text-text-secondary max-w-xs font-mono">
                      Transferring USDC instantly on Arc Testnet via Circle App Kit...
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2 Loading: Registering Reputation */}
              {txStep === "registering-reputation" && (
                <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
                  <Loader2 className="w-10 h-10 text-accent-primary animate-spin" />
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-text-primary">Step 2: Recording Trust Feedback</h4>
                    <p className="text-xs text-text-secondary max-w-xs font-mono">
                      USDC Tipped! Submitting transaction reference and reputation score to ReputationRegistry...
                    </p>
                  </div>
                  {usdcTxHash && (
                    <a
                      href={`https://testnet.arcscan.app/tx/${usdcTxHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-mono text-accent-secondary hover:underline"
                    >
                      View USDC Tx
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Step 3 Success */}
              {txStep === "success" && (
                <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
                  <div className="w-12 h-12 bg-accent-primary/10 border border-accent-primary rounded-full flex items-center justify-center text-accent-primary">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-accent-primary">Nanopayment Successful!</h4>
                    <p className="text-xs text-text-secondary max-w-xs">
                      USDC transfer completed and trust feedback recorded securely on Arc Blockchain.
                    </p>
                  </div>

                  <div className="w-full bg-bg-secondary/60 border border-accent-primary/10 rounded-xl p-3 space-y-2 text-left">
                    <span className="text-[9px] font-mono text-accent-secondary uppercase tracking-widest block">Transaction Evidences</span>
                    
                    {usdcTxHash && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary font-mono">USDC Tip:</span>
                        <a
                          href={`https://testnet.arcscan.app/tx/${usdcTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 font-mono text-accent-primary hover:underline"
                        >
                          {usdcTxHash.substring(0, 10)}...{usdcTxHash.substring(usdcTxHash.length - 8)}
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    )}

                    {reputationTxHash && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary font-mono">Reputation Tx:</span>
                        <a
                          href={`https://testnet.arcscan.app/tx/${reputationTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 font-mono text-accent-primary hover:underline"
                        >
                          {reputationTxHash.substring(0, 10)}...{reputationTxHash.substring(reputationTxHash.length - 8)}
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full bg-accent-primary/10 hover:bg-accent-primary/20 border border-accent-primary/30 text-accent-primary text-xs font-mono font-bold py-2 rounded-lg"
                  >
                    Close Modal
                  </button>
                </div>
              )}

              {/* Step Error */}
              {txStep === "error" && (
                <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
                  <div className="w-12 h-12 bg-red-950/20 border border-red-500 rounded-full flex items-center justify-center text-red-400">
                    <span className="text-lg font-bold">⚠️</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-red-400">Transaction Failed</h4>
                    <p className="text-xs text-text-secondary max-w-xs">
                      {errorMessage || "The wallet transaction was rejected or encountered a network error."}
                    </p>
                  </div>
                  <button
                    onClick={() => setTxStep("idle")}
                    className="w-full bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 text-red-400 text-xs font-mono font-bold py-2 rounded-lg"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
