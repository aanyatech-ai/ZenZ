import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useZenZStore } from '../store/useZenZStore';
import { ZenZCard } from '../components/common/ZenZCard';
import { ZenZPillButton } from '../components/common/ZenZPillButton';
import {
  FileText,
  Pin,
  Plus,
  Trash2,
  Search,
  CheckSquare,
  Square,
  X,
  Bold,
  List,
} from 'lucide-react';
import type { Note } from '../types/zenz';

const NOTE_COLORS = [
  '#F3E8FF', // Soft Lavender
  '#FCE7F3', // Soft Pink
  '#FFEDD5', // Soft Peach
  '#D1FAE5', // Soft Mint
  '#E0F2FE', // Soft Sky
  '#FEF9C3', // Soft Yellow
];

export const Notepad: React.FC = () => {
  const {
    notes,
    addNote,
    updateNote,
    deleteNote,
    toggleNotePin,
    toggleNoteChecklistItem,
    subjects,
  } = useZenZStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pinned' | string>('all');

  // Modal / Editor State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [color, setColor] = useState('#F3E8FF');
  const [subjectCode, setSubjectCode] = useState<string>('');
  const [checklists, setChecklists] = useState<Array<{ id: string; text: string; done: boolean }>>([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  const handleOpenAddNote = () => {
    setEditingNoteId(null);
    setTitle('');
    setBody('');
    setColor('#F3E8FF');
    setSubjectCode('');
    setChecklists([]);
    setNewChecklistText('');
    setIsModalOpen(true);
  };

  const handleOpenEditNote = (note: Note) => {
    setEditingNoteId(note.id);
    setTitle(note.title);
    setBody(note.body);
    setColor(note.color || '#F3E8FF');
    setSubjectCode(note.subjectCode || '');
    setChecklists(note.checklists || []);
    setNewChecklistText('');
    setIsModalOpen(true);
  };

  const handleSaveNote = () => {
    if (!title.trim() && !body.trim() && checklists.length === 0) return;

    if (editingNoteId) {
      updateNote(editingNoteId, {
        title: title.trim() || 'Untitled Note',
        body,
        color,
        subjectCode: subjectCode || undefined,
        checklists,
      });
    } else {
      addNote({
        title: title.trim() || 'Untitled Note',
        body,
        pinned: false,
        color,
        subjectCode: subjectCode || undefined,
        checklists,
      });
    }
    setIsModalOpen(false);
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistText.trim()) return;
    setChecklists([
      ...checklists,
      { id: `chk_${Date.now()}`, text: newChecklistText.trim(), done: false },
    ]);
    setNewChecklistText('');
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklists(checklists.filter((item) => item.id !== id));
  };

  // Filter & Search logic
  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.body.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'pinned') return n.pinned;
    if (selectedFilter !== 'all') return n.subjectCode === selectedFilter;
    return true;
  });

  const pinnedNotes = filteredNotes.filter((n) => n.pinned);
  const otherNotes = filteredNotes.filter((n) => !n.pinned);

  const renderNoteCard = (note: Note) => (
    <motion.div
      key={note.id}
      whileHover={{ y: -3 }}
      className="rounded-3xl p-5 border border-purple-200/60 dark:border-purple-500/20 shadow-md relative group select-none transition-all flex flex-col justify-between"
      style={{ backgroundColor: `${note.color || '#F3E8FF'}CC` }}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {note.subjectCode && (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/70 text-purple-800 shadow-xs">
                {note.subjectCode}
              </span>
            )}
            <h5 className="text-sm font-bold text-slate-900 line-clamp-1">{note.title}</h5>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => toggleNotePin(note.id)}
              className={`p-1.5 rounded-full hover:bg-white/60 transition-colors ${
                note.pinned ? 'text-pink-600' : 'text-slate-400'
              }`}
              title={note.pinned ? 'Unpin' : 'Pin to top'}
            >
              <Pin className={`w-3.5 h-3.5 ${note.pinned ? 'fill-pink-600' : ''}`} />
            </button>
            <button
              onClick={() => deleteNote(note.id)}
              className="p-1.5 rounded-full hover:bg-white/60 text-slate-400 hover:text-rose-500 transition-colors"
              title="Delete note"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div
          onClick={() => handleOpenEditNote(note)}
          className="text-xs text-slate-700 whitespace-pre-line leading-relaxed cursor-pointer line-clamp-4"
        >
          {note.body}
        </div>

        {note.checklists && note.checklists.length > 0 && (
          <div className="mt-3 space-y-1.5 pt-2 border-t border-purple-200/40">
            {note.checklists.slice(0, 3).map((item) => (
              <div
                key={item.id}
                onClick={() => toggleNoteChecklistItem(note.id, item.id)}
                className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer"
              >
                {item.done ? (
                  <CheckSquare className="w-3.5 h-3.5 text-pink-600 shrink-0" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <span className={item.done ? 'line-through text-slate-500' : ''}>
                  {item.text}
                </span>
              </div>
            ))}
            {note.checklists.length > 3 && (
              <span className="text-[10px] text-slate-500 font-semibold">
                +{note.checklists.length - 3} more items...
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-black/5">
        <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
        <button
          onClick={() => handleOpenEditNote(note)}
          className="font-bold text-purple-700 hover:underline"
        >
          Edit →
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6 pb-24 max-w-md md:max-w-4xl mx-auto px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-sans flex items-center gap-2">
            Study Notepad 📝
          </h2>
          <p className="text-xs text-slate-500 dark:text-purple-300/70 mt-0.5">
            Cheatsheets, tricky concepts, checklists & sticky notes.
          </p>
        </div>

        <ZenZPillButton
          size="sm"
          onClick={handleOpenAddNote}
          icon={<Plus className="w-3.5 h-3.5" />}
        >
          New Note
        </ZenZPillButton>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-2">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search notes by keyword or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-semibold pl-10 pr-4 py-2.5 rounded-2xl bg-white/70 dark:bg-[#1C162E]/70 border border-purple-200/60 dark:border-purple-500/20 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-pink-400/30"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-bold">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-full shrink-0 transition-all ${
              selectedFilter === 'all'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                : 'bg-white/70 dark:bg-[#1C162E]/70 text-slate-600 dark:text-slate-300 border border-purple-200/50'
            }`}
          >
            All Notes ({notes.length})
          </button>
          <button
            onClick={() => setSelectedFilter('pinned')}
            className={`px-3 py-1.5 rounded-full shrink-0 flex items-center gap-1 transition-all ${
              selectedFilter === 'pinned'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                : 'bg-white/70 dark:bg-[#1C162E]/70 text-slate-600 dark:text-slate-300 border border-purple-200/50'
            }`}
          >
            <Pin className="w-3 h-3 text-pink-400" /> Pinned
          </button>

          {subjects
            .filter((s) => s.type === 'theory')
            .map((sub) => (
              <button
                key={sub.code}
                onClick={() => setSelectedFilter(sub.code)}
                className={`px-3 py-1.5 rounded-full shrink-0 transition-all ${
                  selectedFilter === sub.code
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                    : 'bg-white/70 dark:bg-[#1C162E]/70 text-slate-600 dark:text-slate-300 border border-purple-200/50'
                }`}
              >
                {sub.code}
              </button>
            ))}
        </div>
      </div>

      {/* PINNED NOTES SECTION */}
      {pinnedNotes.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-pink-500 flex items-center gap-1 px-1">
            <Pin className="w-3.5 h-3.5 fill-pink-500" /> Pinned Notes
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {pinnedNotes.map((note) => renderNoteCard(note))}
          </div>
        </div>
      )}

      {/* ALL / OTHER NOTES SECTION */}
      <div className="space-y-3">
        {pinnedNotes.length > 0 && (
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Other Notes
          </h4>
        )}

        {filteredNotes.length === 0 ? (
          <ZenZCard variant="glass" className="p-8 text-center">
            <FileText className="w-8 h-8 text-purple-400 mx-auto mb-2 opacity-50" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              No notes found. Tap "New Note" to create one! 🌸
            </p>
          </ZenZCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {otherNotes.map((note) => renderNoteCard(note))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT NOTE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              className="w-full max-w-lg"
            >
              <ZenZCard variant="glass" className="p-6 relative border-purple-300/40 space-y-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {editingNoteId ? 'Edit Study Note' : 'Create Study Note'}
                </h3>

                {/* Title */}
                <div>
                  <input
                    type="text"
                    placeholder="Note Title (e.g. Automata Arden's Theorem)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-sm font-bold px-3.5 py-2.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-500/30 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-pink-400/30"
                  />
                </div>

                {/* Subject Selector & Pastel Color Picker */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Subject Tag (Optional)
                    </label>
                    <select
                      value={subjectCode}
                      onChange={(e) => setSubjectCode(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-500/30 text-slate-800 dark:text-white outline-none"
                    >
                      <option value="">No Subject</option>
                      {subjects.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.code}: {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Sticky Pastel Color
                    </label>
                    <div className="flex gap-2">
                      {NOTE_COLORS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColor(c)}
                          className={`w-7 h-7 rounded-full transition-transform ${
                            color === c ? 'scale-125 ring-2 ring-purple-400' : ''
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Body Textarea with Markdown/Bold/List shortcuts */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Note Body
                    </label>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="flex items-center gap-0.5">
                        <Bold className="w-3 h-3" /> **bold**
                      </span>
                      <span className="flex items-center gap-0.5">
                        <List className="w-3 h-3" /> - bullets
                      </span>
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    placeholder="Write key equations, derivations, exam tips, and pointers..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full text-xs font-semibold p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-500/30 text-slate-900 dark:text-white outline-none resize-none"
                  />
                </div>

                {/* Checklist Section */}
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Interactive Checklist
                  </label>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto mb-2">
                    {checklists.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-xs"
                      >
                        <span className="text-slate-800 dark:text-slate-200">{item.text}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveChecklistItem(item.id)}
                          className="text-slate-400 hover:text-rose-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add checklist item..."
                      value={newChecklistText}
                      onChange={(e) => setNewChecklistText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddChecklistItem();
                        }
                      }}
                      className="flex-1 text-xs font-semibold px-3 py-2 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-500/30 text-slate-800 dark:text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddChecklistItem}
                      className="px-3 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 font-bold text-xs"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <ZenZPillButton size="md" onClick={handleSaveNote} className="w-full shadow-lg">
                    {editingNoteId ? 'Update Note' : 'Save Note'}
                  </ZenZPillButton>
                </div>
              </ZenZCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
