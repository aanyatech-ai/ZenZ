import React, { useState, useEffect } from 'react';
import { Card } from './Card';
import { Search, X, BookOpen, Layers, Cpu, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveQuery } from 'dexie-react-hooks';
import { localDb } from '../../db/orbitDexie';
import { useNavigate } from 'react-router-dom';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTopic?: (topicId: string, topicTitle: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectTopic }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const subjects = useLiveQuery(() => localDb.subjects.toArray(), []) || [];
  const chapters = useLiveQuery(() => localDb.chapters.toArray(), []) || [];
  const topics = useLiveQuery(() => localDb.topics.toArray(), []) || [];
  const skills = useLiveQuery(() => localDb.skills.toArray(), []) || [];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  const filteredTopics = cleanQuery
    ? topics.filter(t => t.title.toLowerCase().includes(cleanQuery) || t.notes?.toLowerCase().includes(cleanQuery)).slice(0, 5)
    : topics.slice(0, 4);

  const filteredSubjects = cleanQuery
    ? subjects.filter(s => s.name.toLowerCase().includes(cleanQuery)).slice(0, 3)
    : subjects.slice(0, 3);

  const filteredSkills = cleanQuery
    ? skills.filter(s => s.name.toLowerCase().includes(cleanQuery) || s.goal.toLowerCase().includes(cleanQuery)).slice(0, 3)
    : skills.slice(0, 2);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full max-w-xl"
        >
          <Card variant="glass" className="overflow-hidden border-neon-cyan/40 shadow-2xl p-0">
            {/* Input bar */}
            <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200/80 dark:border-space-border/60">
              <Search className="w-5 h-5 text-neon-cyan mr-3 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search subjects, chapters, topics, skills..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-block ml-3 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200/50 dark:bg-space-850 rounded border border-slate-300 dark:border-space-border">
                ESC
              </kbd>
            </div>

            {/* Results container */}
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
              {/* Topics */}
              {filteredTopics.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" /> Topics
                  </div>
                  <div className="space-y-1">
                    {filteredTopics.map(topic => {
                      const subject = subjects.find(s => s.id === topic.subjectId);
                      const chapter = chapters.find(c => c.id === topic.chapterId);
                      return (
                        <div
                          key={topic.id}
                          onClick={() => {
                            if (onSelectTopic) {
                              onSelectTopic(topic.id, topic.title);
                            } else {
                              navigate('/syllabus');
                            }
                            onClose();
                          }}
                          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-space-850/80 transition-colors cursor-pointer flex items-center justify-between group"
                        >
                          <div>
                            <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-neon-cyan transition-colors">
                              {topic.title}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>{subject?.name || 'Syllabus'}</span>
                              <span>•</span>
                              <span>{chapter?.title || 'Chapter'}</span>
                              <span>•</span>
                              <span className="text-amber-400">{topic.estimatedMinutes}m</span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-neon-cyan transition-all" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Subjects */}
              {filteredSubjects.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-neon-cyan" /> Subjects
                  </div>
                  <div className="space-y-1">
                    {filteredSubjects.map(sub => (
                      <div
                        key={sub.id}
                        onClick={() => {
                          navigate('/syllabus');
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-space-850/80 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color }} />
                          <span className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100">
                            {sub.name}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 group-hover:text-neon-cyan transition-colors">
                          View Syllabus →
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {filteredSkills.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-neon-purple" /> Skills Hub
                  </div>
                  <div className="space-y-1">
                    {filteredSkills.map(skill => (
                      <div
                        key={skill.id}
                        onClick={() => {
                          navigate('/skills');
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-space-850/80 transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100">
                            {skill.name}
                          </div>
                          <div className="text-[11px] text-slate-400">{skill.goal}</div>
                        </div>
                        <span className="text-xs text-slate-400 group-hover:text-neon-purple transition-colors">
                          Stage: {skill.currentStage}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
