import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain, useChainId } from "wagmi";
import { Wallet, Power, RefreshCw } from "lucide-react";
import { arcTestnet } from "../config/wagmi";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

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
    <nav className="sticky top-0 z-50 border-b border-accent-primary/20 bg-bg-primary/80 backdrop-blur-md px-4 lg:px-8 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center border border-accent-primary/30 group-hover:border-accent-primary/80 transition-all duration-300 islamic-star-8">
              <span className="text-xl font-bold text-accent-primary font-display group-hover:scale-110 transition-transform">⚡</span>
            </div>
            <div className="absolute inset-0 bg-accent-primary/20 blur-md rounded-full -z-10 group-hover:opacity-100 opacity-0 transition-opacity"></div>
          </div>
          <div>
            <h1 className="text-xl font-black font-display tracking-widest text-text-primary flex items-center gap-1">
              ARC<span className="text-accent-primary">ID</span>
            </h1>
            <span className="text-[9px] font-mono text-accent-primary/60 tracking-widest block uppercase -mt-1">Agentic Economy</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium tracking-wider text-text-secondary hover:text-accent-primary transition-colors uppercase font-display">Home</Link>
          <Link to="/explore" className="text-sm font-medium tracking-wider text-text-secondary hover:text-accent-primary transition-colors uppercase font-display">Explore IDs</Link>
        </div>

        {/* Web3 Connections */}
        <div className="flex items-center gap-3">
          
          {/* Wrong Network Button */}
          {isWrongChain && (
            <button
              onClick={() => switchChain && switchChain({ chainId: arcTestnet.id })}
              className="flex items-center gap-2 bg-red-950/40 border border-red-500/50 hover:border-red-400 text-red-400 hover:text-red-300 px-3 py-1.5 rounded-md text-xs font-mono transition-all animate-pulse"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Switch to Arc Testnet</span>
            </button>
          )}

          {isConnected && address ? (
            <div className="flex items-center gap-2 md:gap-3 bg-bg-secondary border border-accent-primary/20 rounded-lg p-1.5 pr-3 pl-3">
              
              {/* USDC Balance */}
              <div className="hidden sm:flex flex-col text-right pr-2 border-r border-accent-primary/10">
                <span className="text-[10px] font-mono text-text-secondary">Balance</span>
                <span className="text-xs font-mono font-bold text-accent-primary">
                  {balanceData ? parseFloat(balanceData.formatted).toFixed(2) : "0.00"} {balanceData?.symbol || "USDC"}
                </span>
              </div>

              {/* Wallet Info */}
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-primary animate-ping"></div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-bold text-text-primary">
                    {truncateAddress(address)}
                  </span>
                  <span className="text-[8px] font-mono text-accent-secondary uppercase tracking-widest">
                    Arc Connected
                  </span>
                </div>
                
                {/* Disconnect Button */}
                <button
                  onClick={() => disconnect()}
                  title="Disconnect Wallet"
                  className="ml-2 p-1 hover:text-red-400 text-text-secondary transition-colors"
                >
                  <Power className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              className="relative group overflow-hidden bg-transparent border border-accent-primary hover:border-accent-primary px-5 py-2 rounded-lg font-display text-xs uppercase tracking-widest font-bold text-accent-primary transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2 group-hover:text-bg-primary transition-colors">
                <Wallet className="w-3.5 h-3.5" />
                Connect Wallet
              </span>
              <div className="absolute inset-0 bg-accent-primary w-0 group-hover:w-full transition-all duration-300 -z-0"></div>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
