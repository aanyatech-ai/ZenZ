import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  Mail,
  Lock,
  User,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Rocket,
  ShieldCheck,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'login',
}) => {
  const {
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    resetPassword,
    enterDemoCadetMode,
    authError,
    clearAuthError,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cadetName, setCadetName] = useState('');
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
        setSuccessMsg('Welcome back to Orbit, Cadet! 🚀');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else if (mode === 'register') {
        await registerWithEmail(email, password, cadetName || 'Cadet');
        setSuccessMsg('Cadet registered successfully! Mission ready. 🌟');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setSuccessMsg('Password reset link bhej diya gaya hai! Check your inbox.');
      }
    } catch {
      // Error handled by AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    clearAuthError();
    setSuccessMsg('');
    setSubmitting(true);
    try {
      await loginWithGoogle();
      setSuccessMsg('Google se connect ho gaya! 🛸');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch {
      // Handled by AuthContext
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoSignIn = async () => {
    clearAuthError();
    setSubmitting(true);
    await enterDemoCadetMode('Cadet Aryan', 'cadet@orbit.local');
    setSuccessMsg('Offline Cadet Mode activated! 🛰️');
    setTimeout(() => {
      setSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md"
        >
          <Card variant="glass" className="p-6 relative overflow-hidden border-neon-cyan/40 shadow-2xl">
            {/* Ambient Background Glow */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-neon-cyan/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-neon-purple/20 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-neon-cyan to-neon-purple p-0.5 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
                <div className="w-full h-full bg-space-950 rounded-[14px] flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-neon-cyan" />
                </div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-sans">
                  {mode === 'login' ? 'Cadet Cloud Login' : mode === 'register' ? 'Cadet Registration' : 'Recover Orbit Access'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {mode === 'login'
                    ? 'Sign in to sync your study telemetry across devices.'
                    : mode === 'register'
                    ? 'Create your Orbit cloud account in seconds.'
                    : 'Enter your registered email to reset password.'}
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            {mode !== 'forgot' && (
              <div className="flex p-1 mb-5 rounded-xl bg-slate-200/60 dark:bg-space-900/60 border border-slate-300 dark:border-space-border">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    clearAuthError();
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    mode === 'login'
                      ? 'bg-neon-cyan text-space-950 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    clearAuthError();
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    mode === 'register'
                      ? 'bg-neon-cyan text-space-950 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-white'
                  }`}
                >
                  Register
                </button>
              </div>
            )}

            {/* Error Message */}
            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 text-xs font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'register' && (
                <Input
                  label="Cadet Call-Sign / Name"
                  placeholder="e.g. Aryan or Aanya"
                  value={cadetName}
                  onChange={e => setCadetName(e.target.value)}
                  leftIcon={<User className="w-4 h-4" />}
                  required
                />
              )}

              <Input
                label="Cadet Email"
                type="email"
                placeholder="cadet@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              {mode !== 'forgot' && (
                <div>
                  <Input
                    label="Access Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    leftIcon={<Lock className="w-4 h-4" />}
                    required
                  />
                  {mode === 'login' && (
                    <div className="flex justify-end mt-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          clearAuthError();
                        }}
                        className="text-[11px] text-neon-cyan hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>
              )}

              <Button
                variant="neon"
                size="md"
                type="submit"
                className="w-full mt-2"
                isLoading={submitting}
              >
                {mode === 'login'
                  ? 'Sign In to Orbit'
                  : mode === 'register'
                  ? 'Create Cadet Account'
                  : 'Send Reset Link'}
              </Button>
            </form>

            {mode === 'forgot' && (
              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    clearAuthError();
                  }}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ← Back to Sign In
                </button>
              </div>
            )}

            {/* Social & Alternative Logins */}
            {mode !== 'forgot' && (
              <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-space-border/60 space-y-2.5">
                {/* Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={submitting}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-space-border bg-white/60 dark:bg-space-900/60 hover:bg-slate-100 dark:hover:bg-space-850 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2.5 transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.67-5.17 3.67-9.15z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.15C3.25 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.25C.45 8.22 0 10.05 0 12s.45 3.78 1.25 5.39l4.02-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.25 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Guest / Offline Mode */}
                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  disabled={submitting}
                  className="w-full py-2 px-3 rounded-xl border border-transparent hover:border-slate-300 dark:hover:border-space-border text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-neon-cyan" />
                  <span>Use Offline Cadet Mode (Local IndexedDB only)</span>
                </button>
              </div>
            )}

            {/* Offline Telemetry Guarantee */}
            <div className="mt-4 text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-neon-cyan" />
              <span>Orbit stores all your telemetry locally first. Cloud sync is optional.</span>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
