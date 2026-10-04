import React, { useState } from 'react';
import { useZenZStore } from '../store/useZenZStore';
import { ZenZCard } from '../components/common/ZenZCard';
import { ZenZPomodoroModal } from '../components/common/ZenZPomodoroModal';
import {
  BookOpen,
  FlaskConical,
  Award,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock,
  Check,
  RotateCcw,
  Circle,
  Calculator,
} from 'lucide-react';
import type { TopicStatus } from '../types/zenz';

export const Syllabus: React.FC = () => {
  const { subjects, toggleTopicStatus, toggleLabExperiment } = useZenZStore();

  const [activeTab, setActiveTab] = useState<'theory' | 'labs' | 'marks'>('theory');
  const [filterMode, setFilterMode] = useState<'all' | 'remaining'>('all');
  const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({
    'NEC-301': true,
    'NCS-301': true,
  });
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({
    'nec301_u1': true,
    'ncs301_u1': true,
  });

  // Pomodoro focus topic state
  const [focusTopic, setFocusTopic] = useState<{
    isOpen: boolean;
    subjectCode?: string;
    topicTitle?: string;
  }>({ isOpen: false });

  const toggleSubjectExpand = (code: string) => {
    setExpandedSubjects((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  const toggleUnitExpand = (unitId: string) => {
    setExpandedUnits((prev) => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  // Status cycling
  const handleCycleStatus = (subCode: string, unitId: string, topicId: string, current: TopicStatus) => {
    const sequence: TopicStatus[] = ['not_started', 'in_progress', 'done', 'revise'];
    const nextIdx = (sequence.indexOf(current) + 1) % sequence.length;
    toggleTopicStatus(subCode, unitId, topicId, sequence[nextIdx]);
  };

  const getStatusBadge = (status: TopicStatus) => {
    switch (status) {
      case 'done':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Done
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        );
      case 'revise':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
            <RotateCcw className="w-3 h-3" /> Needs Revision
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-space-800 text-slate-500 border border-slate-300 dark:border-space-border">
            <Circle className="w-3 h-3" /> Not Started
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 pb-24 max-w-md md:max-w-4xl mx-auto px-4 pt-4">
      {/* Top Header & Navigation Tabs */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white font-sans flex items-center gap-2">
          Syllabus & Labs Tracker 📚
        </h2>
        <p className="text-xs text-slate-500 dark:text-purple-300/70 mt-0.5">
          B.Tech CSE (AI) Semester III curriculum & experiment logs.
        </p>

        {/* Tab switchers: Theory / Labs / Marks Scheme */}
        <div className="flex p-1 mt-3 rounded-2xl bg-white/70 dark:bg-[#1C162E]/75 border border-purple-200/60 dark:border-purple-500/25">
          <button
            onClick={() => setActiveTab('theory')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'theory'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Theory (6)
          </button>
          <button
            onClick={() => setActiveTab('labs')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'labs'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" /> Labs (5)
          </button>
          <button
            onClick={() => setActiveTab('marks')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'marks'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" /> Marks Scheme
          </button>
        </div>
      </div>

      {/* Filter Row (Only for Theory) */}
      {activeTab === 'theory' && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Curriculum Explorer
          </span>
          <div className="flex items-center gap-1 bg-white/70 dark:bg-[#1C162E]/70 p-1 rounded-xl border border-purple-200/50">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterMode === 'all'
                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              All Topics
            </button>
            <button
              onClick={() => setFilterMode('remaining')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterMode === 'remaining'
                  ? 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Remaining Only
            </button>
          </div>
        </div>
      )}

      {/* TAB 1: THEORY SUBJECTS (Subject -> Unit -> Topic) */}
      {activeTab === 'theory' && (
        <div className="space-y-4">
          {subjects
            .filter((s) => s.type === 'theory')
            .map((sub) => {
              const isSubExpanded = !!expandedSubjects[sub.code];

              // Calculate subject progress
              let subTopics = 0;
              let subDone = 0;
              sub.units.forEach((u) => {
                u.topics.forEach((t) => {
                  subTopics++;
                  if (t.status === 'done') subDone++;
                });
              });
              const subPct = subTopics > 0 ? Math.round((subDone / subTopics) * 100) : 0;

              return (
                <ZenZCard
                  key={sub.code}
                  variant="glass"
                  className="p-0 overflow-hidden border-purple-200/60 shadow-md"
                >
                  {/* Subject Accordion Header */}
                  <div
                    onClick={() => toggleSubjectExpand(sub.code)}
                    className="p-4 cursor-pointer flex items-center justify-between gap-3 hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs text-white shadow-sm shrink-0"
                        style={{ backgroundColor: sub.color }}
                      >
                        {sub.code.split('-')[1]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">{sub.code}</span>
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.2 rounded"
                            style={{ backgroundColor: `${sub.color}20`, color: sub.color }}
                          >
                            {sub.credits} Credits
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                          {sub.name}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200 font-sans">
                          {subPct}%
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {subDone}/{subTopics} topics
                        </div>
                      </div>
                      {isSubExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Subject Overall Progress Bar */}
                  <div className="w-full h-1.5 bg-purple-100 dark:bg-purple-950/60 overflow-hidden">
                    <div
                      className="h-full transition-all duration-500"
                      style={{ width: `${subPct}%`, backgroundColor: sub.color }}
                    />
                  </div>

                  {/* Units & Topics List */}
                  {isSubExpanded && (
                    <div className="p-4 space-y-3 bg-purple-50/20 dark:bg-[#181229]/40 border-t border-purple-100 dark:border-purple-500/15">
                      {sub.units.map((unit) => {
                        const isUnitExpanded = !!expandedUnits[unit.id];
                        const unitDone = unit.topics.filter((t) => t.status === 'done').length;
                        const unitTotal = unit.topics.length;
                        const unitPct = unitTotal > 0 ? Math.round((unitDone / unitTotal) * 100) : 0;

                        const displayedTopics =
                          filterMode === 'remaining'
                            ? unit.topics.filter((t) => t.status !== 'done')
                            : unit.topics;

                        if (filterMode === 'remaining' && displayedTopics.length === 0) {
                          return null;
                        }

                        return (
                          <div
                            key={unit.id}
                            className="rounded-2xl border border-purple-200/60 dark:border-purple-500/20 bg-white/70 dark:bg-[#1E1632]/70 overflow-hidden"
                          >
                            {/* Unit Header */}
                            <div
                              onClick={() => toggleUnitExpand(unit.id)}
                              className="p-3 flex items-center justify-between cursor-pointer hover:bg-purple-50/50 dark:hover:bg-purple-900/20 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-black uppercase text-pink-600 dark:text-pink-400">
                                  Unit {unit.unitNumber}:
                                </span>
                                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100">
                                  {unit.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-2.5">
                                <span className="text-xs font-bold text-slate-400 font-sans">
                                  {unitPct}%
                                </span>
                                {isUnitExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-slate-400" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-slate-400" />
                                )}
                              </div>
                            </div>

                            {/* Unit Mini Progress Bar */}
                            <div className="w-full h-1 bg-purple-100 dark:bg-purple-950/40">
                              <div
                                className="h-full bg-pink-500 transition-all duration-300"
                                style={{ width: `${unitPct}%` }}
                              />
                            </div>

                            {/* Topic Items */}
                            {isUnitExpanded && (
                              <div className="divide-y divide-purple-100 dark:divide-purple-500/15 p-2 space-y-1">
                                {displayedTopics.map((topic) => (
                                  <div
                                    key={topic.id}
                                    className="p-2.5 flex items-center justify-between gap-3 rounded-xl hover:bg-purple-50/40 dark:hover:bg-purple-950/20 transition-all"
                                  >
                                    <div
                                      onClick={() =>
                                        handleCycleStatus(sub.code, unit.id, topic.id, topic.status)
                                      }
                                      className="flex items-center gap-3 cursor-pointer flex-1"
                                    >
                                      <button
                                        type="button"
                                        aria-label="Toggle status"
                                        className="shrink-0"
                                      >
                                        {topic.status === 'done' ? (
                                          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                                          </div>
                                        ) : topic.status === 'in_progress' ? (
                                          <div className="w-5 h-5 rounded-full border-2 border-amber-500 flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                                          </div>
                                        ) : topic.status === 'revise' ? (
                                          <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white">
                                            <RotateCcw className="w-3 h-3 stroke-[2.5]" />
                                          </div>
                                        ) : (
                                          <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                                        )}
                                      </button>

                                      <div>
                                        <div
                                          className={`text-xs font-semibold ${
                                            topic.status === 'done'
                                              ? 'line-through text-slate-400'
                                              : 'text-slate-800 dark:text-slate-100'
                                          }`}
                                        >
                                          {topic.title}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() =>
                                          handleCycleStatus(
                                            sub.code,
                                            unit.id,
                                            topic.id,
                                            topic.status
                                          )
                                        }
                                      >
                                        {getStatusBadge(topic.status)}
                                      </button>

                                      {/* Pomodoro quick trigger */}
                                      <button
                                        onClick={() =>
                                          setFocusTopic({
                                            isOpen: true,
                                            subjectCode: sub.code,
                                            topicTitle: topic.title,
                                          })
                                        }
                                        title="Focus with Pomodoro"
                                        className="p-1 rounded-lg text-slate-400 hover:text-pink-500 hover:bg-pink-50 transition-colors"
                                      >
                                        <Clock className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ZenZCard>
              );
            })}
        </div>
      )}

      {/* TAB 2: LAB EXPERIMENTS TRACKER */}
      {activeTab === 'labs' && (
        <div className="space-y-4">
          {subjects
            .filter((s) => s.type === 'lab')
            .map((lab) => {
              const experiments = lab.experiments || [];
              const completedCount = experiments.filter((e) => e.completed).length;
              const minReq = lab.minExperiments || 10;
              const totalExp = lab.totalExperiments || experiments.length;
              const hasMetRequirement = completedCount >= minReq;

              return (
                <ZenZCard key={lab.code} variant="glass" className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-300">
                          {lab.code}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            hasMetRequirement
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {completedCount} / {minReq} Min Required ({totalExp} total)
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {lab.name}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-black text-pink-500 font-sans">
                        {completedCount}
                      </span>
                      <span className="text-xs text-slate-400">/{minReq}</span>
                    </div>
                  </div>

                  {/* Experiments Checklist */}
                  <div className="divide-y divide-purple-100 dark:divide-purple-500/15 border-t border-purple-100 dark:border-purple-500/20 pt-2 space-y-1">
                    {experiments.map((exp) => (
                      <div
                        key={exp.id}
                        onClick={() => toggleLabExperiment(lab.code, exp.id)}
                        className="py-2 px-1 flex items-center justify-between gap-3 cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={exp.completed}
                            onChange={() => {}}
                            className="w-4 h-4 accent-pink-500 rounded cursor-pointer"
                          />
                          <span
                            className={`text-xs ${
                              exp.completed
                                ? 'line-through text-slate-400'
                                : 'text-slate-800 dark:text-slate-200 group-hover:text-pink-500'
                            }`}
                          >
                            Exp {exp.expNumber}: {exp.title}
                          </span>
                        </div>
                        {exp.dateCompleted && (
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {exp.dateCompleted}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </ZenZCard>
              );
            })}
        </div>
      )}

      {/* TAB 3: MARKS SCHEME TRACKER */}
      {activeTab === 'marks' && (
        <div className="space-y-4">
          <ZenZCard variant="pastel" pastelColor="pink" className="p-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-pink-500" /> B.Tech Semester III Marks Scheme Guide
            </h4>
            <p className="text-xs text-slate-600 dark:text-purple-200/80 mt-1">
              Theory subjects: <strong>CT (20)</strong> + <strong>TA (10)</strong> + <strong>ESE (70)</strong> = 100 Marks.
              <br />
              Lab subjects: <strong>Sessional (20)</strong> + <strong>ESE (30)</strong> = 50 Marks.
              <br />
              NGP-301: <strong>General Proficiency (50 Marks)</strong>.
            </p>
          </ZenZCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {subjects.map((sub) => {
              const marks = sub.marks || {};
              const isTheory = sub.type === 'theory';
              const isLab = sub.type === 'lab';
              const isGP = sub.type === 'general';

              const currentTotal = isTheory
                ? (marks.classTest || 0) + (marks.teachersAssessment || 0) + (marks.endSemExam || 0)
                : isLab
                ? (marks.labSessional || 0) + (marks.labEse || 0)
                : marks.generalProficiency || 0;

              const maxTotal = isTheory ? 100 : isLab ? 50 : 50;

              return (
                <ZenZCard key={sub.code} variant="glass" className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black text-purple-600 dark:text-purple-300">
                        {sub.code} • {sub.type.toUpperCase()}
                      </span>
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {sub.name}
                      </h5>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-black text-pink-500 font-sans">
                        {currentTotal}/{maxTotal}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {Math.round((currentTotal / maxTotal) * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Marks Breakdown Pills */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1 text-[11px] text-center font-bold">
                    {isTheory && (
                      <>
                        <div className="p-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
                          <div>CT</div>
                          <div className="text-xs">{marks.classTest || 0}/20</div>
                        </div>
                        <div className="p-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300">
                          <div>TA</div>
                          <div className="text-xs">{marks.teachersAssessment || 0}/10</div>
                        </div>
                        <div className="p-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300">
                          <div>ESE</div>
                          <div className="text-xs">{marks.endSemExam || 0}/70</div>
                        </div>
                      </>
                    )}

                    {isLab && (
                      <>
                        <div className="p-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 col-span-1.5">
                          <div>Sessional</div>
                          <div className="text-xs">{marks.labSessional || 0}/20</div>
                        </div>
                        <div className="p-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 col-span-1.5">
                          <div>ESE Practical</div>
                          <div className="text-xs">{marks.labEse || 0}/30</div>
                        </div>
                      </>
                    )}

                    {isGP && (
                      <div className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 col-span-3">
                        <div>General Proficiency</div>
                        <div className="text-xs">{marks.generalProficiency || 0}/50</div>
                      </div>
                    )}
                  </div>
                </ZenZCard>
              );
            })}
          </div>
        </div>
      )}

      {/* Pomodoro Focus Modal */}
      <ZenZPomodoroModal
        isOpen={focusTopic.isOpen}
        onClose={() => setFocusTopic({ isOpen: false })}
        defaultSubjectCode={focusTopic.subjectCode}
        defaultTopicTitle={focusTopic.topicTitle}
      />
    </div>
  );
};
