import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from '../components/common/AuthModal';
import { OnboardingModal } from '../components/common/OnboardingModal';
import { orbitSync, type SyncState } from '../db/orbitSync';
import { useLiveQuery } from 'dexie-react-hooks';
import { localDb } from '../db/orbitDexie';
import { seedDemoData } from '../db/seedData';
import { exportDatabaseBackup, importDatabaseBackup } from '../db/orbitActions';
import type { UserProfile } from '../types/auth';
import {
  Moon,
  Sun,
  Monitor,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  User,
  Calendar,
  Save,
  CheckCircle2,
  Cloud,
  CloudCheck,
  RefreshCw,
  LogOut,
  Sparkles,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { currentUser, logout } = useAuth();

  const profile = useLiveQuery(
    () => localDb.profile.get('default_cadet') as Promise<UserProfile | undefined>,
    []
  );

  const [cadetName, setCadetName] = useState('Cadet Aryan');
  const [examName, setExamName] = useState('GATE CS 2026');
  const [examDate, setExamDate] = useState('');
  const [dailyHours, setDailyHours] = useState(4.0);
  const [isSaved, setIsSaved] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  // Sync state
  const [syncState, setSyncState] = useState<SyncState>(orbitSync.getStatus());
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(orbitSync.getLastSyncedAt());

  useEffect(() => {
    const unsub = orbitSync.subscribe((s, last) => {
      setSyncState(s);
      setLastSyncedAt(last);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (profile) {
      if (profile.name) setCadetName(profile.name);
      if (profile.examName) setExamName(profile.examName);
      if (profile.examDate) setExamDate(profile.examDate);
      if (profile.dailyAvailableHours) setDailyHours(profile.dailyAvailableHours);
    }
  }, [profile?.name, profile?.examName, profile?.examDate, profile?.dailyAvailableHours]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    await localDb.profile.update('default_cadet', {
      name: cadetName,
      examName,
      examDate,
      dailyAvailableHours: dailyHours,
      updatedAt: Date.now(),
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleManualSync = async () => {
    await orbitSync.sync();
    setStatusMsg('Telemetry synced with Cloud! ☁️');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  // Export JSON file download
  const handleExportData = async () => {
    try {
      const json = await exportDatabaseBackup();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orbit_cadet_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatusMsg('Backup downloaded successfully! 🚀');
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to export backup.');
    }
  };

  // Import JSON file
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async event => {
      try {
        const text = event.target?.result as string;
        await importDatabaseBackup(text);
        setStatusMsg('Backup restored successfully! 🎉');
        setTimeout(() => setStatusMsg(''), 3000);
      } catch {
        alert('Invalid or corrupted backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Re-seed demo data
  const handleReseed = async () => {
    if (confirm('Re-seed initial demo dataset? This will reset demo items.')) {
      await seedDemoData(true);
      setStatusMsg('Demo dataset reloaded! 🌟');
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  // Clear database
  const handleClearDb = async () => {
    if (confirm('Are you sure you want to wipe local IndexedDB? This action cannot be undone.')) {
      await localDb.subjects.clear();
      await localDb.chapters.clear();
      await localDb.topics.clear();
      await localDb.skills.clear();
      await localDb.skillTasks.clear();
      await localDb.softTasks.clear();
      await localDb.studySessions.clear();
      setStatusMsg('Database cleared.');
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-sans flex items-center gap-2">
          Mission Control Settings ⚙
        </h2>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Cadet profile, cloud sync station, themes, offline data engine, and backup management.
        </p>
      </div>

      {statusMsg && (
        <div className="p-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Cloud Account & Firebase Sync Station */}
      <Card variant="glass" className="p-6 space-y-5 border-neon-cyan/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-neon-cyan/15 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Cadet Cloud Station & Sync
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Firebase Cloud Sync keeps your telemetry in sync across web and mobile.
              </p>
            </div>
          </div>

          {/* Sync Status Badge */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                syncState === 'syncing'
                  ? 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30'
                  : syncState === 'synced'
                  ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                  : syncState === 'offline'
                  ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                  : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
              }`}
            >
              {syncState === 'syncing' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : syncState === 'synced' ? (
                <>
                  <CloudCheck className="w-3.5 h-3.5" />
                  <span>Cloud Synced</span>
                </>
              ) : syncState === 'offline' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Offline Ready</span>
                </>
              ) : (
                <>
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Ready</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* User Status details */}
        {currentUser ? (
          <div className="p-4 rounded-2xl bg-white/50 dark:bg-space-900/60 border border-slate-200 dark:border-space-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Cadet'}
                  className="w-11 h-11 rounded-full border border-neon-cyan/50 shadow-sm"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-neon-cyan to-neon-purple p-0.5">
                  <div className="w-full h-full bg-space-950 rounded-full flex items-center justify-center text-neon-cyan font-bold">
                    {(currentUser.displayName || currentUser.email || 'C')[0].toUpperCase()}
                  </div>
                </div>
              )}
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {currentUser.displayName || 'Cadet'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{currentUser.email}</div>
                <div className="text-[10px] text-emerald-500 font-medium mt-0.5">
                  Connected to Orbit Cloud • UID: {currentUser.uid.slice(0, 8)}...
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleManualSync}
                leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${syncState === 'syncing' ? 'animate-spin' : ''}`} />}
              >
                Sync Now
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                leftIcon={<LogOut className="w-3.5 h-3.5 text-rose-400" />}
                className="text-rose-400 hover:bg-rose-500/10 border border-rose-500/20"
              >
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-white/50 dark:bg-space-900/60 border border-slate-200 dark:border-space-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-slate-200 dark:bg-space-850 flex items-center justify-center text-slate-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  Guest Cadet Mode
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Data is securely stored in this browser's IndexedDB. Connect an account to sync everywhere.
                </p>
              </div>
            </div>

            <Button
              variant="neon"
              size="sm"
              onClick={() => setIsAuthModalOpen(true)}
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Sign In / Connect Cloud
            </Button>
          </div>
        )}

        {lastSyncedAt && (
          <div className="text-[11px] text-slate-400 text-right">
            Last cloud sync: {new Date(lastSyncedAt).toLocaleTimeString()}
          </div>
        )}
      </Card>

      {/* Cadet Profile & Target Exam Card */}
      <Card variant="glass" className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-neon-cyan" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Cadet Profile & Exam Horizon
            </h3>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOnboardingModalOpen(true)}
            leftIcon={<Compass className="w-3.5 h-3.5 text-indigo-400" />}
            className="text-xs text-indigo-400 hover:bg-indigo-500/10"
          >
            Launch Onboarding Tour
          </Button>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Cadet Call-Sign / Name"
              value={cadetName}
              onChange={e => setCadetName(e.target.value)}
              placeholder="e.g. Aryan or Aanya"
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Target Exam / Goal"
              value={examName}
              onChange={e => setExamName(e.target.value)}
              placeholder="e.g. GATE CS 2026, Semester Exams"
            />

            <Input
              label="Target Exam Date"
              type="date"
              value={examDate}
              onChange={e => setExamDate(e.target.value)}
              leftIcon={<Calendar className="w-4 h-4" />}
            />

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between mb-1.5">
                <span>Daily Study Capacity</span>
                <span className="text-neon-cyan font-bold">{dailyHours} Hours / Day</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="16"
                value={dailyHours}
                onChange={e => setDailyHours(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/70 dark:bg-space-900/60 border border-slate-300 dark:border-space-border text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-neon-cyan/30"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="neon"
              size="sm"
              type="submit"
              leftIcon={<Save className="w-3.5 h-3.5" />}
            >
              {isSaved ? 'Profile Saved! ✓' : 'Save Profile Changes'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Theme Control Card */}
      <Card variant="glass" className="p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Anti-Gravity Visual Theme
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'light'
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-500 font-bold'
                : 'border-slate-200 dark:border-space-border text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-5 h-5" />
            <span className="text-xs">Sky Orbit</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'dark'
                ? 'border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan font-bold shadow-[0_0_12px_rgba(0,242,254,0.2)]'
                : 'border-slate-200 dark:border-space-border text-slate-400 hover:text-slate-200'
            }`}
          >
            <Moon className="w-5 h-5" />
            <span className="text-xs">Deep Space</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              theme === 'system'
                ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-400 font-bold'
                : 'border-slate-200 dark:border-space-border text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-5 h-5" />
            <span className="text-xs">System Auto</span>
          </button>
        </div>
      </Card>

      {/* Local Data Engine & Backup */}
      <Card variant="glass" className="p-6 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Local Data Engine & Backup
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Orbit caches your mission history locally in Dexie IndexedDB. You can export complete JSON snapshots or restore them anytime.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download className="w-4 h-4 text-neon-cyan" />}
            onClick={handleExportData}
          >
            Export Backup (JSON)
          </Button>

          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-space-border hover:bg-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors">
              <Upload className="w-4 h-4 text-neon-purple" />
              Restore from JSON
            </span>
          </label>

          <Button
            variant="ghost"
            size="sm"
            leftIcon={<RotateCcw className="w-4 h-4 text-amber-400" />}
            onClick={handleReseed}
          >
            Re-seed Demo Data
          </Button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card variant="bordered" className="border-rose-500/30 bg-rose-500/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-rose-500 flex items-center gap-1.5">
            <Trash2 className="w-4 h-4" /> Reset Orbit Local Storage
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Deletes all local subjects, chapters, topics, and study logs from browser IndexedDB.
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearDb}
          className="text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 shrink-0 self-start sm:self-center"
        >
          Clear Local Database
        </Button>
      </Card>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
      />
    </div>
  );
};
