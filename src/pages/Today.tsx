import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ProgressRing } from '../components/common/ProgressRing';
import {
  Compass,
  Sparkles,
  BookOpen,
  Clock,
  Play,
  ArrowRight,
  Zap,
  CheckCircle2,
  Cpu,
  MessageSquareQuote,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLiveQuery } from 'dexie-react-hooks';
import { localDb } from '../db/orbitDexie';
import { toggleTopicStatus, toggleSkillTask, completeSoftTask } from '../db/orbitActions';
import { FocusModal } from '../components/common/FocusModal';
import { useNavigate } from 'react-router-dom';
import type { UserProfile } from '../types/auth';

export const Today: React.FC = () => {
  const navigate = useNavigate();

  const profile = useLiveQuery(
    () => localDb.profile.get('default_cadet') as Promise<UserProfile | undefined>,
    []
  );

  const subjects = useLiveQuery(() => localDb.subjects.toArray(), []) || [];
  const chapters = useLiveQuery(() => localDb.chapters.toArray(), []) || [];
  const topics = useLiveQuery(() => localDb.topics.toArray(), []) || [];
  const skillTasks = useLiveQuery(() => localDb.skillTasks.toArray(), []) || [];
  const softTasks = useLiveQuery(() => localDb.softTasks.toArray(), []) || [];

  // Focus modal state
  const [focusModal, setFocusModal] = useState<{
    isOpen: boolean;
    topicId?: string;
    title?: string;
    minutes?: number;
  }>({
    isOpen: false,
  });

  // Calculate high-priority pending mission
  const pendingTopics = topics.filter(t => t.status !== 'done');
  const inProgressTopic = topics.find(t => t.status === 'in_progress');
  const nextPriorityTopic = inProgressTopic || pendingTopics[0];

  const topicSubject = nextPriorityTopic
    ? subjects.find(s => s.id === nextPriorityTopic.subjectId)
    : null;
  const topicChapter = nextPriorityTopic
    ? chapters.find(c => c.id === nextPriorityTopic.chapterId)
    : null;

  // Active hard skill tasks
  const pendingSkillTasks = skillTasks.filter(t => t.status !== 'completed');
  const nextSkillTask = pendingSkillTasks[0];

  // Soft skill task
  const activeSoftTask = softTasks.find(s => s.status === 'pending') || softTasks[0];

  // Compute daily mission counts
  const totalMissionItems = (topics.length > 0 ? 3 : 0) + (skillTasks.length > 0 ? 2 : 0) + (softTasks.length > 0 ? 1 : 0);
  const doneTopics = topics.filter(t => t.status === 'done').length;
  const doneSkills = skillTasks.filter(t => t.status === 'completed').length;
  const doneSoft = softTasks.filter(t => t.status === 'completed').length;

  const totalCompleted = Math.min(totalMissionItems, (doneTopics > 0 ? 2 : 0) + doneSkills + doneSoft);
  const progressPercent = totalMissionItems > 0 ? Math.round((totalCompleted / totalMissionItems) * 100) : 0;

  const cadetCallsign = profile?.name ? profile.name.split(' ')[0] : 'Cadet';

  return (
    <div className="space-y-6">
      {/* Welcome & Mission Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card variant="telemetry" className="relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/25 text-neon-cyan text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mission Active • {profile?.examName || 'Orbit Prep'}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-sans">
                Chalo {cadetCallsign}, aaj ka mission complete karte hain 🚀
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Anti-Gravity HUD online. Telemetry is cached locally in Dexie IndexedDB.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="neon"
                size="md"
                leftIcon={<Play className="w-4 h-4 fill-slate-950" />}
                onClick={() =>
                  setFocusModal({
                    isOpen: true,
                    title: nextPriorityTopic ? nextPriorityTopic.title : 'Cosmic Deep Focus',
                    topicId: nextPriorityTopic?.id,
                    minutes: nextPriorityTopic?.estimatedMinutes || 25,
                  })
                }
              >
                Start Focus Chamber
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Today's Mission Progress Card & Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card variant="glass" className="md:col-span-1 flex flex-col items-center justify-center p-6 text-center">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Today's Mission Target
          </h3>
          <ProgressRing
            progress={progressPercent || 40}
            size={140}
            strokeWidth={11}
            label={`${totalCompleted} / ${totalMissionItems || 6}`}
            sublabel="Missions Done"
          />
          <div className="w-full grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-200/80 dark:border-space-border/60 text-center">
            <div>
              <div className="text-xs font-bold text-neon-cyan">
                {doneTopics}/{topics.length}
              </div>
              <div className="text-[10px] text-slate-400">Syllabus</div>
            </div>
            <div>
              <div className="text-xs font-bold text-neon-purple">
                {doneSkills}/{skillTasks.length}
              </div>
              <div className="text-[10px] text-slate-400">Hard Skill</div>
            </div>
            <div>
              <div className="text-xs font-bold text-amber-500">
                {doneSoft}/{softTasks.length}
              </div>
              <div className="text-[10px] text-slate-400">Soft Skill</div>
            </div>
          </div>
        </Card>

        {/* Priority Mission Preview & Quick Actions */}
        <Card variant="glass" className="md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-neon-cyan" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Next Priority Mission</h3>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                {nextPriorityTopic?.difficulty === 'hard' ? 'High Priority' : 'Next in Queue'}
              </span>
            </div>

            {nextPriorityTopic ? (
              <div className="p-4 rounded-2xl bg-white/60 dark:bg-space-900/60 border border-slate-200/70 dark:border-space-border/60">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-indigo-500 dark:text-neon-blue uppercase tracking-wider">
                      {topicSubject?.name || 'Academic Syllabus'} • {topicChapter?.title || 'Active Chapter'}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      {nextPriorityTopic.title}
                    </h4>
                    {nextPriorityTopic.notes && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {nextPriorityTopic.notes}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {nextPriorityTopic.estimatedMinutes} min
                      </span>
                      <span>•</span>
                      <span className="text-amber-500 font-medium capitalize">
                        Difficulty: {nextPriorityTopic.difficulty}
                      </span>
                      <span>•</span>
                      <span className="text-neon-cyan font-medium">+25 XP</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400">
                All syllabus topics completed! Great job, Cadet!
              </div>
            )}
          </div>

          {/* Quick Action Dock */}
          <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-space-border/60 flex flex-wrap items-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Play className="w-3.5 h-3.5 fill-white" />}
              onClick={() =>
                setFocusModal({
                  isOpen: true,
                  title: nextPriorityTopic ? nextPriorityTopic.title : 'Cosmic Deep Focus',
                  topicId: nextPriorityTopic?.id,
                  minutes: nextPriorityTopic?.estimatedMinutes || 25,
                })
              }
            >
              Launch Focus Chamber
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<BookOpen className="w-3.5 h-3.5" />}
              onClick={() => navigate('/syllabus')}
            >
              View Syllabus
            </Button>
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              onClick={() => navigate('/planner')}
            >
              All Missions
            </Button>
          </div>
        </Card>
      </div>

      {/* Today's Active Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Active Mission Dispatch
          </h3>
          <span className="text-xs text-slate-500">Instant checkoff & XP award</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Syllabus Item */}
          {nextPriorityTopic && (
            <Card variant="interactive" glowColor="cyan" className="p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-neon-cyan uppercase">Syllabus</span>
                  <span className="text-xs text-slate-400">{nextPriorityTopic.estimatedMinutes}m</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                  {nextPriorityTopic.title}
                </h4>
              </div>

              <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-200/60 dark:border-space-border/60">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  onClick={() => toggleTopicStatus(nextPriorityTopic.id, 'done')}
                >
                  Mark Done (+25 XP)
                </Button>
                <button
                  onClick={() =>
                    setFocusModal({
                      isOpen: true,
                      title: nextPriorityTopic.title,
                      topicId: nextPriorityTopic.id,
                      minutes: nextPriorityTopic.estimatedMinutes,
                    })
                  }
                  className="p-1.5 rounded-lg text-slate-400 hover:text-neon-cyan hover:bg-neon-cyan/10"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          )}

          {/* Hard Skill Item */}
          {nextSkillTask && (
            <Card variant="interactive" glowColor="purple" className="p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-neon-purple uppercase flex items-center gap-1">
                    <Cpu className="w-3 h-3" /> Hard Skill
                  </span>
                  <span className="text-xs text-slate-400">{nextSkillTask.estimatedMinutes}m</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                  {nextSkillTask.title}
                </h4>
              </div>

              <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-200/60 dark:border-space-border/60">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  onClick={() => toggleSkillTask(nextSkillTask.id)}
                >
                  Mark Done (+20 XP)
                </Button>
                <button
                  onClick={() =>
                    setFocusModal({
                      isOpen: true,
                      title: nextSkillTask.title,
                      minutes: nextSkillTask.estimatedMinutes,
                    })
                  }
                  className="p-1.5 rounded-lg text-slate-400 hover:text-neon-purple hover:bg-neon-purple/10"
                >
                  <Play className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          )}

          {/* Soft Skill Item */}
          {activeSoftTask && (
            <Card variant="interactive" glowColor="cyan" className="p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-amber-500 uppercase flex items-center gap-1">
                    <MessageSquareQuote className="w-3 h-3" /> Soft Skill
                  </span>
                  <span className="text-xs text-slate-400">{activeSoftTask.durationMinutes}m</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                  {activeSoftTask.title}
                </h4>
              </div>

              <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-200/60 dark:border-space-border/60">
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  onClick={() => completeSoftTask(activeSoftTask.id)}
                >
                  Claim (+15 XP)
                </Button>
                <button
                  onClick={() => navigate('/skills')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-400/10"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* System Status Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="bordered" className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-neon-cyan/10 text-neon-cyan">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Local Cache</div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Dexie IndexedDB Online</div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-neon-purple/10 text-neon-purple">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Velocity Tracker</div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Knapsack Quotas Calibrated</div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Cosmic Theme</div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100">Zero-Flash Light / Dark</div>
          </div>
        </Card>
      </div>

      {/* Focus Modal */}
      <FocusModal
        isOpen={focusModal.isOpen}
        onClose={() => setFocusModal({ isOpen: false })}
        topicId={focusModal.topicId}
        defaultTitle={focusModal.title || 'Cosmic Deep Focus'}
        defaultMinutes={focusModal.minutes || 25}
      />
    </div>
  );
};
