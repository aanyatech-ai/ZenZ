import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Play, Pause, RotateCcw, CheckCircle2, X, Sparkles, Flame, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { recordStudySession, toggleTopicStatus } from '../../db/orbitActions';

interface FocusModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTitle?: string;
  defaultMinutes?: number;
  topicId?: string;
  skillId?: string;
}

export const FocusModal: React.FC<FocusModalProps> = ({
  isOpen,
  onClose,
  defaultTitle = 'Cosmic Deep Focus',
  defaultMinutes = 25,
  topicId,
}) => {
  const [durationMinutes, setDurationMinutes] = useState(defaultMinutes);
  const [timeLeft, setTimeLeft] = useState(defaultMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientAudio, setAmbientAudio] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setTimeLeft(durationMinutes * 60);
    setIsRunning(false);
    setIsCompleted(false);
  }, [durationMinutes, isOpen]);

  // Audio tone helper (Web Audio API synthetic soothing cosmic hum)
  useEffect(() => {
    if (!ambientAudio || !isRunning) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(108, audioCtx.currentTime); // 108Hz soothing brown/theta resonance
      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();

      return () => {
        try {
          osc.stop();
          audioCtx.close();
        } catch {
          // ignore
        }
      };
    } catch {
      // AudioContext may be blocked before user gesture
    }
  }, [ambientAudio, isRunning]);

  const handleCompleteSession = React.useCallback(async () => {
    setIsRunning(false);
    setIsCompleted(true);
    const actualMins = Math.max(1, Math.round((durationMinutes * 60 - timeLeft) / 60));
    const xp = Math.round(actualMins * 0.8) + 10;

    const todayStr = new Date().toISOString().split('T')[0];
    await recordStudySession({
      type: topicId ? 'topic' : 'freestyle',
      referenceId: topicId,
      title: defaultTitle,
      durationMinutes: actualMins,
      startedAt: Date.now() - actualMins * 60000,
      endedAt: Date.now(),
      xpEarned: xp,
      wasCompleted: true,
      dateStr: todayStr,
    });

    if (topicId) {
      await toggleTopicStatus(topicId, 'done');
    }
  }, [durationMinutes, timeLeft, topicId, defaultTitle]);

  // Timer Tick
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleCompleteSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, handleCompleteSession]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = ((durationMinutes * 60 - timeLeft) / (durationMinutes * 60)) * 100;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg"
        >
          <Card variant="glass" className="relative p-6 sm:p-8 overflow-hidden border-neon-cyan/30 shadow-[0_0_50px_rgba(0,242,254,0.15)]">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Anti-Gravity Focus Chamber</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {defaultTitle}
              </h3>
            </div>

            {/* Success View */}
            {isCompleted ? (
              <div className="text-center py-6 space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="w-20 h-20 mx-auto rounded-full bg-neon-cyan/20 border-2 border-neon-cyan flex items-center justify-center text-neon-cyan"
                >
                  <CheckCircle2 className="w-10 h-10" />
                </motion.div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  Mission Complete! 🌟
                </h4>
                <p className="text-sm text-slate-400">
                  Telemetry logged to Orbit local engine. XP points transferred to your cadet rank.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button variant="neon" size="md" onClick={onClose}>
                    Return to Mission Control
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Duration Presets */}
                <div className="flex items-center justify-center gap-2 mb-8">
                  {[15, 25, 45, 60].map(mins => (
                    <button
                      key={mins}
                      onClick={() => !isRunning && setDurationMinutes(mins)}
                      disabled={isRunning}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        durationMinutes === mins
                          ? 'bg-neon-cyan text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                          : 'bg-white/10 dark:bg-space-850 text-slate-400 hover:text-white border border-slate-300/30 dark:border-space-border/60'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>

                {/* Cosmic Timer Display */}
                <div className="relative w-56 h-56 mx-auto flex flex-col items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      className="stroke-slate-200/50 dark:stroke-space-border/40"
                      strokeWidth="6"
                      fill="none"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="44"
                      className="stroke-neon-cyan"
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                      strokeDasharray={276.46}
                      strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                      transition={{ duration: 0.5 }}
                    />
                  </svg>

                  {/* Pulsing Core */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-mono">
                      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </span>
                    <span className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-medium">
                      <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      {isRunning ? 'Hyper-focusing' : 'Chamber Ready'}
                    </span>
                  </div>
                </div>

                {/* Control Actions */}
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAmbientAudio(prev => !prev)}
                    className="text-slate-400"
                    title={ambientAudio ? 'Mute ambient resonance' : 'Enable 108Hz ambient resonance'}
                  >
                    {ambientAudio ? <Volume2 className="w-4 h-4 text-neon-cyan" /> : <VolumeX className="w-4 h-4" />}
                  </Button>

                  <Button
                    variant="neon"
                    size="lg"
                    onClick={() => setIsRunning(!isRunning)}
                    leftIcon={isRunning ? <Pause className="w-5 h-5 fill-slate-950" /> : <Play className="w-5 h-5 fill-slate-950" />}
                  >
                    {isRunning ? 'Pause' : 'Ignite Focus'}
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setIsRunning(false);
                      setTimeLeft(durationMinutes * 60);
                    }}
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>

                  {isRunning && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCompleteSession}
                      className="text-emerald-400 hover:bg-emerald-500/10"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
