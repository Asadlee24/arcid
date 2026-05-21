import { useState } from "react";
import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain, useChainId } from "wagmi";
import { Wallet, Power, RefreshCw, Menu, X } from "lucide-react";
import { arcTestnet } from "../config/wagmi";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // USDC balance on Arc Testnet
  const { data: balanceData } = useBalance({
    address: address,
    chainId: arcTestnet.id,
  });

  const isWrongChain = isConnected && chainId !== arcTestnet.id;

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const handleConnect = () => {
    const mm = connectors.find((c) => c.name.toLowerCase().includes("metamask"));
    if (mm) {
      connect({ connector: mm });
    } else if (connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-accent-primary/20 bg-bg-primary/80 backdrop-blur-md px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0" onClick={() => setMobileMenuOpen(false)}>
          <div className="relative flex items-center justify-center">
            {/* High fidelity Arc dome/archway logo custom SVG */}
            <svg 
              viewBox="0 0 100 100" 
              className="w-7 h-7 sm:w-9 sm:h-9 drop-shadow-[0_0_8px_rgba(0,255,136,0.4)] group-hover:scale-105 transition-transform duration-300"
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="arcNavbarLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#e8f4f8" />
                  <stop offset="100%" stopColor="#00ff88" />
                </linearGradient>
              </defs>
              {/* Sleek architectural Arc dome */}
              <path
                d="M 22 90 
                   C 22 36, 44 14, 50 14 
                   C 56 14, 78 36, 78 90 
                   L 70 90 
                   C 70 48, 58 24, 50 24 
                   C 42 24, 30 48, 30 90 
                   Z"
                fill="url(#arcNavbarLogoGrad)"
              />
              {/* Inward extending middle cross-bridge */}
              <path
                d="M 30 62 
                   C 40 62, 58 62, 65 62 
                   C 68 62, 70 59, 70 55 
                   L 70 50 
                   C 70 46, 68 44, 65 44 
                   L 30 44 
                   Z"
                fill="url(#arcNavbarLogoGrad)"
              />
            </svg>
            <div className="absolute inset-0 bg-accent-primary/20 blur-md rounded-full -z-10 group-hover:opacity-100 opacity-0 transition-opacity"></div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg sm:text-xl font-bold font-display tracking-wider text-text-primary flex items-center">
              Arc<span className="text-accent-primary font-black ml-0.5">ID</span>
            </h1>
            <span className="text-[7px] sm:text-[8px] font-mono text-text-secondary tracking-widest block uppercase -mt-0.5">Agentic Economy</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium tracking-wider text-text-secondary hover:text-accent-primary transition-colors uppercase font-display">Home</Link>
          <Link to="/explore" className="text-sm font-medium tracking-wider text-text-secondary hover:text-accent-primary transition-colors uppercase font-display">Explore IDs</Link>
        </div>

        {/* Web3 Connections */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Wrong Network Button */}
          {isWrongChain && (
            <button
              onClick={() => switchChain && switchChain({ chainId: arcTestnet.id })}
              className="flex items-center gap-1.5 bg-red-950/40 border border-red-500/50 hover:border-red-400 text-red-400 hover:text-red-300 px-2 sm:px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-mono transition-all animate-pulse"
            >
              <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Switch to Arc Testnet</span>
              <span className="sm:hidden">Switch</span>
            </button>
          )}

          {isConnected && address ? (
            <div className="flex items-center gap-1.5 sm:gap-3 bg-bg-secondary border border-accent-primary/20 rounded-lg p-1 sm:p-1.5 pr-2 sm:pr-3 pl-2 sm:pl-3">
              
              {/* USDC Balance */}
              <div className="hidden sm:flex flex-col text-right pr-2 border-r border-accent-primary/10">
                <span className="text-[10px] font-mono text-text-secondary">Balance</span>
                <span className="text-xs font-mono font-bold text-accent-primary">
                  {balanceData ? parseFloat(balanceData.formatted).toFixed(2) : "0.00"} {balanceData?.symbol || "USDC"}
                </span>
              </div>

              {/* Wallet Info */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-primary animate-ping"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-text-primary">
                    {truncateAddress(address)}
                  </span>
                  <span className="text-[7px] sm:text-[8px] font-mono text-accent-secondary uppercase tracking-widest hidden sm:block">
                    Arc Connected
                  </span>
                </div>
                
                {/* Disconnect Button */}
                <button
                  onClick={() => disconnect()}
                  title="Disconnect Wallet"
                  className="ml-1 p-1 hover:text-red-400 text-text-secondary transition-colors"
                >
                  <Power className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              className="relative group overflow-hidden bg-transparent border border-accent-primary hover:border-accent-primary px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg font-display text-[10px] sm:text-xs uppercase tracking-widest font-bold text-accent-primary transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-1.5 sm:gap-2 group-hover:text-bg-primary transition-colors">
                <Wallet className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Connect Wallet</span>
                <span className="sm:hidden">Connect</span>
              </span>
              <div className="absolute inset-0 bg-accent-primary w-0 group-hover:w-full transition-all duration-300 -z-0"></div>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-text-secondary hover:text-accent-primary transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-accent-primary/10 mt-3 pt-3 pb-2 space-y-1 animate-in slide-in-from-top-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 text-sm font-medium tracking-wider text-text-secondary hover:text-accent-primary hover:bg-accent-primary/5 rounded-lg transition-all uppercase font-display"
          >
            Home
          </Link>
          <Link
            to="/explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 text-sm font-medium tracking-wider text-text-secondary hover:text-accent-primary hover:bg-accent-primary/5 rounded-lg transition-all uppercase font-display"
          >
            Explore IDs
          </Link>
          {/* Mobile USDC balance */}
          {isConnected && balanceData && (
            <div className="px-3 py-2 flex items-center justify-between border-t border-accent-primary/10 mt-2 pt-3">
              <span className="text-[10px] font-mono text-text-secondary uppercase">USDC Balance</span>
              <span className="text-sm font-mono font-bold text-accent-primary">
                {parseFloat(balanceData.formatted).toFixed(2)} {balanceData.symbol}
              </span>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
