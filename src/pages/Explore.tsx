import { useState } from "react";
import { Link } from "react-router-dom";
import { useArcID } from "../hooks/useArcID";
import ProfileCard from "../components/ProfileCard";
import MintIDForm from "../components/MintIDForm";
import Leaderboard from "../components/Leaderboard";
import { Search, SlidersHorizontal, Sparkles, ShieldAlert, Cpu } from "lucide-react";

export default function Explore() {
  const { profiles, userProfile } = useArcID();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterSkill, setSelectedFilterSkill] = useState<string | null>(null);
  
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
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 space-y-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-accent-primary/10">
        <div>
          <h2 className="text-3xl font-black font-display tracking-wider text-text-primary uppercase">
            PASSPORT <span className="text-accent-primary">DIRECTORY</span>
          </h2>
          <p className="text-xs font-mono text-text-secondary mt-1">Explore and interact with verified onchain human and AI identities</p>
        </div>

        {/* Mint Button Trigger if not minted yet */}
        {!userProfile && (
          <button
            onClick={() => setShowMintModal(true)}
            className="bg-accent-primary text-bg-primary font-display font-black text-xs uppercase tracking-widest py-3 px-6 rounded-xl hover:bg-accent-primary/80 transition-all hover:shadow-[0_0_15px_rgba(0,255,136,0.3)] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-bg-primary" />
            Mint Your ArcID Passport
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-bg-card border border-accent-primary/10 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Box */}
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Search by name, role, skills, or 0x address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-primary border border-accent-primary/20 hover:border-accent-primary/40 focus:border-accent-primary focus:outline-none rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary"
            />
            <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-text-secondary" />
          </div>

          {/* Preset Skills Filter List */}
          <div className="flex items-center gap-2 border-l border-accent-primary/10 pl-0 md:pl-4">
            <SlidersHorizontal className="w-4 h-4 text-accent-secondary" />
            <span className="text-xs font-mono text-text-secondary uppercase tracking-widest">Filter Skill</span>
          </div>
        </div>

        {/* Skills Tag Filters */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-accent-primary/5">
          <button
            onClick={() => setSelectedFilterSkill(null)}
            className={`px-3 py-1 rounded-lg text-xs font-mono border transition-all ${
              selectedFilterSkill === null
                ? "bg-accent-primary/20 border-accent-primary text-accent-primary"
                : "bg-bg-primary/50 border-accent-primary/5 hover:border-accent-primary/30 text-text-secondary"
            }`}
          >
            All Skills
          </button>

          {skillsList.map((skill) => {
            const active = selectedFilterSkill === skill;
            return (
              <button
                key={skill}
                onClick={() => setSelectedFilterSkill(skill)}
                className={`px-3 py-1 rounded-lg text-xs font-mono border transition-all ${
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Passports Directory Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-2 pl-1">
            <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></span>
            <span className="text-xs font-mono text-text-secondary uppercase tracking-widest">
              Identities Found ({filteredProfiles.length})
            </span>
          </div>

          {filteredProfiles.length === 0 ? (
            <div className="bg-bg-card border border-accent-primary/10 rounded-2xl p-12 text-center space-y-4">
              <ShieldAlert className="w-12 h-12 text-text-secondary mx-auto opacity-70" />
              <div>
                <p className="font-display font-bold text-text-primary">No Matching Identities</p>
                <p className="text-xs text-text-secondary mt-1">Try clearing filters or search terms.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {filteredProfiles.map((prof) => (
                <div key={prof.address} className="flex justify-center">
                  {/* Wraps in a click navigation if they just click the card container, 
                      since card flipping handles inner clicks */}
                  <div className="w-full relative">
                    <ProfileCard profile={prof} />
                    
                    {/* View Details Hover Link */}
                    <div className="absolute top-4 right-4 z-20">
                      <Link
                        to={`/profile/${prof.address}`}
                        className="bg-bg-primary/80 hover:bg-bg-primary border border-accent-primary/20 hover:border-accent-primary text-accent-primary rounded-lg p-2 text-xs font-mono flex items-center gap-1 backdrop-blur-sm"
                        title="View Full Profile Details & AI Audit"
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {/* Mint Passport Placeholder Card inside the grid if user doesn't have one */}
              {!userProfile && (
                <div className="border border-dashed border-accent-primary/30 rounded-3xl p-6 h-[480px] flex flex-col justify-center items-center text-center space-y-6 bg-bg-card/30">
                  <div className="w-16 h-16 bg-accent-primary/5 rounded-full flex items-center justify-center border border-dashed border-accent-primary/30 islamic-star-8">
                    <Cpu className="w-6 h-6 text-accent-primary" />
                  </div>
                  <div className="space-y-2 max-w-[240px]">
                    <h4 className="font-display font-bold text-text-primary text-base">Claim Your ArcID Passport</h4>
                    <p className="text-xs text-text-secondary">Join Asad Lee and other onchain builders. Mint your ERC-8004 identity instantly.</p>
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

        {/* Sidebar Leaderboard */}
        <div className="lg:col-span-1">
          <Leaderboard />
        </div>

      </div>

      {/* Mint Form Modal Overlay */}
      {showMintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg-primary/95 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-bg-card border border-accent-primary/30 rounded-2xl shadow-[0_0_50px_rgba(0,255,136,0.15)] my-8">
            
            {/* Close modal */}
            <button
              onClick={() => setShowMintModal(false)}
              className="absolute top-4 right-4 z-10 text-text-secondary hover:text-red-400 transition-colors"
            >
              Close
            </button>

            {/* Embed form directly inside modal */}
            <div className="p-1">
              <MintIDForm />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
