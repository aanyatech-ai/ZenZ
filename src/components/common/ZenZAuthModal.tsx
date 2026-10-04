import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZenZCard } from './ZenZCard';
import { ZenZPillButton } from './ZenZPillButton';
import { useAuth } from '../../context/AuthContext';
import { useZenZStore } from '../../store/useZenZStore';
import { X, Mail, Lock, User, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ZenZAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZenZAuthModal: React.FC<ZenZAuthModalProps> = ({ isOpen, onClose }) => {
  const {
    loginWithEmail,
    registerWithEmail,
    resetPassword,
    authError,
    clearAuthError,
  } = useAuth();
  const { updateUserProfile } = useZenZStore();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setSuccessMsg('');
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
        setSuccessMsg('Welcome back to ZenZ! 🌸');
        setTimeout(() => onClose(), 1000);
      } else if (mode === 'register') {
        await registerWithEmail(email, password, name || 'Aanya');
        updateUserProfile({ name: name || 'Aanya', email });
        setSuccessMsg('Account created successfully! 🚀');
        setTimeout(() => onClose(), 1000);
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setSuccessMsg('Password reset instructions sent to your email.');
      }
    } catch {
      // Handled by AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuestContinue = () => {
    updateUserProfile({ name: name || 'Aanya' });
    setSuccessMsg('Offline Guest Mode active! All data stays in your browser.');
    setTimeout(() => onClose(), 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94 }}
          className="w-full max-w-sm"
        >
          <ZenZCard variant="glass" className="p-6 relative border-pink-300/40">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-5">
              <h3 className="text-xl font-black bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent font-sans">
                {mode === 'login' ? 'Welcome Back to ZenZ' : mode === 'register' ? 'Join ZenZ Sanctuary' : 'Reset Password'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-purple-300/70 mt-1">
                {mode === 'login'
                  ? 'Sign in to sync your semester study telemetry.'
                  : mode === 'register'
                  ? 'Personal study tracker for B.Tech CSE (AI).'
                  : 'Enter your email to receive recovery instructions.'}
              </p>
            </div>

            {/* Mode switch */}
            {mode !== 'forgot' && (
              <div className="flex p-1 mb-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    clearAuthError();
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    mode === 'login'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    clearAuthError();
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    mode === 'register'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Register
                </button>
              </div>
            )}

            {/* Error or Success notification */}
            {authError && (
              <div className="mb-3 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === 'register' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Your Name
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-slate-400 absolute left-3" />
                    <input
                      type="text"
                      placeholder="e.g. Aanya"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full text-xs font-semibold pl-9 pr-3 py-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 text-slate-800 dark:text-white outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="email"
                    placeholder="student@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full text-xs font-semibold pl-9 pr-3 py-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 text-slate-800 dark:text-white outline-none"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full text-xs font-semibold pl-9 pr-3 py-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 text-slate-800 dark:text-white outline-none"
                    />
                  </div>
                  {mode === 'login' && (
                    <div className="text-right mt-1">
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] font-bold text-pink-500 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2">
                <ZenZPillButton type="submit" size="md" className="w-full shadow-lg" disabled={submitting}>
                  {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
                </ZenZPillButton>
              </div>
            </form>

            {mode === 'forgot' && (
              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-400 hover:underline"
                >
                  ← Back to Login
                </button>
              </div>
            )}

            {/* Offline fallback button */}
            <div className="mt-4 pt-3 border-t border-purple-100 dark:border-purple-500/20 text-center">
              <button
                type="button"
                onClick={handleGuestContinue}
                className="text-xs font-bold text-slate-500 hover:text-purple-600 flex items-center justify-center gap-1 mx-auto"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-pink-500" />
                <span>Continue as Local Guest (No account needed)</span>
              </button>
            </div>
          </ZenZCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
