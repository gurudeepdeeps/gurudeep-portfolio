import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cookie, ShieldCheck, Check, RotateCcw } from "lucide-react";

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CookiePreferencesModal = ({ isOpen, onClose }: CookiePreferencesModalProps) => {
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("gurudeep_cookie_consent");
      if (stored === "essential_only") {
        setPreferences({ essential: true, analytics: false });
      } else if (stored === "accepted") {
        setPreferences({ essential: true, analytics: true });
      }
    } catch (e) {
      // fallback
    }
  }, [isOpen]);

  const handleSave = () => {
    try {
      const status = preferences.analytics ? "accepted" : "essential_only";
      localStorage.setItem("gurudeep_cookie_consent", status);
    } catch (e) {
      // ignore
    }
    onClose();
  };

  const handleReset = () => {
    try {
      localStorage.removeItem("gurudeep_cookie_consent");
      setPreferences({ essential: true, analytics: true });
    } catch (e) {}
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#100d25] border border-white/10 shadow-2xl text-white relative"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all"
              aria-label="Close preferences modal"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-400 border border-indigo-500/30">
                <Cookie size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  Cookie Settings <ShieldCheck size={18} className="text-emerald-400" />
                </h3>
                <p className="text-xs text-white/50">Manage local storage and analytics preferences</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {/* Essential */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start justify-between gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Strictly Necessary Cookies
                  </h4>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Essential for secure authentication sessions, contact enquiry validation, and saving your preferences. Cannot be disabled.
                  </p>
                </div>
                <div className="mt-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider shrink-0">
                  Required
                </div>
              </div>

              {/* Analytics */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Performance & Analytics
                  </h4>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Provides aggregated, anonymous visitor metrics via Vercel Web Analytics to help evaluate site speed and page load performance.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences((prev) => ({ ...prev, analytics: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs text-white/50 hover:text-white/80 transition-colors"
              >
                <RotateCcw size={14} /> Reset
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs font-semibold border border-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <Check size={14} /> Save Preferences
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CookiePreferencesModal;
