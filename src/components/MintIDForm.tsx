// src/components/MintIDForm.tsx
import React, { useState } from "react";
import { User, Shield, Key, Loader2, Sparkles, Plus, X, Globe, Twitter, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { useArcID } from "../hooks/useArcID";
import { generateBio } from "../lib/claude";
import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";

export default function MintIDForm() {
  const { isConnected, address } = useAccount();
  const { registerIdentity, userProfile, loading: mintLoading } = useArcID();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [twitter, setTwitter] = useState("");
  const [portfolio, setPortfolio] = useState("");
  
  // Skills tags
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  
  // AI Bio loading
  const [aiLoading, setAiLoading] = useState(false);

  // Mint flow logs
  const [mintStatus, setMintStatus] = useState<"idle" | "minting" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const presetSkills = ["Solidity", "React", "AI Agents", "Cyber Security", "USDC Pay", "Viem", "Python", "Rust", "TypeScript"];

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customSkillInput.trim();
    if (clean && !selectedSkills.includes(clean)) {
      setSelectedSkills([...selectedSkills, clean]);
      setCustomSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  // AI Bio Generation (calls Claude Sonnet or Fallback)
  const handleAIBioGenerate = async () => {
    if (!name || !title) {
      alert("Please provide a Name and Role/Title first so the AI can craft a custom bio.");
      return;
    }

    setAiLoading(true);
    try {
      const skillsToUse = selectedSkills.length > 0 ? selectedSkills : ["Web3 Building"];
      const generated = await generateBio(name, skillsToUse, title);
      setBio(generated);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      alert("Please connect your MetaMask wallet first.");
      return;
    }
    if (selectedSkills.length === 0) {
      alert("Please select or add at least one skill tag.");
      return;
    }

    try {
      setMintStatus("minting");
      setErrorMessage("");

      const result = await registerIdentity({
        name,
        title,
        bio,
        skills: selectedSkills,
        twitter: twitter.startsWith("@") ? twitter : twitter ? `@${twitter}` : "",
        portfolio: portfolio || ""
      });

      if (result.success) {
        setTxHash(result.hash);
        setMintStatus("success");
        setTimeout(() => {
          navigate(`/profile/${address}`);
        }, 3000);
      }
    } catch (err: any) {
      console.error(err);
      setMintStatus("error");
      setErrorMessage(err.message || "Minting transaction was rejected or failed onchain.");
    }
  };

  if (userProfile) {
    return (
      <div className="bg-bg-card border border-accent-primary/20 rounded-2xl p-6 text-center max-w-lg mx-auto space-y-4 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <CheckCircle className="w-12 h-12 text-accent-primary mx-auto" />
        <div className="space-y-2">
          <h3 className="text-xl font-bold font-display text-text-primary">Passport Already Minted!</h3>
          <p className="text-sm text-text-secondary">
            Your MetaMask address <span className="font-mono text-accent-primary font-bold">{address?.substring(0, 6)}...</span> is already linked to an ArcID passport.
          </p>
        </div>
        <button
          onClick={() => navigate(`/profile/${address}`)}
          className="w-full bg-accent-primary hover:bg-accent-primary/80 text-bg-primary font-display font-bold py-2.5 rounded-xl transition-all"
        >
          View Your Onchain Passport
        </button>
      </div>
    );
  }

  return (
    <div className="bg-bg-card border border-accent-primary/10 rounded-2xl p-6 max-w-2xl mx-auto shadow-[0_0_40px_rgba(2,4,8,0.7)] border-neon">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-accent-primary/10">
        <div className="w-10 h-10 bg-accent-primary/10 rounded-xl flex items-center justify-center border border-accent-primary/30 islamic-star">
          <Shield className="text-accent-primary w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold font-display text-text-primary tracking-wider">
            MINT YOUR <span className="text-accent-primary">ARCID PASSPORT</span>
          </h3>
          <p className="text-xs text-text-secondary font-mono">ERC-8004 Permanent Onchain Identity</p>
        </div>
      </div>

      {mintStatus === "idle" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Display Name */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-text-secondary uppercase tracking-widest block">Display Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Asad Lee"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-bg-secondary border border-accent-primary/20 hover:border-accent-primary/40 focus:border-accent-primary focus:outline-none rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary"
                  required
                />
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-text-secondary" />
              </div>
            </div>

            {/* Role / Title */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-text-secondary uppercase tracking-widest block">Role / Title</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Web3 Security Lead"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-bg-secondary border border-accent-primary/20 hover:border-accent-primary/40 focus:border-accent-primary focus:outline-none rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary"
                  required
                />
                <Key className="absolute left-3.5 top-3.5 w-4 h-4 text-text-secondary" />
              </div>
            </div>

          </div>

          {/* Preset Skills Tags */}
          <div className="space-y-3">
            <label className="text-xs font-mono text-text-secondary uppercase tracking-widest block">Skills & Expertise</label>
            <div className="flex flex-wrap gap-2">
              {presetSkills.map((skill) => {
                const active = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleToggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                      active
                        ? "bg-accent-primary/25 border-accent-primary text-accent-primary shadow-[0_0_10px_rgba(0,255,136,0.15)]"
                        : "bg-bg-secondary border-accent-primary/10 hover:border-accent-primary/30 text-text-secondary"
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
            
            {/* Custom Skill tag input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom skill (e.g. Next.js)"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                className="bg-bg-secondary border border-accent-primary/20 focus:border-accent-primary focus:outline-none rounded-xl px-4 py-2.5 text-xs text-text-primary flex-grow"
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                className="bg-bg-secondary border border-accent-primary/30 hover:border-accent-primary text-accent-primary px-4 py-2 rounded-xl flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Selected Skills Badges */}
            {selectedSkills.length > 0 && (
              <div className="bg-bg-secondary/40 border border-accent-primary/5 rounded-xl p-3 space-y-2">
                <span className="text-[9px] font-mono text-text-secondary uppercase tracking-wider block">Selected Tags:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-bg-primary border border-accent-primary/20 rounded-md px-2.5 py-0.5 text-xs font-mono text-accent-primary flex items-center gap-1"
                    >
                      {skill}
                      <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-red-400">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Bio Section (AI bio supported) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono text-text-secondary uppercase tracking-widest block">Professional Bio</label>
              <button
                type="button"
                onClick={handleAIBioGenerate}
                disabled={aiLoading}
                className="flex items-center gap-1.5 text-xs font-mono text-accent-primary hover:underline hover:text-accent-primary/80 disabled:opacity-50"
              >
                {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Generate with Claude AI
              </button>
            </div>
            <textarea
              placeholder="Tell the onchain world about your credentials, or click 'Generate with Claude AI' to let Claude write a beautiful Web3 bio based on your details..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              rows={4}
              className="w-full bg-bg-secondary border border-accent-primary/20 hover:border-accent-primary/40 focus:border-accent-primary focus:outline-none rounded-xl px-4 py-3 text-sm text-text-primary"
            />
          </div>

          {/* Social Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Twitter */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-text-secondary uppercase tracking-widest block">Twitter/X (Optional)</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="@username"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="w-full bg-bg-secondary border border-accent-primary/20 hover:border-accent-primary/40 focus:border-accent-primary focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary"
                />
                <Twitter className="absolute left-3.5 top-3.5 w-4 h-4 text-text-secondary" />
              </div>
            </div>

            {/* Portfolio */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-text-secondary uppercase tracking-widest block">Portfolio / Github (Optional)</label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://..."
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  className="w-full bg-bg-secondary border border-accent-primary/20 hover:border-accent-primary/40 focus:border-accent-primary focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-xs text-text-primary"
                />
                <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-text-secondary" />
              </div>
            </div>
          </div>

          {/* Warnings and triggers */}
          {!isConnected ? (
            <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 flex gap-3 text-amber-400 text-xs">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-bold uppercase tracking-wider">Wallet Not Connected</p>
                <p className="mt-0.5 text-text-secondary">Please connect your MetaMask wallet in the top bar to enable the onchain minting trigger.</p>
              </div>
            </div>
          ) : (
            <button
              type="submit"
              disabled={mintLoading}
              className="w-full flex items-center justify-center gap-2 bg-accent-primary text-bg-primary font-display font-black py-4 rounded-xl hover:bg-accent-primary/80 transition-all hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] disabled:opacity-50"
            >
              {mintLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  MINTING ERC-8004 PASSPORT ONCHAIN...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 fill-bg-primary" />
                  MINT YOUR ARCID PASSPORT
                </>
              )}
            </button>
          )}

        </form>
      )}

      {/* Mint Loading Overlay Screen */}
      {mintStatus === "minting" && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
          <Loader2 className="w-12 h-12 text-accent-primary animate-spin" />
          <div className="space-y-1">
            <h4 className="font-display text-lg font-bold text-text-primary">Sending Wallet Transaction</h4>
            <p className="text-xs text-text-secondary max-w-sm font-mono mx-auto">
              Please sign the mint contract call in MetaMask. Your digital identity is being anchored permanently on the Arc blockchain!
            </p>
          </div>
        </div>
      )}

      {/* Mint Success Overlay Screen */}
      {mintStatus === "success" && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-accent-primary/10 border border-accent-primary rounded-full flex items-center justify-center text-accent-primary shadow-[0_0_20px_rgba(0,255,136,0.3)]">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="font-display text-xl font-bold text-accent-primary">ArcID Minted Successfully!</h4>
            <p className="text-xs text-text-secondary max-w-sm">
              Your ERC-8004 identity has been registered in the Identity Registry. Redirecting to your digital passport card...
            </p>
          </div>

          {txHash && (
            <a
              href={`https://testnet.arcscan.app/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-bg-secondary border border-accent-primary/20 hover:border-accent-primary rounded-xl px-4 py-2 text-xs font-mono text-accent-primary hover:underline"
            >
              Verify on ArcScan
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}

      {/* Mint Error Screen */}
      {mintStatus === "error" && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
          <div className="w-16 h-16 bg-red-950/20 border border-red-500 rounded-full flex items-center justify-center text-red-400">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="font-display text-lg font-bold text-red-400">Mint Transaction Failed</h4>
            <p className="text-xs text-text-secondary max-w-sm">
              {errorMessage || "The gas limits could not be estimated or your signature was rejected by MetaMask."}
            </p>
          </div>
          <button
            onClick={() => setMintStatus("idle")}
            className="bg-bg-secondary border border-red-500/30 text-red-400 text-xs font-mono font-bold px-6 py-2.5 rounded-xl hover:bg-red-950/40"
          >
            Go Back & Retry
          </button>
        </div>
      )}
    </div>
  );
}
