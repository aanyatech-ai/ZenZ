import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3800);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.aside
          aria-label="Offline notification"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="bg-amber-500/15 border-b border-amber-500/30 backdrop-blur-md px-4 py-2 text-center text-xs font-semibold text-amber-500 dark:text-amber-300 flex items-center justify-center gap-2 sticky top-0 z-50"
        >
          <WifiOff className="w-3.5 h-3.5 animate-pulse" />
          <span>Offline mode — changes sync when you're back online.</span>
        </motion.aside>
      )}

      {showReconnected && (
        <motion.aside
          aria-label="Reconnected notification"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="bg-neon-cyan/15 border-b border-neon-cyan/40 backdrop-blur-md px-4 py-2 text-center text-xs font-semibold text-neon-cyan flex items-center justify-center gap-2 sticky top-0 z-50"
        >
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Back online — syncing your Orbit...</span>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
