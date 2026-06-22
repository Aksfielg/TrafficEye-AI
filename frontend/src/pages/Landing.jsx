import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function Landing() {
  return (
    <div className="min-h-screen bg-asphalt text-paper font-sans">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-asphalt/95 backdrop-blur-md border-b-[3px] border-amber shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-4 group cursor-pointer">
            <Logo className="w-10 h-10 group-hover:scale-105 transition-transform" />
            <div>
              <h1 className="font-display text-3xl font-bold tracking-wider text-paper leading-none group-hover:text-amber transition-colors">
                TRAFFIC <span className="text-amber group-hover:text-paper transition-colors">EYE</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-radar animate-pulse"></div>
                <span className="text-radar font-mono text-[10px] tracking-widest uppercase">
                  AI Violation Detection
                </span>
              </div>
            </div>
          </Link>
          
          {/* Header Actions */}
          <div>
            <Link 
              to="/app/upload"
              className="bg-amber text-asphalt font-display font-bold text-lg tracking-wider px-8 py-2 hover:bg-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-asphalt focus-visible:ring-amber outline-none transition-colors duration-200 uppercase"
            >
              Launch Console
            </Link>
          </div>
          
        </div>
      </header>

      {/* Main Content Area - 5 Sections Placeholder */}
      <main>
        
        {/* 1. Hero Section */}
        <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center border-b border-concrete/20 overflow-hidden pt-20 pb-10 px-6">
          
          {/* Background Visual */}
          <div className="absolute inset-0 z-0 bg-asphalt">
            <img 
              src="/hero-bg.png" 
              alt="Background annotated traffic evidence" 
              className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
            />
            {/* Subtle gradient overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-asphalt/80 via-asphalt/60 to-asphalt"></div>
          </div>

          {/* Horizontal Scan-line Animation */}
          <div className="absolute left-0 w-full h-[3px] bg-radar/80 shadow-[0_0_20px_4px_rgba(63,193,201,0.7)] motion-safe:animate-scanline z-10 pointer-events-none"></div>

          {/* Content Container */}
          <div className="relative z-20 text-center max-w-5xl mx-auto flex flex-col items-center">
            
            <h2 className="font-display text-6xl md:text-8xl text-paper tracking-[0.05em] uppercase leading-[0.95] mb-8 drop-shadow-lg">
              EVERY VIOLATION.<br />
              <span className="text-violation">AUTOMATICALLY CAUGHT.</span>
            </h2>
            
            <p className="font-sans text-concrete text-xl md:text-2xl leading-relaxed max-w-3xl mb-12">
              TrafficEye AI turns a single traffic photo into a verified violation record — detection, evidence, and a number plate, in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 mb-16">
              <Link 
                to="/app/upload"
                className="bg-amber text-asphalt font-display font-bold text-2xl tracking-widest px-12 py-5 hover:bg-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-asphalt focus-visible:ring-amber outline-none transition-colors duration-200 uppercase"
              >
                Launch Console
              </Link>
              <a 
                href="#solution"
                className="border-2 border-concrete text-paper font-display font-bold text-2xl tracking-widest px-12 py-5 hover:border-paper hover:text-amber focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-asphalt focus-visible:ring-amber outline-none transition-colors duration-200 uppercase flex items-center justify-center gap-3"
              >
                See How It Works
              </a>
            </div>

            {/* Stat Strip */}
            <div className="mt-auto border-t border-concrete/20 pt-8 w-full max-w-4xl">
              <p className="font-mono text-concrete text-sm md:text-base tracking-widest uppercase">
                4 VIOLATION TYPES DETECTED &nbsp;&middot;&nbsp; REAL-TIME OCR &nbsp;&middot;&nbsp; LIVE DASHBOARD
              </p>
            </div>

          </div>
        </section>

        {/* 2. Problem Section */}
        <section id="problem" className="py-24 px-6 border-b border-concrete/20 bg-asphalt/50">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-16">
              <span className="font-mono text-violation text-sm tracking-widest uppercase mb-4 block">
                THE PROBLEM
              </span>
              <h2 className="font-display text-5xl md:text-6xl text-paper tracking-wider uppercase">
                Manual enforcement doesn't scale.
              </h2>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Card 1 */}
              <div className="bg-asphalt border border-concrete/10 border-t-[4px] border-t-violation p-8 flex flex-col hover:border-concrete/30 transition-colors duration-200 shadow-lg">
                <h3 className="font-display text-2xl tracking-widest text-paper uppercase mb-4">
                  Enforcement is patrol-based & reactive
                </h3>
                <p className="font-sans text-concrete text-lg leading-relaxed flex-1">
                  Officers can't be everywhere at once. Coverage is limited by physical patrol routes, allowing many violations to happen unseen.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-asphalt border border-concrete/10 border-t-[4px] border-t-violation p-8 flex flex-col hover:border-concrete/30 transition-colors duration-200 shadow-lg">
                <h3 className="font-display text-2xl tracking-widest text-paper uppercase mb-4">
                  Manual photo review is slow & inconsistent
                </h3>
                <p className="font-sans text-concrete text-lg leading-relaxed flex-1">
                  With a high volume of traffic footage, human reviewers quickly become a bottleneck, leading to massive backlogs and subjective enforcement.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-asphalt border border-concrete/10 border-t-[4px] border-t-violation p-8 flex flex-col hover:border-concrete/30 transition-colors duration-200 shadow-lg">
                <h3 className="font-display text-2xl tracking-widest text-paper uppercase mb-4">
                  No structured record
                </h3>
                <p className="font-sans text-concrete text-lg leading-relaxed flex-1">
                  Violations often go undocumented in a searchable database. Without automated tracking, high-frequency repeat offenders slip under the radar.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 3. Solution / How It Works Section */}
        <section id="solution" className="py-32 px-6 border-b border-concrete/20 bg-asphalt">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-24 text-center">
              <span className="font-mono text-radar text-sm tracking-widest uppercase mb-4 block">
                HOW IT WORKS
              </span>
              <h2 className="font-display text-5xl md:text-6xl text-paper tracking-wider uppercase">
                One photo. A full investigation.
              </h2>
            </div>

            {/* Pipeline Visual */}
            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-start max-w-6xl mx-auto">
              
              {/* Connecting Line (Vertical on Mobile, Horizontal on Desktop) */}
              <div className="absolute left-[15px] md:left-0 top-[16px] bottom-[16px] md:bottom-auto md:top-[15px] w-[2px] md:w-full md:h-[2px] bg-amber/30 z-0"></div>

              {/* Nodes */}
              {[
                { title: "IMAGE UPLOAD", desc: "Raw traffic camera footage is ingested." },
                { title: "OBJECT DETECTION", desc: "YOLOv8 runs zero-shot identification of vehicles and helmets." },
                { title: "RULES ENGINE", desc: "Spatial logic evaluates coordinates for overlapping infractions." },
                { title: "LICENSE PLATE OCR", desc: "Extracts plate text from localized vehicle bounding boxes." },
                { title: "EVIDENCE GEN", desc: "Hard-burns verification bounding boxes onto the source image." },
                { title: "STORED & INDEXED", desc: "Saved to SQL database with repeat-offender analytics." }
              ].map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-row md:flex-col items-start md:items-center gap-6 md:gap-4 mb-12 md:mb-0 w-full md:w-[15%] md:text-center group">
                  {/* Node Dot */}
                  <div className="w-8 h-8 rounded-full bg-asphalt border-[2px] border-amber flex-shrink-0 flex items-center justify-center transition-colors duration-200">
                    <div className="w-2 h-2 rounded-full bg-amber group-hover:scale-150 transition-transform duration-200"></div>
                  </div>
                  
                  {/* Node Text */}
                  <div className="pt-1 md:pt-0">
                    <h3 className="font-mono text-amber text-sm tracking-widest uppercase mb-2">
                      {step.title}
                    </h3>
                    <p className="font-sans text-concrete text-sm leading-relaxed pr-4 md:pr-0">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 4. Features Section */}
        <section id="features" className="py-32 px-6 border-b border-concrete/20 bg-asphalt/50">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-20 text-center">
              <span className="font-mono text-amber text-sm tracking-widest uppercase mb-4 block">
                WHAT IT DETECTS
              </span>
              <h2 className="font-display text-5xl md:text-6xl text-paper tracking-wider uppercase">
                Built for the violations that matter most.
              </h2>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Feature Cards */}
              {[
                { code: "TFC-01", title: "Helmet Violation", desc: "Detects unhelmeted riders overlapping with active motorcycles." },
                { code: "TFC-02", title: "Triple Riding", desc: "Flags motorcycles carrying three or more passengers." },
                { code: "TFC-03", title: "Seatbelt Non-Compliance", desc: "Detects unbuckled drivers located inside vehicle cabin bounding boxes." },
                { code: "TFC-04", title: "Illegal Parking", desc: "Identifies unauthorized stationary vehicles occupying restricted perimeter zones." },
                { code: "OCR-01", title: "License Plate OCR", desc: "Automated number plate extraction from localized crops." },
                { code: "EVD-01", title: "Evidence Generation", desc: "Annotated proof images hard-burned with bounding boxes and confidence scores." },
                { code: "DB-01", title: "Repeat Offender Watch-List", desc: "Automatically flags vehicles with multiple violations across the system." },
                { code: "DB-02", title: "Live Analytics Dashboard", desc: "Violation trends, volume breakdowns, and hourly temporal patterns." }
              ].map((feat, idx) => (
                <div key={idx} className="bg-paper text-asphalt p-8 border-l-[6px] border-violation shadow-lg flex flex-col hover:-translate-y-1 transition-transform duration-200">
                  <span className="font-mono text-sm tracking-widest text-asphalt/60 font-bold uppercase mb-2 block">
                    {feat.code}
                  </span>
                  <h3 className="font-display text-3xl font-bold uppercase tracking-wider mb-4 leading-none">
                    {feat.title}
                  </h3>
                  <p className="font-sans text-asphalt/80 text-lg leading-relaxed flex-1">
                    {feat.desc}
                  </p>
                </div>
              ))}

              {/* Roadmap Card */}
              <div className="bg-asphalt p-8 border-2 border-dashed border-concrete/30 flex flex-col justify-center">
                <span className="font-mono text-sm tracking-widest text-concrete font-bold uppercase mb-2 block">
                  ROADMAP
                </span>
                <h3 className="font-display text-3xl font-bold uppercase tracking-wider text-concrete/80 mb-4 leading-none">
                  Future Expansion
                </h3>
                <ul className="font-sans text-concrete text-lg leading-relaxed list-disc list-inside space-y-2 mb-4">
                  <li>Red light violation detection</li>
                  <li>Speed limit enforcement via multi-frame tracking</li>
                </ul>
                <p className="font-mono text-xs text-concrete/60 uppercase tracking-widest mt-auto border-t border-concrete/20 pt-4">
                  * Honest scoping: these features are planned for future versions, not active in the current demo.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 5. Tech Stack + CTA Section */}
        <section id="stack" className="py-32 px-6">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            
            {/* Tech Stack Eyebrow */}
            <span className="font-mono text-radar text-sm tracking-widest uppercase mb-8 block">
              BUILT WITH
            </span>
            
            {/* Tech Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-24">
              {['YOLOv8', 'FastAPI', 'React', 'Supabase', 'EasyOCR'].map((tech) => (
                <span key={tech} className="font-mono text-paper text-sm md:text-base px-6 py-2 border border-concrete/30 bg-asphalt shadow-sm uppercase tracking-wider">
                  {tech}
                </span>
              ))}
            </div>

            {/* CTA Block */}
            <h2 className="font-display text-5xl md:text-6xl text-paper tracking-wider uppercase mb-10 leading-none">
              See it catch a violation in real time.
            </h2>
            <Link 
              to="/app/upload"
              className="inline-block bg-amber text-asphalt font-display font-bold text-3xl tracking-widest px-16 py-6 hover:bg-white focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-asphalt focus-visible:ring-amber outline-none transition-colors duration-200 uppercase shadow-lg"
            >
              Launch Console
            </Link>
            
          </div>
        </section>

      </main>

      {/* Minimal Footer */}
      <footer className="py-12 border-t border-concrete/20 bg-asphalt text-center">
        <p className="text-concrete font-mono text-xs tracking-widest uppercase opacity-70">
          Built for Gridlock Hackathon 2.0 — Flipkart × Bengaluru Traffic Police
        </p>
      </footer>
    </div>
  );
}
