import { useState } from "react";
import { ShieldCheck, Sparkles, Brain, Cpu, Flame, Loader2 } from "lucide-react";
import type { ArcIDProfile } from "../hooks/useArcID";
import { analyzeReputation, suggestSkills, roastProfile } from "../lib/claude";
import type { ReputationAnalysis } from "../lib/claude";

interface ReputationPanelProps {
  profile: ArcIDProfile;
}

export default function ReputationPanel({ profile }: ReputationPanelProps) {
  const [activeTab, setActiveTab] = useState<"audit" | "skills" | "roast">("audit");
  
  // AI States
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<ReputationAnalysis | null>(null);

  const [skillsLoading, setSkillsLoading] = useState(false);
  const [suggestedSkillsList, setSuggestedSkillsList] = useState<string[]>([]);

  const [roastLoading, setRoastLoading] = useState(false);
  const [roastText, setRoastText] = useState("");

  const triggerAudit = async () => {
    setAuditLoading(true);
    try {
      const res = await analyzeReputation(
        profile.name,
        profile.title,
        profile.skills,
        profile.tipsReceived || 0,
        profile.endorsements || 0,
        15 // active days
      );
      setAuditResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setAuditLoading(false);
    }
  };

  const triggerSkills = async () => {
    setSkillsLoading(true);
    try {
      const res = await suggestSkills(profile.skills);
      setSuggestedSkillsList(res);
    } catch (e) {
      console.error(e);
    } finally {
      setSkillsLoading(false);
    }
  };

  const triggerRoast = async () => {
    setRoastLoading(true);
    try {
      const res = await roastProfile(profile.name, profile.title, profile.skills, profile.reputationScore || 30);
      setRoastText(res);
    } catch (e) {
      console.error(e);
    } finally {
      setRoastLoading(false);
    }
  };

  return (
    <div className="bg-bg-card border border-accent-primary/20 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.4)]">
      
      {/* Terminal Header */}
      <div className="bg-bg-secondary px-6 py-4 border-b border-accent-primary/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-accent-primary animate-pulse" />
          <span className="font-display font-bold text-text-primary text-sm tracking-wider uppercase">
            Claude AI Co-Processor <span className="text-[10px] font-mono text-accent-primary/60">v3.5</span>
          </span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-accent-primary/80"></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-accent-primary/10 bg-bg-secondary/40">
        <button
          onClick={() => setActiveTab("audit")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-mono font-bold tracking-wider uppercase transition-colors border-b-2 ${
            activeTab === "audit"
              ? "border-accent-primary text-accent-primary bg-bg-card"
              : "border-transparent text-text-secondary hover:text-accent-primary"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Trust Audit
        </button>

        <button
          onClick={() => setActiveTab("skills")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-mono font-bold tracking-wider uppercase transition-colors border-b-2 ${
            activeTab === "skills"
              ? "border-accent-primary text-accent-primary bg-bg-card"
              : "border-transparent text-text-secondary hover:text-accent-primary"
          }`}
        >
          <Cpu className="w-4 h-4" />
          AI Skill Lab
        </button>

        <button
          onClick={() => setActiveTab("roast")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-mono font-bold tracking-wider uppercase transition-colors border-b-2 ${
            activeTab === "roast"
              ? "border-accent-primary text-accent-primary bg-bg-card"
              : "border-transparent text-text-secondary hover:text-accent-primary"
          }`}
        >
          <Flame className="w-4 h-4" />
          Roast Me
        </button>
      </div>

      {/* Content Body */}
      <div className="p-6">
        
        {/* TAB 1: TRUST AUDIT */}
        {activeTab === "audit" && (
          <div className="space-y-4">
            <p className="text-xs text-text-secondary leading-relaxed font-mono">
              The AI Co-Processor evaluates this profile's onchain credentials (tips, volume, endorsements, role, and active days) to formulate a cryptographically un-biased rating assessment.
            </p>

            {auditResult ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-bg-primary/60 border border-accent-primary/20 rounded-xl p-4 text-center">
                    <span className="text-[10px] font-mono text-text-secondary uppercase">Calculated score</span>
                    <span className="text-3xl font-bold font-display text-accent-primary block mt-1 stat-number">
                      {auditResult.score}/100
                    </span>
                  </div>

                  <div className="bg-bg-primary/60 border border-accent-primary/20 rounded-xl p-4 text-center flex flex-col justify-center">
                    <span className="text-[10px] font-mono text-text-secondary uppercase">Reputation Rank</span>
                    <span className="text-sm font-mono font-bold text-accent-gold mt-1 block">
                      {auditResult.tier}
                    </span>
                  </div>
                </div>

                <div className="bg-bg-primary/30 border border-accent-primary/10 rounded-xl p-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-mono text-accent-primary uppercase tracking-widest block">AI Verdict:</span>
                    <p className="text-xs text-text-primary mt-1 leading-relaxed">{auditResult.verdict}</p>
                  </div>
                  <div className="pt-2 border-t border-accent-primary/5">
                    <span className="text-[10px] font-mono text-accent-secondary uppercase tracking-widest block">Strategic Action Plan:</span>
                    <p className="text-xs text-text-primary mt-1 leading-relaxed">{auditResult.advice}</p>
                  </div>
                </div>

                <button
                  onClick={triggerAudit}
                  className="w-full flex items-center justify-center gap-1.5 bg-bg-secondary hover:bg-bg-primary border border-accent-primary/30 text-accent-primary text-xs font-mono font-bold py-2 rounded-xl"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Re-Audit Profile
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <button
                  onClick={triggerAudit}
                  disabled={auditLoading}
                  className="bg-accent-primary text-bg-primary font-display font-bold px-6 py-3 rounded-xl hover:bg-accent-primary/80 transition-all shadow-[0_0_15px_rgba(0,255,136,0.15)] flex items-center gap-2"
                >
                  {auditLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing Credentials...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 fill-bg-primary" />
                      Run AI Reputation Audit
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AI SKILL LAB */}
        {activeTab === "skills" && (
          <div className="space-y-4">
            <p className="text-xs text-text-secondary leading-relaxed font-mono">
              Based on the existing skill tags linked to this ArcID NFT, Claude suggests exactly three premium web3/onchain skills that would massively boost this builder's onchain capability index.
            </p>

            {suggestedSkillsList.length > 0 ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-accent-primary uppercase tracking-widest block">AI Proposed Skillsets:</span>
                  <div className="grid grid-cols-1 gap-2">
                    {suggestedSkillsList.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between bg-bg-primary/50 border border-accent-primary/10 rounded-xl px-4 py-3">
                        <span className="text-xs font-mono font-bold text-accent-primary">{skill}</span>
                        <span className="text-[9px] font-mono text-text-secondary uppercase">High Demand 🔥</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={triggerSkills}
                  className="w-full flex items-center justify-center gap-1.5 bg-bg-secondary hover:bg-bg-primary border border-accent-primary/30 text-accent-primary text-xs font-mono font-bold py-2 rounded-xl"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Refresh Suggestions
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <button
                  onClick={triggerSkills}
                  disabled={skillsLoading}
                  className="bg-accent-primary text-bg-primary font-display font-bold px-6 py-3 rounded-xl hover:bg-accent-primary/80 transition-all shadow-[0_0_15px_rgba(0,255,136,0.15)] flex items-center gap-2"
                >
                  {skillsLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Recommending Skills...
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4 fill-bg-primary" />
                      Analyze & Suggest Skills
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ROAST ME */}
        {activeTab === "roast" && (
          <div className="space-y-4">
            <p className="text-xs text-text-secondary leading-relaxed font-mono">
              Ready to take a hit? The AI roasts this passport's developer credentials, reputation score, and tech choices. Side-effects may include immediate developer ego check.
            </p>

            {roastText ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="bg-bg-primary/60 border border-red-500/20 rounded-xl p-4 font-mono text-xs text-red-400 border-neon-blue relative overflow-hidden">
                  <div className="absolute top-2 right-2 text-red-500/40 text-xs select-none">SYSTEM_OVERLOAD</div>
                  <p className="leading-relaxed">"{roastText}"</p>
                </div>

                <button
                  onClick={triggerRoast}
                  className="w-full flex items-center justify-center gap-1.5 bg-bg-secondary hover:bg-bg-primary border border-red-500/30 text-red-400 text-xs font-mono font-bold py-2 rounded-xl"
                >
                  <Flame className="w-3.5 h-3.5 animate-pulse" />
                  Roast Me Again!
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <button
                  onClick={triggerRoast}
                  disabled={roastLoading}
                  className="bg-red-500 hover:bg-red-600 text-bg-primary font-display font-bold px-6 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(239,68,68,0.25)] flex items-center gap-2"
                >
                  {roastLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Roasting in progress...
                    </>
                  ) : (
                    <>
                      <Flame className="w-4 h-4 fill-bg-primary" />
                      Trigger AI Roast
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
