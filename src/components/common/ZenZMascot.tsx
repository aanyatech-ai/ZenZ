import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ZenZMascotProps {
  size?: 'sm' | 'md' | 'lg';
  quote?: string;
  showBubble?: boolean;
  className?: string;
  onClick?: () => void;
}

const MOTIVATIONAL_QUOTES = [
  'Chalo Aanya, let\'s conquer Semester III! 🌸',
  'Automata & DSA are fun once you visualize them! 🧠',
  'Take a deep breath. Focus on just one unit at a time ✨',
  'Consistency beats intensity every single day! 🚀',
  'You\'re 1 topic closer to your goal today! 🌟',
];

export const ZenZMascot: React.FC<ZenZMascotProps> = ({
  size = 'md',
  quote,
  showBubble = true,
  className = '',
  onClick,
}) => {
  const [bubbleText, setBubbleText] = useState(quote || MOTIVATIONAL_QUOTES[0]);
  const [isWaving, setIsWaving] = useState(false);

  const dimension = {
    sm: { width: 56, height: 56 },
    md: { width: 90, height: 90 },
    lg: { width: 130, height: 130 },
  }[size];

  const handleClick = () => {
    setIsWaving(true);
    setTimeout(() => setIsWaving(false), 1000);
    // Cycle random quote
    const nextQ = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setBubbleText(nextQ);
    if (onClick) onClick();
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none cursor-pointer group ${className}`}>
      {/* Speech Bubble */}
      {showBubble && (
        <AnimatePresence mode="wait">
          <motion.div
            key={bubbleText}
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.9 }}
            className="mb-2 px-3 py-1.5 max-w-[210px] text-center text-xs font-semibold rounded-2xl bg-white/85 dark:bg-[#1C162E]/90 text-purple-900 dark:text-purple-200 border border-purple-200/60 dark:border-purple-500/30 shadow-[0_8px_20px_-6px_rgba(236,72,153,0.18)] backdrop-blur-md relative"
          >
            <span>{bubbleText}</span>
            {/* Bubble Tail */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white/85 dark:bg-[#1C162E]/90 border-r border-b border-purple-200/60 dark:border-purple-500/30 rotate-45" />
          </motion.div>
        </AnimatePresence>
      )}

      {/* Floating 3D Mascot Body */}
      <motion.div
        animate={{
          y: [0, -7, 0],
          rotate: isWaving ? [-4, 6, -4, 0] : [-1, 1.5, -1],
        }}
        transition={{
          y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: isWaving ? 0.6 : 4, repeat: isWaving ? 1 : Infinity, ease: 'easeInOut' },
        }}
        whileTap={{ scale: 0.92 }}
        onClick={handleClick}
        className="relative"
        style={{ width: dimension.width, height: dimension.height }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-[0_12px_24px_rgba(236,72,153,0.28)]"
        >
          <defs>
            {/* Soft Pastel Jelly Gradient */}
            <linearGradient id="zenzJellyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="45%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#FDBA74" />
            </linearGradient>

            {/* Glassy Specular Highlight */}
            <linearGradient id="zenzGlassGleam" x1="20%" y1="0%" x2="70%" y2="80%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Cheek Blush Gradient */}
            <radialGradient id="zenzBlush" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Mascot 3D Jelly Blob */}
          <path
            d="M 50,12 C 72,12 88,28 88,52 C 88,74 72,88 50,88 C 28,88 12,74 12,52 C 12,28 28,12 50,12 Z"
            fill="url(#zenzJellyGrad)"
          />

          {/* 3D Top-Left Glassy Sheen / Glow */}
          <ellipse
            cx="40"
            cy="32"
            rx="24"
            ry="14"
            transform="rotate(-20 40 32)"
            fill="url(#zenzGlassGleam)"
          />

          {/* Cute Big Eyes */}
          <ellipse cx="38" cy="46" rx="4.5" ry="6" fill="#1E1B4B" />
          <ellipse cx="62" cy="46" rx="4.5" ry="6" fill="#1E1B4B" />

          {/* Eye Sparkles (Gleam) */}
          <circle cx="36.5" cy="43.5" r="1.8" fill="#FFFFFF" />
          <circle cx="60.5" cy="43.5" r="1.8" fill="#FFFFFF" />
          <circle cx="39.5" cy="47.5" r="0.9" fill="#FFFFFF" />
          <circle cx="63.5" cy="47.5" r="0.9" fill="#FFFFFF" />

          {/* Rosy Cheeks */}
          <circle cx="28" cy="54" r="5" fill="url(#zenzBlush)" />
          <circle cx="72" cy="54" r="5" fill="url(#zenzBlush)" />

          {/* Sweet Smiley Mouth */}
          <path
            d="M 44,53 Q 50,59 56,53"
            stroke="#1E1B4B"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cute Little Antenna / Floating Star */}
          <circle cx="50" cy="8" r="3.5" fill="#FDE047" />
          <path d="M 50,11 L 50,13" stroke="#FDE047" strokeWidth="1.5" strokeLinecap="round" />
        </svg>

        {/* Ambient Pulsing Shadow */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-2.5 bg-pink-500/20 dark:bg-purple-900/40 rounded-full blur-[3px]" />
      </motion.div>
    </div>
  );
};
