import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";

export const OfflineNotice = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <aside aria-label="Network status notification">
      <AnimatePresence>
        {isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            role="alert"
            aria-live="assertive"
            className="fixed top-0 left-0 right-0 z-50 bg-amber-500/90 backdrop-blur-md text-stone-950 font-semibold text-xs sm:text-sm py-2 px-4 shadow-lg flex items-center justify-center gap-2 border-b border-amber-600/30"
          >
            <WifiOff size={16} className="shrink-0" />
            <span>You are currently browsing offline. Some dynamic features and 3D assets may be unavailable.</span>
            <button
              onClick={() => window.location.reload()}
              className="ml-2 inline-flex items-center gap-1 bg-black/15 hover:bg-black/25 px-2 py-0.5 rounded text-xs transition-colors"
            >
              <RefreshCw size={12} /> Retry
            </button>
          </motion.div>
        )}

        {showReconnected && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            role="status"
            aria-live="polite"
            className="fixed top-0 left-0 right-0 z-50 bg-emerald-600/95 backdrop-blur-md text-white font-semibold text-xs sm:text-sm py-2 px-4 shadow-lg flex items-center justify-center gap-2 border-b border-emerald-500/30"
          >
            <Wifi size={16} className="shrink-0" />
            <span>Connection restored. You are back online!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};

export default OfflineNotice;
