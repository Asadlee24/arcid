import { useState } from "react";
import { Link } from "react-router-dom";
import { useArcID } from "../hooks/useArcID";
import ProfileCard from "../components/ProfileCard";
import MintIDForm from "../components/MintIDForm";
import Leaderboard from "../components/Leaderboard";
import { Search, Sparkles, ShieldAlert, Cpu, X, ChevronDown } from "lucide-react";

export default function Explore() {
  const { profiles, userProfile } = useArcID();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterSkill, setSelectedFilterSkill] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Mint form drawer/modal trigger
  const [showMintModal, setShowMintModal] = useState(false);

  const skillsList = ["Solidity", "React", "AI Agents", "Cyber Security", "USDC Pay", "Viem", "Python", "Rust", "TypeScript"];

  // Filter profiles based on search and skill
  const filteredProfiles = profiles.filter((prof) => {
    const matchesSearch =
      prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.title.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSkill = selectedFilterSkill
      ? prof.skills.map(s => s.toLowerCase()).includes(selectedFilterSkill.toLowerCase())
      : true;

    return matchesSearch && matchesSkill;
  });

  return (
    <div className="min-h-screen">
      
      {/* ===== Page Hero Header ===== */}
      <div className="bg-gradient-to-b from-accent-primary/5 to-transparent border-b border-accent-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-display tracking-wider text-text-primary uppercase">
                PASSPORT <span className="text-accent-primary">DIRECTORY</span>
              </h2>
              <p className="text-[10px] sm:text-xs font-mono text-text-secondary mt-1">
                Explore and interact with verified onchain identities on Arc Testnet
              </p>
            </div>

            {/* Mint Button Trigger */}
            {!userProfile && (
              <button
                onClick={() => setShowMintModal(true)}
                className="w-full sm:w-auto bg-accent-primary text-bg-primary font-display font-black text-xs uppercase tracking-widest py-3 px-5 rounded-xl hover:bg-accent-primary/80 transition-all hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-bg-primary" />
                Mint Your ArcID
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">

        {/* ===== Search & Filter Bar ===== */}
        <div className="bg-bg-card/70 border border-accent-primary/10 rounded-2xl p-3 sm:p-4 space-y-3">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, role, skills, or 0x address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-primary border border-accent-primary/20 hover:border-accent-primary/40 focus:border-accent-primary focus:outline-none rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-text-primary placeholder:text-text-secondary/50"
            />
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-text-secondary" />
          </div>

          {/* Filter Toggle Button (mobile-friendly) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-xs font-mono text-text-secondary hover:text-accent-primary transition-colors sm:hidden"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            {showFilters ? "Hide Filters" : "Show Skill Filters"}
            {selectedFilterSkill && <span className="text-accent-primary">• {selectedFilterSkill}</span>}
          </button>

          {/* Skills Tag Filters - always visible on desktop, togglable on mobile */}
          <div className={`flex flex-wrap gap-1.5 sm:gap-2 pt-2 border-t border-accent-primary/5 ${showFilters ? "flex" : "hidden sm:flex"}`}>
            <button
              onClick={() => setSelectedFilterSkill(null)}
              className={`px-2.5 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-mono border transition-all ${
                selectedFilterSkill === null
                  ? "bg-accent-primary/20 border-accent-primary text-accent-primary"
                  : "bg-bg-primary/50 border-accent-primary/5 hover:border-accent-primary/30 text-text-secondary"
              }`}
            >
              All
            </button>

            {skillsList.map((skill) => {
              const active = selectedFilterSkill === skill;
              return (
                <button
                  key={skill}
                  onClick={() => setSelectedFilterSkill(skill)}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-mono border transition-all ${
                    active
                      ? "bg-accent-primary/20 border-accent-primary text-accent-primary"
                      : "bg-bg-primary/50 border-accent-primary/5 hover:border-accent-primary/30 text-text-secondary"
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== Main Content Grid ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          
          {/* ===== Passports Directory Grid ===== */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 pl-1">
              <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></span>
              <span className="text-[10px] sm:text-xs font-mono text-text-secondary uppercase tracking-widest">
                Identities Found ({filteredProfiles.length})
              </span>
            </div>

            {filteredProfiles.length === 0 ? (
              <div className="bg-bg-card border border-accent-primary/10 rounded-2xl p-8 sm:p-12 text-center space-y-4">
                <ShieldAlert className="w-10 h-10 sm:w-12 sm:h-12 text-text-secondary mx-auto opacity-70" />
                <div>
                  <p className="font-display font-bold text-text-primary text-sm sm:text-base">No Matching Identities</p>
                  <p className="text-[10px] sm:text-xs text-text-secondary mt-1">Try clearing filters or search terms.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                
                {filteredProfiles.map((prof) => (
                  <div key={prof.address} className="flex justify-center">
                    <div className="w-full relative">
                      <ProfileCard profile={prof} />
                      
                      {/* View Details Hover Link */}
                      <div className="absolute top-4 right-4 z-20">
                        <Link
                          to={`/profile/${prof.address}`}
                          className="bg-bg-primary/80 hover:bg-bg-primary border border-accent-primary/20 hover:border-accent-primary text-accent-primary rounded-lg p-1.5 sm:p-2 text-[10px] sm:text-xs font-mono flex items-center gap-1 backdrop-blur-sm"
                          title="View Full Profile Details & AI Audit"
                        >
                          Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Mint Passport Placeholder Card */}
                {!userProfile && (
                  <div className="border border-dashed border-accent-primary/30 rounded-3xl p-5 sm:p-6 min-h-[320px] sm:min-h-[400px] flex flex-col justify-center items-center text-center space-y-4 sm:space-y-6 bg-bg-card/30">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-accent-primary/5 rounded-full flex items-center justify-center border border-dashed border-accent-primary/30 islamic-star-8">
                      <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-accent-primary" />
                    </div>
                    <div className="space-y-2 max-w-[220px]">
                      <h4 className="font-display font-bold text-text-primary text-sm sm:text-base">Claim Your ArcID</h4>
                      <p className="text-[10px] sm:text-xs text-text-secondary">Join builders on Arc. Mint your ERC-8004 identity passport instantly.</p>
                    </div>
                    <button
                      onClick={() => setShowMintModal(true)}
                      className="bg-accent-primary/10 hover:bg-accent-primary/20 border border-accent-primary/40 hover:border-accent-primary text-accent-primary text-xs font-mono font-bold px-5 py-2.5 rounded-xl transition-all"
                    >
                      Mint Passport Now
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* ===== Sidebar Leaderboard ===== */}
          <div className="lg:col-span-1">
            <Leaderboard />
          </div>

        </div>
      </div>

      {/* ===== Mint Form Modal Overlay ===== */}
      {showMintModal && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-4 bg-bg-primary/95 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full sm:max-w-2xl bg-bg-card sm:border sm:border-accent-primary/30 sm:rounded-2xl sm:shadow-[0_0_50px_rgba(0,255,136,0.15)] min-h-screen sm:min-h-0 sm:my-8">
            
            {/* Close modal */}
            <button
              onClick={() => setShowMintModal(false)}
              className="sticky sm:absolute top-0 sm:top-4 right-0 sm:right-4 z-10 w-full sm:w-auto bg-bg-card/90 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-b sm:border-0 border-accent-primary/10 p-3 sm:p-0 flex items-center justify-between sm:justify-end"
            >
              <span className="text-xs font-mono text-text-secondary sm:hidden">MINT ARCID PASSPORT</span>
              <span className="flex items-center gap-1 text-text-secondary hover:text-red-400 transition-colors text-xs font-mono">
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Close</span>
              </span>
            </button>

            {/* Embed form directly inside modal */}
            <div className="p-3 sm:p-4 pt-2 sm:pt-1">
              <MintIDForm />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
