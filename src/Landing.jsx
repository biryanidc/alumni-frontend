import { motion } from "framer-motion";

export default function Landing({ onEnter }) {
  return (
    <div className="min-h-screen bg-base text-copper font-sans flex flex-col items-center selection:bg-copper selection:text-base overflow-hidden">
      
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiNkOWEwODciIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-20 z-0"></div>

      <main className="z-10 w-full max-w-5xl px-6 py-20 flex flex-col items-center text-center mt-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <span className="font-mono text-xs tracking-widest uppercase border border-copper/30 px-4 py-2 rounded-full mb-8 inline-block">
            System V1.0 Active
          </span>

          <h1 className="text-6xl md:text-8xl font-serif text-copperLight mb-6 tracking-tight">
            AlumniConnect.
          </h1>

          <p className="text-xl font-light opacity-80 mb-12 max-w-2xl mx-auto leading-relaxed">
            The institutional network bridging the gap between legacy and ambition. Access internal opportunities, request referrals, and leverage our AI network.
          </p>

          <button 
            onClick={onEnter}
            className="px-10 py-4 bg-copper text-base font-mono text-sm uppercase tracking-widest hover:bg-copperLight transition-all duration-300 shadow-[0_0_20px_rgba(217,160,135,0.3)]"
          >
            Authenticate Identity →
          </button>
        </motion.div>

        {/* Feature Grid to fill space */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-32 border-t border-copper/20 pt-16 text-left"
        >
          <div className="bg-panel p-6 border border-copper/10">
            <h3 className="font-serif text-2xl text-copperLight mb-3">Internal Referrals</h3>
            <p className="text-sm opacity-70">Bypass the standard application queue. Connect directly with alumni for internal hiring tracks.</p>
          </div>
          <div className="bg-panel p-6 border border-copper/10">
            <h3 className="font-serif text-2xl text-copperLight mb-3">AI Network</h3>
            <p className="text-sm opacity-70">Analyze resumes and extract insights directly from our proprietary alumni data matrix.</p>
          </div>
          <div className="bg-panel p-6 border border-copper/10">
            <h3 className="font-serif text-2xl text-copperLight mb-3">Directory Search</h3>
            <p className="text-sm opacity-70">Filter alumni by company, role, or graduation year to find your exact match.</p>
          </div>
        </motion.div>
      </main>

    </div>
  );
}