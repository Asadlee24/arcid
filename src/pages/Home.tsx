import { Link } from "react-router-dom";
import { Shield, Star, ArrowRight, Flame, Cpu } from "lucide-react";
import { useArcID } from "../hooks/useArcID";
import Leaderboard from "../components/Leaderboard";
import AboutBuilder from "../components/AboutBuilder";

export default function Home() {
  const { profiles } = useArcID();

  // Aggregate stats from minted profiles
  const totalIdentities = profiles.length;
  const totalTipped = profiles.reduce((acc, curr) => acc + (curr.tipsReceived || 0), 0);
  const totalEndorsements = profiles.reduce((acc, curr) => acc + (curr.endorsements || 0), 0);

  const steps = [
    {
      icon: <Cpu className="w-6 h-6 text-accent-primary" />,
      title: "1. Connect Wallet",
      desc: "Link your MetaMask wallet on the Arc Testnet. Gas is paid natively in USDC."
    },
    {
      icon: <Shield className="w-6 h-6 text-accent-secondary" />,
      title: "2. Mint Your ArcID",
      desc: "Provide your name, title, skills, and generate a professional Web3 bio using Claude AI."
    },
    {
      icon: <Star className="w-6 h-6 text-accent-gold" />,
      title: "3. Build Reputation",
      desc: "Receive USDC tips, gather peer endorsements, and climb the trust leaderboard."
    }
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      
      {/* Animated Moving Cyber Grid Background */}
      <div className="absolute inset-0 hero-bg -z-10"></div>
      
      {/* Floating 3D Geometric Accents */}
      <div className="absolute top-20 left-10 w-36 h-36 border border-accent-primary/10 rounded-full animate-float-1 pointer-events-none islamic-star-8 opacity-20"></div>
      <div className="absolute bottom-40 right-20 w-44 h-44 border border-accent-secondary/15 rounded-lg animate-float-2 pointer-events-none opacity-20"></div>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-20 space-y-24 relative z-10">
        
        {/* ==================== HERO SECTION ==================== */}
        <section className="text-center max-w-4xl mx-auto space-y-8 py-8">
          
          {/* Badge indicator */}
          <div className="inline-flex items-center gap-2 bg-accent-primary/15 border border-accent-primary/30 rounded-full px-4 py-1.5 font-mono text-xs text-accent-primary uppercase tracking-widest animate-pulse">
            <Flame className="w-4 h-4 fill-accent-primary" />
            <span>Active on Arc Testnet</span>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-7xl font-black font-display tracking-tight leading-none text-text-primary uppercase">
              YOUR ONCHAIN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-gold drop-shadow-[0_0_30px_rgba(0,255,136,0.3)]">
                IDENTITY PASSPORT
              </span>
            </h1>
            <p className="text-sm md:text-lg text-text-secondary font-body max-w-2xl mx-auto leading-relaxed">
              Mint your permanent digital identity (powered by ERC-8004 standard) on the Arc blockchain. 
              No databases. No centralized entities. Build reputation and transact USDC nanopayments instantly.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/explore"
              className="w-full sm:w-auto relative group overflow-hidden bg-accent-primary border border-accent-primary px-8 py-4 rounded-xl font-display font-black text-sm uppercase tracking-widest text-bg-primary transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,136,0.4)]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Mint / Explore IDs
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <a
              href="https://docs.arc.network"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-bg-secondary hover:bg-bg-primary border border-accent-primary/20 hover:border-accent-primary/60 px-8 py-4 rounded-xl font-display font-bold text-sm uppercase tracking-widest text-text-primary transition-all duration-300"
            >
              Read Arc Docs
            </a>
          </div>

          {/* Real-time Onchain Stats Grid */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-2xl mx-auto pt-8 border-t border-accent-primary/10">
            <div className="text-center p-3">
              <span className="text-2xl md:text-4xl font-black font-mono text-accent-primary stat-number block">
                {totalIdentities}
              </span>
              <span className="text-[9px] md:text-xs font-mono text-text-secondary uppercase tracking-widest block mt-1">
                Identities Minted
              </span>
            </div>
            
            <div className="text-center p-3 border-x border-accent-primary/10">
              <span className="text-2xl md:text-4xl font-black font-mono text-accent-gold stat-number block">
                ${totalTipped.toFixed(2)}
              </span>
              <span className="text-[9px] md:text-xs font-mono text-text-secondary uppercase tracking-widest block mt-1">
                USDC Tipped
              </span>
            </div>

            <div className="text-center p-3">
              <span className="text-2xl md:text-4xl font-black font-mono text-accent-secondary stat-number block">
                {totalEndorsements}
              </span>
              <span className="text-[9px] md:text-xs font-mono text-text-secondary uppercase tracking-widest block mt-1">
                Onchain Vouches
              </span>
            </div>
          </div>

        </section>

        {/* ==================== HOW IT WORKS ==================== */}
        <section className="space-y-12">
          <div className="text-center">
            <span className="text-[10px] font-mono text-accent-primary uppercase tracking-[0.3em] block mb-2">Protocol Architecture</span>
            <h2 className="text-3xl font-bold font-display tracking-wider text-text-primary">
              HOW <span className="text-accent-primary">ARCID WORKS</span>
            </h2>
            <div className="w-12 h-1 bg-accent-primary mx-auto mt-2 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="bg-bg-card border border-accent-primary/10 hover:border-accent-primary/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 relative"
              >
                <div className="w-12 h-12 bg-bg-secondary rounded-xl flex items-center justify-center border border-accent-primary/20 mb-4 islamic-star">
                  {step.icon}
                </div>
                <h4 className="text-base font-bold font-display text-text-primary mb-2">
                  {step.title}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed font-body">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== LEADERBOARD PREVIEW ==================== */}
        <section className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <span className="text-[10px] font-mono text-accent-secondary uppercase tracking-[0.3em] block mb-2">Onchain Trust Rankings</span>
            <h2 className="text-3xl font-bold font-display tracking-wider text-text-primary">
              TOP <span className="text-accent-primary">INFLUENCERS</span>
            </h2>
            <div className="w-12 h-1 bg-accent-secondary mx-auto mt-2 rounded-full"></div>
          </div>
          
          <Leaderboard />
        </section>

      </main>

      {/* Meet Asad Lee bottom section */}
      <AboutBuilder />
      
    </div>
  );
}
