import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Check, X, ShieldCheck } from "lucide-react";

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("gurudeep_cookie_consent");
      if (!consent) {
        // Show banner after short delay for optimal UX
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem("gurudeep_cookie_consent", "accepted");
    } catch (e) {}
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem("gurudeep_cookie_consent", "essential_only");
    } catch (e) {}
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 p-5 bg-[#100d25]/95 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl text-white"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-2xl border border-indigo-500/30 shrink-0">
              <Cookie size={22} />
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Cookie Preferences <ShieldCheck size={14} className="text-emerald-400" />
                </h4>
                <button
                  onClick={handleDecline}
                  className="text-white/40 hover:text-white transition-colors"
                  aria-label="Close cookie banner"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-xs text-white/70 leading-relaxed">
                This website uses essential cookies and anonymous analytics to enhance performance and optimize user experience.
              </p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleAccept}
                  className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Check size={14} /> Accept All
                </button>

                <button
                  onClick={handleDecline}
                  className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-xs font-semibold transition-all"
                >
                  Essential Only
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
