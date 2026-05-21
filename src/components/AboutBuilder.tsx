import { Globe, Linkedin, MessageCircle, ExternalLink, Code } from "lucide-react";

export default function AboutBuilder() {
  const projects = [
    { name: "Horia Electronics", desc: "Industrial systems dashboard" },
    { name: "MDK Electronics", desc: "Ecommerce hardware layer" },
    { name: "Kite AI Quiz", desc: "Smart education protocol" },
    { name: "CMAI WL Checker", desc: "Onchain Allowlist check" }
  ];

  return (
    <section className="relative py-12 px-4 border-t border-accent-primary/10 bg-gradient-to-b from-transparent to-bg-secondary/40 overflow-hidden">
      {/* Background Islamic grid motif */}
      <div className="absolute inset-0 islamic-girih opacity-20 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <span className="text-[10px] font-mono text-accent-primary uppercase tracking-[0.3em] block mb-2">Agora Agents Hackathon Project</span>
          <h3 className="text-2xl font-bold font-display tracking-wider text-text-primary">
            MEET THE <span className="text-accent-primary">BUILDER</span>
          </h3>
          <div className="w-12 h-1 bg-accent-primary mx-auto mt-2 rounded-full"></div>
        </div>

        <div className="bg-bg-card/70 backdrop-blur-md border border-accent-primary/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center border-neon">
          
          {/* Builder Image & Quick Contact */}
          <div className="flex flex-col items-center gap-4 flex-shrink-0">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-2 border-accent-primary bg-bg-primary">
                <img
                  src="https://i.ibb.co/G3fvMHZY/IMG-4886.jpg"
                  alt="Asad Lee"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback to high tech avatar if external URL changes
                    e.currentTarget.src = "https://api.dicebear.com/7.x/pixel-art/svg?seed=AsadLee";
                  }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <h4 className="font-display font-bold text-text-primary text-lg">Asad Lee</h4>
              <p className="text-xs font-mono text-accent-primary">@asadleo416</p>
              <p className="text-[10px] font-mono text-text-secondary">Peshawar, Pakistan 🇵🇰</p>
            </div>
          </div>

          {/* Builder Details */}
          <div className="flex-grow space-y-4">
            <div>
              <span className="text-[10px] font-mono text-accent-secondary uppercase tracking-widest block">Role & Institution</span>
              <p className="text-sm text-text-primary font-medium mt-1">
                IMSciences Peshawar Student | Cyber Security Researcher | Web Developer
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono text-accent-secondary uppercase tracking-widest block mb-2">Featured Projects</span>
              <div className="grid grid-cols-2 gap-3">
                {projects.map((proj, idx) => (
                  <div key={idx} className="bg-bg-primary/50 border border-accent-primary/10 rounded-lg p-2.5 hover:border-accent-primary/30 transition-colors">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-accent-primary font-bold">
                      <Code className="w-3.5 h-3.5" />
                      {proj.name}
                    </div>
                    <span className="text-[9px] text-text-secondary block mt-0.5">{proj.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social / Portfolio Links */}
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="https://asad-lee-portfolio.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-accent-primary/10 hover:bg-accent-primary/20 border border-accent-primary/30 rounded-lg px-3 py-1.5 text-xs font-mono text-accent-primary transition-all hover:-translate-y-0.5"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Portfolio</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              <a
                href="https://linkedin.com/in/asad-ali-3355273ba"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-accent-secondary/10 hover:bg-accent-secondary/20 border border-accent-secondary/30 rounded-lg px-3 py-1.5 text-xs font-mono text-accent-secondary transition-all hover:-translate-y-0.5"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              <a
                href="https://wa.me/923400194591"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-lg px-3 py-1.5 text-xs font-mono text-emerald-400 transition-all hover:-translate-y-0.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
