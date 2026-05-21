import React, { useState } from "react";
import { Copy, Check, ShieldCheck, RefreshCw, Star, Coins, Calendar, ExternalLink } from "lucide-react";
import type { ArcIDProfile } from "../hooks/useArcID";

interface ProfileCardProps {
  profile: ArcIDProfile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate color palette based on address letters to ensure unique aesthetic per identity
  const getAvatarColors = (addr: string) => {
    const cleanAddr = addr.replace("0x", "");
    const charCode = cleanAddr.charCodeAt(0) + cleanAddr.charCodeAt(1) + cleanAddr.charCodeAt(2);
    const hues = [140, 200, 45, 280, 15, 330]; // mint, blue, gold, purple, orange, hot-pink
    const selectedHue = hues[charCode % hues.length];
    
    return {
      bg: `hsl(${selectedHue}, 70%, 15%)`,
      border: `hsl(${selectedHue}, 80%, 45%)`,
      text: `hsl(${selectedHue}, 100%, 80%)`,
    };
  };

  const colors = getAvatarColors(profile.address);

  // Reputation tier styling
  const getReputationTier = (score: number) => {
    if (score >= 86) return { tier: "Diamond 💎", color: "text-[#ffd700] drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]", border: "border-accent-gold" };
    if (score >= 61) return { tier: "Gold 🥇", color: "text-amber-400", border: "border-amber-400/40" };
    if (score >= 31) return { tier: "Silver 🥈", color: "text-slate-300", border: "border-slate-300/40" };
    return { tier: "Bronze 🥉", color: "text-orange-400", border: "border-orange-400/40" };
  };

