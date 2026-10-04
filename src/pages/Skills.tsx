import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import {
  Cpu,
  MessageSquareQuote,
  Sparkles,
  Plus,
  CheckCircle2,
  Clock,
  Play,
  X,
  Target,
  Mic,
  Award,
  Trash2,
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { localDb } from '../db/orbitDexie';
import { toggleSkillTask, completeSoftTask } from '../db/orbitActions';
import { FocusModal } from '../components/common/FocusModal';
import type { HardSkill, RoadmapStage, SkillTask } from '../types/skills';

const ROADMAP_STAGES: RoadmapStage[] = [
  'Start',
  'Foundation',
  'Practice',
  'Project',
  'Advanced',
  'Portfolio',
];

export const Skills: React.FC = () => {
  const skills = useLiveQuery(() => localDb.skills.toArray(), []) || [];
  const skillTasks = useLiveQuery(() => localDb.skillTasks.toArray(), []) || [];
  const softTasks = useLiveQuery(() => localDb.softTasks.toArray(), []) || [];

  // Modals
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedSkillIdForTask, setSelectedSkillIdForTask] = useState<string>('');

  // Vocal challenge reflection timer
  const [isReflecting, setIsReflecting] = useState(false);
  const [reflectSeconds, setReflectSeconds] = useState(120);

  // Focus modal
  const [focusData, setFocusData] = useState<{ isOpen: boolean; title?: string }>({
    isOpen: false,
  });

  // Forms
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillGoal, setNewSkillGoal] = useState('');
  const [newSkillStage, setNewSkillStage] = useState<RoadmapStage>('Start');
  const [newSkillMinutes, setNewSkillMinutes] = useState(30);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskMinutes, setNewTaskMinutes] = useState(30);
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Vocal reflection timer countdown
  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isReflecting && reflectSeconds > 0) {
      interval = setInterval(() => {
        setReflectSeconds(prev => prev - 1);
      }, 1000);
    } else if (reflectSeconds === 0) {
      setIsReflecting(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isReflecting, reflectSeconds]);

  const handleCreateSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newSkill: HardSkill = {
      id: `skill_${Date.now()}`,
      name: newSkillName.trim(),
      icon: 'Cpu',
      category: 'hard',
      goal: newSkillGoal.trim() || 'Level up technical mastery',
      targetLevel: 'Master',
      currentStage: newSkillStage,
      suggestedDailyMinutes: Number(newSkillMinutes) || 30,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await localDb.skills.add(newSkill);
    setNewSkillName('');
    setNewSkillGoal('');
    setIsAddSkillOpen(false);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedSkillIdForTask) return;

    const newTask: SkillTask = {
      id: `st_${Date.now()}`,
      skillId: selectedSkillIdForTask,
      title: newTaskTitle.trim(),
      estimatedMinutes: Number(newTaskMinutes) || 30,
      priority: newTaskPriority,
      status: 'pending',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await localDb.skillTasks.add(newTask);
    setNewTaskTitle('');
    setIsAddTaskOpen(false);
  };

  const handleAdvanceStage = async (skill: HardSkill) => {
    const curIdx = ROADMAP_STAGES.indexOf(skill.currentStage);
    const nextIdx = (curIdx + 1) % ROADMAP_STAGES.length;
    await localDb.skills.update(skill.id, {
      currentStage: ROADMAP_STAGES[nextIdx],
      updatedAt: Date.now(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-sans flex items-center gap-2">
            Skills Command Hub 🛠
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Hard skills roadmap pipelines & daily soft skill vocal micro-missions.
          </p>
        </div>

        <Button
          variant="neon"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddSkillOpen(true)}
        >
          Add Hard Skill
        </Button>
      </div>

      {/* Section 1: Hard Skills Roadmaps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-neon-cyan" /> Hard Skills Roadmaps
          </h3>
          <span className="text-xs text-slate-500">{skills.length} active roadmaps</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {skills.map(skill => {
            const tasks = skillTasks.filter(t => t.skillId === skill.id);
            const completedCount = tasks.filter(t => t.status === 'completed').length;
            const curStageIdx = ROADMAP_STAGES.indexOf(skill.currentStage);

            return (
              <Card key={skill.id} variant="glass" className="p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-neon-cyan/10 text-neon-cyan">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                          {skill.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{skill.goal}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAdvanceStage(skill)}
                      className="px-2.5 py-1 rounded-xl bg-neon-purple/10 border border-neon-purple/30 text-neon-purple text-xs font-bold hover:bg-neon-purple/20 transition-colors"
                      title="Click to advance roadmap stage"
                    >
                      {skill.currentStage} →
                    </button>
                  </div>

                  {/* Stage Step Indicators */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-space-border/60">
                    <div className="flex items-center justify-between gap-1">
                      {ROADMAP_STAGES.map((stg, i) => (
                        <div key={stg} className="flex-1 flex flex-col items-center">
                          <div
                            className={`w-full h-1.5 rounded-full mb-1 transition-all ${
                              i <= curStageIdx ? 'bg-neon-cyan' : 'bg-slate-200 dark:bg-space-850'
                            }`}
                          />
                          <span
                            className={`text-[9px] font-semibold truncate ${
                              i === curStageIdx ? 'text-neon-cyan font-bold' : 'text-slate-400'
                            }`}
                          >
                            {stg}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tasks List */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Checklist Tasks ({completedCount}/{tasks.length})</span>
                      <button
                        onClick={() => {
                          setSelectedSkillIdForTask(skill.id);
                          setIsAddTaskOpen(true);
                        }}
                        className="text-neon-cyan hover:underline font-semibold"
                      >
                        + Add Task
                      </button>
                    </div>

                    {tasks.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-400 bg-slate-100/40 dark:bg-space-850/40 rounded-xl">
                        No tasks yet. Add practice missions to level up this skill!
                      </div>
                    ) : (
                      tasks.map(task => (
                        <div
                          key={task.id}
                          className="p-2.5 rounded-xl bg-white/60 dark:bg-space-900/60 border border-slate-200/70 dark:border-space-border/60 flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-2.5">
                            <button
                              onClick={() => toggleSkillTask(task.id)}
                              className="text-slate-400 hover:text-emerald-400 transition-colors"
                            >
                              {task.status === 'completed' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                              ) : (
                                <div className="w-4 h-4 rounded border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-400" />
                              )}
                            </button>
                            <span
                              className={`text-xs font-medium text-slate-800 dark:text-slate-200 ${
                                task.status === 'completed' ? 'line-through text-slate-400' : ''
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">{task.estimatedMinutes}m</span>
                            <button
                              onClick={() =>
                                setFocusData({
                                  isOpen: true,
                                  title: task.title,
                                })
                              }
                              className="p-1 rounded text-slate-400 hover:text-neon-cyan"
                              title="Start timer for this task"
                            >
                              <Play className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 dark:border-space-border/60 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-indigo-400" /> Target: {skill.targetLevel}
                  </span>
                  <button
                    onClick={async () => {
                      if (confirm(`Delete skill "${skill.name}"?`)) {
                        await localDb.skills.delete(skill.id);
                      }
                    }}
                    className="text-slate-400 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Section 2: Soft Skills & Daily Vocal Micro-Missions */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <MessageSquareQuote className="w-4 h-4 text-neon-purple" /> Soft Skills & Vocal Micro-Missions
          </h3>
          <span className="text-xs text-neon-amber font-semibold">+15 XP per mission</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {softTasks.map(task => (
            <Card
              key={task.id}
              variant="interactive"
              glowColor="purple"
              className="p-5 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neon-purple/10 text-neon-purple border border-neon-purple/30">
                    {task.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                    <Clock className="w-3 h-3" /> {task.durationMinutes} min
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {task.title}
                </h4>

                <div className="p-3.5 mt-2 rounded-xl bg-slate-100/70 dark:bg-space-900/70 border border-slate-200/70 dark:border-space-border/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  "{task.prompt}"
                </div>
              </div>

              {/* Vocal Reflection Timer & Complete Action */}
              <div className="pt-3 border-t border-slate-200/60 dark:border-space-border/60 flex items-center justify-between">
                {task.status === 'completed' ? (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Vocal Reflection Completed (+15 XP)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 w-full justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant={isReflecting ? 'secondary' : 'primary'}
                        size="sm"
                        leftIcon={<Mic className="w-3.5 h-3.5 text-amber-400" />}
                        onClick={() => {
                          if (isReflecting) {
                            setIsReflecting(false);
                          } else {
                            setIsReflecting(true);
                            setReflectSeconds(120);
                          }
                        }}
                      >
                        {isReflecting
                          ? `${Math.floor(reflectSeconds / 60)}:${String(reflectSeconds % 60).padStart(2, '0')} Recording`
                          : 'Start 2-Min Vocal'}
                      </Button>
                    </div>

                    <Button
                      variant="neon"
                      size="sm"
                      leftIcon={<Award className="w-3.5 h-3.5 fill-slate-950" />}
                      onClick={() => completeSoftTask(task.id)}
                    >
                      Claim +15 XP
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Suggested Roadmaps Prompt Card */}
      <Card variant="glass" className="p-5 flex items-center gap-3 border-neon-cyan/20">
        <Sparkles className="w-5 h-5 text-neon-cyan shrink-0" />
        <span className="text-xs text-slate-400 leading-relaxed">
          Orbit balances academic preparation with industry technical roadmaps. Daily soft skill missions ensure you are interview-ready alongside technical excellence.
        </span>
      </Card>

      {/* Add Skill Modal */}
      {isAddSkillOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
          <Card variant="glass" className="w-full max-w-md p-6 space-y-4 border-neon-cyan/40">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Hard Skill Roadmap</h3>
              <button onClick={() => setIsAddSkillOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSkill} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400">Skill / Domain Name</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Systems & Golang"
                  value={newSkillName}
                  onChange={e => setNewSkillName(e.target.value)}
                  className="w-full px-3 py-2 mt-1 rounded-xl glass-panel text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-neon-cyan/40"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Mastery Goal</label>
                <input
                  type="text"
                  placeholder="e.g. Build Raft consensus & scalable key-value store"
                  value={newSkillGoal}
                  onChange={e => setNewSkillGoal(e.target.value)}
                  className="w-full px-3 py-2 mt-1 rounded-xl glass-panel text-sm text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400">Current Stage</label>
                  <select
                    value={newSkillStage}
                    onChange={e => setNewSkillStage(e.target.value as RoadmapStage)}
                    className="w-full px-3 py-2 mt-1 rounded-xl glass-panel text-sm text-slate-900 dark:text-white outline-none"
                  >
                    {ROADMAP_STAGES.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400">Daily Target (Mins)</label>
                  <input
                    type="number"
                    step="5"
                    min="15"
                    value={newSkillMinutes}
                    onChange={e => setNewSkillMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 mt-1 rounded-xl glass-panel text-sm text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddSkillOpen(false)}>
                  Cancel
                </Button>
                <Button variant="neon" size="sm" type="submit">
                  Create Roadmap
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Add Task Modal */}
      {isAddTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
          <Card variant="glass" className="w-full max-w-md p-6 space-y-4 border-neon-purple/40">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Add Checklist Task</h3>
              <button onClick={() => setIsAddTaskOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Implement Raft leader election in Go"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 mt-1 rounded-xl glass-panel text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-neon-purple/40"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400">Estimated Minutes</label>
                  <input
                    type="number"
                    step="5"
                    min="10"
                    value={newTaskMinutes}
                    onChange={e => setNewTaskMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 mt-1 rounded-xl glass-panel text-sm text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={e => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full px-3 py-2 mt-1 rounded-xl glass-panel text-sm text-slate-900 dark:text-white outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddTaskOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Add Task
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Focus Modal */}
      <FocusModal
        isOpen={focusData.isOpen}
        onClose={() => setFocusData({ isOpen: false })}
        defaultTitle={focusData.title || 'Skills Deep Practice'}
      />
    </div>
  );
};
