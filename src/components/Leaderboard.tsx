import { Award, ArrowUpRight, Flame } from "lucide-react";
import { useArcID } from "../hooks/useArcID";
import { Link } from "react-router-dom";

export default function Leaderboard() {
  const { profiles, loading } = useArcID();

  // Sort profiles by reputation score descending
  const sortedProfiles = [...profiles].sort((a, b) => (b.reputationScore || 0) - (a.reputationScore || 0));

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-xl">🥇</span>;
      case 2:
        return <span className="text-xl">🥈</span>;
      case 3:
        return <span className="text-xl">🥉</span>;
      default:
        return <span className="font-mono text-text-secondary">#{rank}</span>;
    }
  };

  const getReputationColor = (score: number) => {
    if (score >= 86) return "text-[#ffd700] drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]"; // Diamond
    if (score >= 61) return "text-amber-400"; // Gold
    if (score >= 31) return "text-slate-300"; // Silver
    return "text-orange-400"; // Bronze
  };

  return (
    <div className="bg-bg-card border border-accent-primary/25 rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)] border-neon">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-accent-primary/10">
        <div className="flex items-center gap-2">
          <Award className="text-accent-primary w-5 h-5" />
          <h3 className="text-lg font-bold font-display tracking-wider text-text-primary">
            REPUTATION <span className="text-accent-primary">LEADERBOARD</span>
          </h3>
        </div>
        <div className="flex items-center gap-1 bg-accent-primary/10 border border-accent-primary/20 px-2 py-0.5 rounded text-[10px] font-mono text-accent-primary">
          <Flame className="w-3 h-3" />
          Active Testnet
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs font-mono text-text-secondary">
          Syncing onchain registry logs...
        </div>
      ) : sortedProfiles.length === 0 ? (
        <div className="py-12 text-center text-xs font-mono text-text-secondary">
          No identities registered yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-accent-primary/5 text-[10px] font-mono text-text-secondary uppercase tracking-widest">
                <th className="pb-3 pl-2">Rank</th>
                <th className="pb-3">Identity</th>
                <th className="pb-3 hidden sm:table-cell">Role</th>
                <th className="pb-3 text-right pr-2">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent-primary/5">
              {sortedProfiles.map((prof, idx) => {
                const rank = idx + 1;
                return (
                  <tr
                    key={prof.address}
                    className="hover:bg-bg-secondary/40 transition-colors group"
                  >
                    {/* Rank */}
                    <td className="py-4 pl-2 font-mono font-bold w-16">
                      {getRankBadge(rank)}
                    </td>

                    {/* Profile Link */}
                    <td className="py-4">
                      <Link
                        to={`/profile/${prof.address}`}
                        className="flex items-center gap-3 hover:text-accent-primary transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-accent-primary/5 border border-accent-primary/25 flex items-center justify-center text-xs font-bold font-mono text-accent-primary group-hover:border-accent-primary/60">
                          {prof.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="text-sm font-bold text-text-primary group-hover:text-accent-primary transition-colors block">
                            {prof.name}
                          </span>
                          <span className="text-[10px] font-mono text-text-secondary block">
                            {prof.address.substring(0, 6)}...{prof.address.substring(prof.address.length - 4)}
                          </span>
                        </div>
                      </Link>
                    </td>

                    {/* Role */}
                    <td className="py-4 hidden sm:table-cell text-xs font-mono text-text-secondary max-w-[200px] truncate">
                      {prof.title}
                    </td>

                    {/* Reputation Score */}
                    <td className="py-4 text-right pr-2 font-mono font-black text-sm">
                      <Link
                        to={`/profile/${prof.address}`}
                        className="flex items-center justify-end gap-1 group-hover:text-accent-primary transition-colors"
                      >
                        <span className={getReputationColor(prof.reputationScore || 0)}>
                          {prof.reputationScore}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all text-accent-primary" />
                      </Link>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