  const { tier, color: tierColor, border: tierBorder } = getReputationTier(profile.reputationScore || 0);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent flip on copy click
    navigator.clipboard.writeText(profile.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getInitials = (name: string) => {
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="w-full max-w-[380px] h-[480px] perspective-1000 cursor-pointer mx-auto group">
      
      {/* 3D Wrapper */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className={`relative w-full h-full profile-card-inner ${
          isFlipped ? "is-flipped" : ""
        }`}
      >
        
        {/* ==================== CARD FRONT ==================== */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-bg-card border border-accent-primary/20 hover:border-accent-primary/50 rounded-3xl p-6 flex flex-col justify-between shadow-[0_0_30px_rgba(2,4,8,0.8)] border-neon overflow-hidden">
          
          {/* Cyber scan line & star overlay */}
          <div className="absolute inset-0 scanline opacity-30 pointer-events-none"></div>
          <div className="absolute top-2 right-2 w-24 h-24 bg-accent-primary/5 rounded-full blur-xl pointer-events-none"></div>

          {/* Top Info */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1.5 bg-accent-primary/10 border border-accent-primary/30 rounded-full px-3 py-1 font-mono text-[9px] text-accent-primary tracking-widest uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ERC-8004 Verified</span>
            </div>
            
            {/* 3D Flip Prompt Indicator */}
            <span className="text-[9px] font-mono text-text-secondary group-hover:text-accent-primary flex items-center gap-1 transition-colors">
              <RefreshCw className="w-3 h-3 animate-spin-slow" />
              Flip
            </span>
          </div>

          {/* Core Avatar + Name Block */}
          <div className="flex flex-col items-center text-center space-y-4 my-auto">
            {/* Avatar Initials with dynamic HSL color */}
            <div
              style={{ backgroundColor: colors.bg, borderColor: colors.border, color: colors.text }}
              className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold font-display border-2 shadow-[0_0_20px_rgba(0,0,0,0.5)] relative"
            >
              {getInitials(profile.name)}
              {/* Floating neon status dot */}
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-accent-primary rounded-full border border-bg-primary flex items-center justify-center text-[7px] text-bg-primary font-black animate-pulse">✓</div>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold font-display tracking-wide text-text-primary group-hover:text-accent-primary transition-colors">
                {profile.name}
              </h2>
              <p className="text-xs font-mono text-text-secondary max-w-[260px] mx-auto min-h-[32px] flex items-center justify-center">
                {profile.title}
              </p>
            </div>

            {/* Dynamic mini rating */}
            <div className="flex items-center gap-1.5 bg-bg-primary/60 border border-accent-primary/10 rounded-lg px-2.5 py-1">
              <span className="text-[10px] font-mono text-text-secondary uppercase">Reputation:</span>
              <span className="text-xs font-mono font-bold text-accent-primary stat-number">{profile.reputationScore}</span>
            </div>
          </div>

          {/* Bottom Skills Row */}
          <div className="space-y-3">
            <div className="flex flex-wrap justify-center gap-1.5">
              {profile.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="bg-bg-primary border border-accent-primary/20 rounded-md px-2.5 py-0.5 text-[9px] font-mono text-accent-primary"
                >
                  {skill}
                </span>
              ))}
              {profile.skills.length > 3 && (
                <span className="bg-bg-primary border border-accent-primary/20 rounded-md px-1.5 py-0.5 text-[9px] font-mono text-text-secondary">
                  +{profile.skills.length - 3}
                </span>
              )}
            </div>

            {/* Address */}
            <div className="flex items-center justify-between bg-bg-secondary border border-accent-primary/10 rounded-xl p-2.5">
              <span className="text-[10px] font-mono text-text-secondary">
                {profile.address.substring(0, 8)}...{profile.address.substring(profile.address.length - 6)}
              </span>
              <button
                onClick={handleCopy}
                className="p-1 hover:text-accent-primary text-text-secondary transition-colors"
                title="Copy Address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-accent-primary" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

        </div>

        {/* ==================== CARD BACK ==================== */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-bg-card border border-accent-secondary/20 hover:border-accent-secondary/50 rounded-3xl p-6 flex flex-col justify-between shadow-[0_0_30px_rgba(2,4,8,0.8)] border-neon-blue overflow-hidden">
          
          {/* Cyber background overlay */}
          <div className="absolute top-2 left-2 w-28 h-28 bg-accent-secondary/5 rounded-full blur-xl pointer-events-none"></div>

          {/* Header */}
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-accent-secondary tracking-widest uppercase">
              Passport Credentials
            </span>
            <span className="text-[9px] font-mono text-accent-secondary flex items-center gap-1">
              <RefreshCw className="w-3 h-3 rotate-180" />
              Flip Back
            </span>
          </div>

          {/* Stats Matrix */}
          <div className="my-auto space-y-6">
            
            {/* Reputation tier */}
            <div className="text-center space-y-1">
              <span className="text-[9px] font-mono text-text-secondary uppercase tracking-widest block">Trust Tier</span>
              <div className={`inline-block border-2 ${tierBorder} bg-bg-primary/50 px-4 py-1.5 rounded-full`}>
                <span className={`text-sm font-mono font-bold ${tierColor}`}>{tier}</span>
              </div>
            </div>

            {/* Grid statistics */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Endorsements */}
              <div className="bg-bg-primary/50 border border-accent-secondary/10 rounded-xl p-3 text-center">
                <Star className="w-4 h-4 text-accent-primary mx-auto mb-1 opacity-70" />
                <span className="text-[9px] font-mono text-text-secondary uppercase">Endorsed</span>
                <span className="text-sm font-mono font-bold text-text-primary block mt-0.5">
                  {profile.endorsements || 0} Vouch
                </span>
              </div>

              {/* Tips Received */}
              <div className="bg-bg-primary/50 border border-accent-secondary/10 rounded-xl p-3 text-center">
                <Coins className="w-4 h-4 text-accent-gold mx-auto mb-1 opacity-80" />
                <span className="text-[9px] font-mono text-text-secondary uppercase">USDC Tips</span>
                <span className="text-sm font-mono font-bold text-accent-primary block mt-0.5">
                  ${parseFloat(profile.tipsReceived?.toString() || "0").toFixed(2)}
                </span>
              </div>

            </div>

            {/* General logs */}
            <div className="space-y-2 bg-bg-secondary/40 rounded-xl p-3 border border-accent-secondary/10">
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-mono flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-accent-secondary" />
                  Passport Issued:
                </span>
                <span className="font-mono text-text-primary">{profile.joinedDate || "May 2026"}</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary font-mono flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-accent-secondary" />
                  Gas Token:
                </span>
                <span className="font-mono text-accent-primary font-bold">USDC</span>
              </div>

            </div>

          </div>

          {/* Action Row */}
          <div className="space-y-3">
            
            {/* View on ArcScan link */}
            <a
              href={`https://testnet.arcscan.app/address/${profile.address}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()} // prevent card flip when clicking link
              className="w-full flex items-center justify-center gap-2 bg-bg-secondary hover:bg-bg-primary border border-accent-secondary/30 hover:border-accent-secondary rounded-xl py-3 text-xs font-mono text-accent-secondary transition-all hover:shadow-[0_0_10px_rgba(0,102,255,0.15)]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Verify on ArcScan</span>
            </a>

          </div>

        </div>

      </div>
    </div>
  );
}
