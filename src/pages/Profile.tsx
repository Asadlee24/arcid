// src/pages/Profile.tsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useArcID } from "../hooks/useArcID";
import { useReputation } from "../hooks/useReputation";
import { useAccount } from "wagmi";
import ProfileCard from "../components/ProfileCard";
import TipButton from "../components/TipButton";
import ReputationPanel from "../components/ReputationPanel";
import { Star, Calendar, Share2, Copy, Check, ExternalLink, ArrowLeft, Loader2, Sparkles, MessageSquare, HelpCircle } from "lucide-react";

export default function Profile() {
  const { address } = useParams<{ address: string }>();
  const { getProfileByAddress } = useArcID();
  const { endorseProfile, loading: endorseLoading } = useReputation();
  const { isConnected, address: connectedAddress } = useAccount();

  const [profile, setProfile] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);

  // Endorsement comment
  const [endorseComment, setEndorseComment] = useState("");
  const [showEndorseBox, setShowEndorseBox] = useState(false);

  // Activity logs feed
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (address) {
      const p = getProfileByAddress(address);
      setProfile(p);
      
      // Load activities for this profile
      const storedActivities = localStorage.getItem(`arcid_activity_${address.toLowerCase()}`);
      if (storedActivities) {
        setActivities(JSON.parse(storedActivities));
      } else {
        // Pre-populate some active mock activities so it looks rich
        const mockAct = [
          {
            type: "Endorsement",
            from: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // Asad Lee
            comment: "Exceptional skills! Very active in developer channels.",
            timestamp: "1 day ago",
            tx: "0x539bf54a6145ae0d15da6145ae0d15d6145ae0d15da6145ae0d15da6145ae0"
          },
          {
            type: "USDC Tip",
            from: "0xcd3B766CCDd6ae435b6789e03d12FA4293BC15d3",
            comment: "Gas optimization voucher tip.",
            amount: "1.00",
            timestamp: "2 days ago",
            tx: "0x125b2a0c6d71b3da2bd6045ae0d15da6145ae0d15da6145ae0d15da6145ae0"
          }
        ];
        localStorage.setItem(`arcid_activity_${address.toLowerCase()}`, JSON.stringify(mockAct));
        setActivities(mockAct);
      }
    }
  }, [address, getProfileByAddress]);

  if (!profile) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-6">
        <div className="w-16 h-16 bg-bg-secondary border border-accent-primary/20 rounded-2xl flex items-center justify-center text-accent-primary mx-auto islamic-star animate-pulse">
          <HelpCircle className="w-8 h-8 text-accent-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-display text-text-primary">Passport Not Found</h2>
          <p className="text-xs text-text-secondary leading-relaxed font-mono">
            The MetaMask address <span className="text-accent-primary font-bold">{address?.substring(0, 10)}...</span> does not possess a minted ERC-8004 identity on Arc network yet.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            to="/explore"
            className="flex-1 bg-accent-primary text-bg-primary font-display font-bold py-2.5 rounded-xl text-xs uppercase tracking-widest text-center"
          >
            Mint Your Identity
          </Link>
          <Link
            to="/"
            className="flex-1 bg-bg-secondary border border-accent-primary/20 text-text-primary font-display font-bold py-2.5 rounded-xl text-xs uppercase tracking-widest text-center"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(profile.address);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  const handleEndorse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      const commentText = endorseComment.trim() || "Vouch for specialized Web3 capability!";
      const result = await endorseProfile(profile, commentText);
      
      if (result.success) {
        // Record activity log
        const newAct = {
          type: "Endorsement",
          from: connectedAddress || "Anonymous Observer",
          comment: commentText,
          timestamp: "Just now",
          tx: result.hash
        };
        const updatedAct = [newAct, ...activities];
        localStorage.setItem(`arcid_activity_${profile.address.toLowerCase()}`, JSON.stringify(updatedAct));
        setActivities(updatedAct);

        // Reset
        setEndorseComment("");
        setShowEndorseBox(false);
        alert("Peer endorsement recorded permanently onchain!");
        
        // Refresh
        const updatedProfile = getProfileByAddress(profile.address);
        setProfile(updatedProfile);
      }
    } catch (err: any) {
      alert(`Endorsement transaction failed: ${err.message || err}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 space-y-12">
      
      {/* Return CTA */}
      <Link to="/explore" className="inline-flex items-center gap-2 text-xs font-mono text-text-secondary hover:text-accent-primary transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        Return to Explore Directory
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Left Column: 3D flip card + Presets actions */}
        <div className="lg:col-span-1 space-y-6">
          
          <ProfileCard profile={profile} />

          {/* Action Deck */}
          <div className="bg-bg-card border border-accent-primary/10 rounded-2xl p-4 space-y-3">
            
            <div className="flex gap-2">
              {/* Copy Address */}
              <button
                onClick={handleCopyAddress}
                className="flex-1 flex items-center justify-center gap-1.5 bg-bg-secondary hover:bg-bg-primary border border-accent-primary/10 hover:border-accent-primary/40 rounded-xl py-3 text-xs font-mono text-text-primary transition-colors"
              >
                {copiedAddr ? <Check className="w-3.5 h-3.5 text-accent-primary" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Address
              </button>

              {/* Share Profile Link */}
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-1.5 bg-bg-secondary hover:bg-bg-primary border border-accent-primary/10 hover:border-accent-primary/40 rounded-xl py-3 text-xs font-mono text-text-primary transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-accent-primary" /> : <Share2 className="w-3.5 h-3.5" />}
                Share Card
              </button>
            </div>

            {/* USDC Nano Payment Trigger */}
            <div className="flex gap-2 pt-1">
              <TipButton recipient={profile} />
              
              {/* Endorse / Vouch Trigger */}
              <button
                onClick={() => setShowEndorseBox(!showEndorseBox)}
                className="flex-1 flex items-center justify-center gap-2 bg-bg-secondary hover:bg-bg-primary border border-accent-gold/40 hover:border-accent-gold text-accent-gold font-display font-bold py-3 rounded-xl transition-all"
              >
                <Star className="w-4 h-4" />
                Vouch / Endorse
              </button>
            </div>

            {/* Endorsement commentary drop-box */}
            {showEndorseBox && (
              <form onSubmit={handleEndorse} className="p-3 bg-bg-secondary/40 border border-accent-gold/25 rounded-xl space-y-3 mt-3 animate-in slide-in-from-top-2 duration-150">
                <span className="text-[9px] font-mono text-accent-gold uppercase tracking-widest block">Submit Onchain Vouch</span>
                <input
                  type="text"
                  placeholder="e.g. Highly recommend this builder for Solidity auditing!"
                  value={endorseComment}
                  onChange={(e) => setEndorseComment(e.target.value)}
                  className="w-full bg-bg-primary border border-accent-gold/20 focus:border-accent-gold focus:outline-none rounded-lg px-3 py-2 text-xs text-text-primary"
                  required
                />
                <button
                  type="submit"
                  disabled={endorseLoading}
                  className="w-full bg-accent-gold/15 hover:bg-accent-gold/25 border border-accent-gold/40 text-accent-gold text-[10px] font-mono font-bold py-1.5 rounded-lg flex items-center justify-center gap-1.5"
                >
                  {endorseLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Star className="w-3.5 h-3.5" />}
                  Confirm Vouch (+10 Rep)
                </button>
              </form>
            )}

          </div>

        </div>

        {/* Right Column: AI Co-Processor + Bio/Details + Feed */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Identity details */}
          <div className="bg-bg-card border border-accent-primary/10 rounded-2xl p-6 md:p-8 space-y-6">
            
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-accent-secondary uppercase tracking-[0.2em] block">Professional Summary</span>
              <h3 className="text-2xl font-black font-display text-text-primary tracking-wide">{profile.name}</h3>
              <p className="text-xs font-mono text-accent-primary">{profile.title}</p>
            </div>

            {/* Bio */}
            <div className="bg-bg-primary/50 border border-accent-primary/5 rounded-xl p-4">
              <p className="text-sm text-text-secondary leading-relaxed font-body">"{profile.bio}"</p>
            </div>

            {/* Links and metadata */}
            <div className="flex flex-wrap gap-6 pt-2 border-t border-accent-primary/15 text-xs font-mono">
              {profile.twitter && (
                <a
                  href={`https://twitter.com/${profile.twitter.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-text-secondary hover:text-accent-primary transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-accent-primary" />
                  <span>Twitter: {profile.twitter}</span>
                </a>
              )}

              {profile.portfolio && (
                <a
                  href={profile.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-text-secondary hover:text-accent-primary transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent-primary" />
                  <span>Portfolio: {profile.portfolio.replace("https://", "")}</span>
                </a>
              )}

              <div className="flex items-center gap-1.5 text-text-secondary">
                <Calendar className="w-3.5 h-3.5 text-accent-primary" />
                <span>Joined: {profile.joinedDate || "May 2026"}</span>
              </div>
            </div>

          </div>

          {/* AI Tabbed Co-Processor (Audit, recommendations, roaster!) */}
          <ReputationPanel profile={profile} />

          {/* Activity Logs feed */}
          <div className="bg-bg-card border border-accent-primary/10 rounded-2xl p-6">
            <h4 className="text-base font-bold font-display text-text-primary tracking-wider uppercase mb-4 pb-2 border-b border-accent-primary/15 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-accent-primary" />
              Onchain Activity Logs
            </h4>

            <div className="divide-y divide-accent-primary/5">
              {activities.length === 0 ? (
                <p className="py-6 text-center text-xs font-mono text-text-secondary">No recorded vouches or payments for this ID.</p>
              ) : (
                activities.map((act, idx) => (
                  <div key={idx} className="py-4 space-y-2 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                          act.type === "Endorsement"
                            ? "bg-accent-gold/15 text-accent-gold border border-accent-gold/30"
                            : "bg-accent-primary/15 text-accent-primary border border-accent-primary/30"
                        }`}>
                          {act.type}
                        </span>
                        
                        <span className="text-[10px] font-mono text-text-secondary">
                          From: {act.from.substring(0, 6)}...{act.from.substring(act.from.length - 4)}
                        </span>
                      </div>

                      <span className="text-[9px] font-mono text-text-secondary">{act.timestamp}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs gap-4">
                      <p className="text-text-primary font-body">"{act.comment}"</p>
                      
                      {act.amount && (
                        <span className="text-xs font-mono font-black text-accent-primary flex-shrink-0">
                          +${parseFloat(act.amount).toFixed(2)} USDC
                        </span>
                      )}
                    </div>

                    {act.tx && (
                      <a
                        href={`https://testnet.arcscan.app/tx/${act.tx}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[9px] font-mono text-accent-secondary hover:underline"
                      >
                        Verify Block receipt
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
