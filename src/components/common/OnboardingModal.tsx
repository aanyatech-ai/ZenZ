import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { localDb } from '../../db/orbitDexie';
import { awardXP } from '../../db/orbitActions';
import {
  Rocket,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<number>(1);
  const [cadetName, setCadetName] = useState('Cadet Aryan');
  const [examName, setExamName] = useState('GATE CS 2026');
  const [examDate, setExamDate] = useState(
    new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0]
  );
  const [dailyHours, setDailyHours] = useState(4.0);
  const [syllabusSplit] = useState(60);
  const [hardSplit] = useState(25);
  const [softSplit] = useState(15);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFinish = async () => {
    setSubmitting(true);
    await localDb.profile.update('default_cadet', {
      name: cadetName,
      examName,
      examDate,
      dailyAvailableHours: dailyHours,
      timeSplit: {
        syllabus: syllabusSplit,
        hardSkills: hardSplit,
        softSkills: softSplit,
      },
      onboardingCompleted: true,
      updatedAt: Date.now(),
    });

    // Award onboarding XP
    await awardXP(50, 'Completed Orbit Onboarding');
    setSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg"
        >
          <Card variant="glass" className="p-6 md:p-8 relative overflow-hidden border-neon-cyan/40 shadow-2xl">
            {/* Header / Steps Indicator */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-neon-cyan/20 border border-neon-cyan/40 flex items-center justify-center text-neon-cyan">
                  <Rocket className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-neon-cyan">
                  Cadet Commissioning • Step {step} of 3
                </span>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className={`w-5 h-1.5 rounded-full transition-all ${
                      i <= step ? 'bg-neon-cyan' : 'bg-slate-300 dark:bg-space-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step 1: Cadet Name & Target Exam */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white font-sans">
                    Welcome to Orbit, Cadet 🛰️
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Let's set your callsign and target exam horizon.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <Input
                    label="Cadet Call-Sign / Name"
                    value={cadetName}
                    onChange={e => setCadetName(e.target.value)}
                    placeholder="Enter your name"
                  />
                  <Input
                    label="Target Exam / Goal"
                    value={examName}
                    onChange={e => setExamName(e.target.value)}
                    placeholder="e.g. GATE CS, UPSC, Semester Finals"
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    variant="neon"
                    size="md"
                    onClick={() => setStep(2)}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Next: Horizon
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Exam Date & Daily Capacity */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white font-sans">
                    Mission Horizon & Capacity ⏱️
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    When is the D-day, and how many hours can you dedicate each day?
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <Input
                    label="Target Exam Date"
                    type="date"
                    value={examDate}
                    onChange={e => setExamDate(e.target.value)}
                    leftIcon={<Calendar className="w-4 h-4" />}
                  />

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-neon-cyan" /> Daily Study Capacity
                      </span>
                      <span className="text-neon-cyan font-bold">{dailyHours} Hours / Day</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="14"
                      step="0.5"
                      value={dailyHours}
                      onChange={e => setDailyHours(Number(e.target.value))}
                      className="w-full mt-2 accent-cyan-400 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setStep(1)}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Back
                  </Button>
                  <Button
                    variant="neon"
                    size="md"
                    onClick={() => setStep(3)}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Next: Strategy
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Polymath Balance Split */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white font-sans">
                    The Polymath Ratio ⚖️
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Orbit balances your Academic Syllabus, Hard Skills, and Soft Skills.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-space-900/80 border border-slate-200 dark:border-space-border space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-neon-cyan">Syllabus: {syllabusSplit}%</span>
                      <span className="text-neon-purple">Hard Skills: {hardSplit}%</span>
                      <span className="text-amber-400">Soft Skills: {softSplit}%</span>
                    </div>

                    <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-200 dark:bg-space-800">
                      <div style={{ width: `${syllabusSplit}%` }} className="bg-neon-cyan h-full transition-all" />
                      <div style={{ width: `${hardSplit}%` }} className="bg-neon-purple h-full transition-all" />
                      <div style={{ width: `${softSplit}%` }} className="bg-amber-400 h-full transition-all" />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>You'll earn 50 XP upon completing commissioning!</span>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setStep(2)}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Back
                  </Button>
                  <Button
                    variant="neon"
                    size="md"
                    onClick={handleFinish}
                    isLoading={submitting}
                    rightIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Launch Orbit 🚀
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
