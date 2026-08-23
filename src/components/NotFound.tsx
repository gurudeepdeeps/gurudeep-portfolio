import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Briefcase, ArrowLeft, Compass, Sparkles } from "lucide-react";
import StarsCanvas from "./canvas/stars";
import SEOHead from "./SEOHead";

export const NotFound = () => {
  return (
    <div className="relative z-0 bg-[#050816] min-h-screen flex flex-col justify-between overflow-hidden text-white select-none">
      <SEOHead
        title="404: Page Not Found | Gurudeep V Portfolio"
        description="The requested page could not be found on Gurudeep V Portfolio website."
      />
      {/* Background Starfield */}
      <div className="absolute inset-0 z-0">
        <StarsCanvas />
      </div>

      {/* Header Logo */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.webp"
            alt="Gurudeep V Developer Logo"
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

      {/* Main 404 Hero Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center flex flex-col items-center justify-center flex-1">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-6"
        >
          <Sparkles size={14} /> 404 Error: Deep Space Void
        </motion.div>

        {/* Glowing 404 Header */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-8xl sm:text-9xl font-extrabold tracking-tight bg-gradient-to-r from-purple-500 via-indigo-400 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl"
        >
          404
        </motion.h1>

        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl sm:text-4xl font-bold mt-4 mb-3 text-white"
        >
          Lost in Deep Space
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white/60 text-sm sm:text-base max-w-xl leading-relaxed mb-10"
        >
          The page you are searching for doesn't exist, has been moved, or is temporarily offline. Let's guide you back to safety.
        </motion.p>

        {/* Action Buttons */}
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

          <a
            href="/#projects"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-all hover:scale-105"
          >
            <Briefcase size={18} className="text-indigo-400" /> Explore Projects
          </a>

          <a
            href="/#contact"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-semibold text-sm transition-all hover:scale-105"
          >
            <Compass size={18} className="text-purple-400" /> Contact Me
          </a>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-white/30 border-t border-white/5">
        © {new Date().getFullYear()} Gurudeep V. All rights reserved.
      </footer>
    </div>
  );
};

export default NotFound;
