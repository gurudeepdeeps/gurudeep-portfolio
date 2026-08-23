import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Home, Briefcase, ArrowLeft, Sparkles, MessageSquare } from "lucide-react";
import StarsCanvas from "./canvas/stars";
import SEOHead from "./SEOHead";

export const ThankYou = () => {
  return (
    <div className="relative z-0 bg-[#050816] min-h-screen flex flex-col justify-between overflow-hidden text-white select-none">
      <SEOHead
        title="Thank You! | Message Sent | Gurudeep V Portfolio"
        description="Thank you for reaching out to Gurudeep V. Your message has been sent successfully!"
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
          <ArrowLeft size={14} /> Return to Home
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-2xl mx-auto px-6 py-12 text-center flex flex-col items-center justify-center flex-1">
        {/* Animated Success Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/20"
        >
          <CheckCircle2 size={44} className="animate-bounce" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4"
        >
          <Sparkles size={14} /> Submission Received
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4"
        >
          Thank You for Reaching Out!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-white/70 text-base sm:text-lg max-w-lg leading-relaxed mb-10"
        >
          Your message has been delivered to my inbox and saved in my contact database. I will review your details and get back to you within 24 hours.
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
            <Home size={18} /> Back to Homepage
          </Link>

          <a
            href="/#projects"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition-all hover:scale-105"
          >
            <Briefcase size={18} className="text-indigo-400" /> Explore Projects
          </a>

          <a
            href="https://wa.me/917353577717?text=Hi%20Gurudeep%2C%20I%20just%20submitted%20a%20message%20on%20your%20website!"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-semibold text-sm transition-all hover:scale-105"
          >
            <MessageSquare size={18} /> Quick Chat on WhatsApp
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

export default ThankYou;
