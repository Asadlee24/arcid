import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./config/wagmi";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Explore from "./pages/Explore";

// Initialize TanStack React Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary selection:bg-accent-primary/30 selection:text-accent-primary">
            
            {/* Navigation Header */}
            <Navbar />

            {/* Application Main Pages */}
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/profile/:address" element={<Profile />} />
              </Routes>
            </div>

            {/* Cyberpunk Footer */}
            <footer className="border-t border-accent-primary/10 bg-bg-primary py-8 text-center text-xs font-mono text-text-secondary relative overflow-hidden">
              <div className="absolute inset-0 islamic-girih opacity-5 pointer-events-none"></div>
              
              <div className="max-w-7xl mx-auto px-4 space-y-4 relative z-10">
                <p className="tracking-widest uppercase">
                  &copy; {new Date().getFullYear()} ARCID &bull; AGORA AGENTS HACKATHON
                </p>
                <div className="flex items-center justify-center gap-2 flex-wrap text-[10px] text-accent-primary/70">
                  <span>Built on Arc Testnet</span>
                  <span>&bull;</span>
                  <span>Secured by ERC-8004</span>
                  <span>&bull;</span>
                  <span>Powered by Circle App Kit & USDC</span>
                </div>
                <p className="text-[10px] text-text-secondary/60">
                  Developed by <a href="https://asad-lee-portfolio.vercel.app" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent-primary">Asad Lee</a> | IMSciences Peshawar
                </p>
              </div>
            </footer>

          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
