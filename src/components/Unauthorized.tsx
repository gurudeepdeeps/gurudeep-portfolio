import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldX, Home, ArrowLeft } from "lucide-react";
import StarsCanvas from "./canvas/stars";
import SEOHead from "./SEOHead";

export const Unauthorized = () => {
  return (
    <div className="relative z-0 bg-[#050816] min-h-screen flex flex-col justify-between overflow-hidden text-white select-none">
      <SEOHead
        title="403: Access Restricted | Gurudeep V Portfolio"
        description="Administrative credentials are required to access this portal area."
      />

      <div className="absolute inset-0 z-0">
        <StarsCanvas />
      </div>

      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.webp"
            alt="Gurudeep V Portfolio Logo"
            className="w-10 h-10 object-contain rounded-xl border border-white/10 group-hover:scale-105 transition-transform"
          />
          <span className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">
            Gurudeep V <span className="text-xs text-white/40 font-normal">| Developer</span>
          </span>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white/80 hover:text-white transition-all"
        >
          <ArrowLeft size={14} /> Back to Site
        </Link>
      </header>

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-12 text-center flex flex-col items-center justify-center flex-1">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-6 shadow-xl shadow-amber-500/10"
        >
          <ShieldX size={42} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4"
        >
          403 Forbidden: Restricted Zone
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4"
        >
          Authentication Required
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white/70 text-base sm:text-lg max-w-lg leading-relaxed mb-10"
        >
          You do not have permission to view this resource. If you believe this is an error, please return to the main site.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Home size={18} /> Return to Homepage
          </Link>
        </motion.div>
      </main>

      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-white/30 border-t border-white/5">
        © {new Date().getFullYear()} Gurudeep V. All rights reserved.
      </footer>
    </div>
  );
};

export default Unauthorized;
