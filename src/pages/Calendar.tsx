import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useZenZStore } from '../store/useZenZStore';
import { ZenZCard } from '../components/common/ZenZCard';
import { ZenZPillButton } from '../components/common/ZenZPillButton';
import {
  CalendarDays,
  List,
  Plus,
  Trash2,
  X,
  Clock,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';
import type { CalendarEvent, EventCategory } from '../types/zenz';

const CATEGORIES: EventCategory[] = [
  'Exam',
  'Presentation',
  'Assignment submission',
  'Lab viva',
  'Birthday',
  'Other',
];

const PRESET_COLORS = [
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#F97316', // Orange
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#F43F5E', // Rose
];

export const Calendar: React.FC = () => {
  const { calendarEvents, addCalendarEvent, deleteCalendarEvent, updateCalendarEvent } =
    useZenZStore();

  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Modal State for Add / Edit Event
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState(selectedDateStr);
  const [time, setTime] = useState('');
  const [category, setCategory] = useState<EventCategory>('Exam');
  const [repeat, setRepeat] = useState<'none' | 'yearly'>('none');
  const [reminder, setReminder] = useState<'on_day' | 'day_before' | 'hour_before' | 'none'>(
    'day_before'
  );
  const [color, setColor] = useState('#EC4899');
  const [notes, setNotes] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0 to 11
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleOpenAddModal = (dateStr?: string) => {
    setEditingEventId(null);
    setTitle('');
    setEventDate(dateStr || selectedDateStr);
    setTime('10:00');
    setCategory('Exam');
    setRepeat('none');
    setReminder('day_before');
    setColor('#EC4899');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (evt: CalendarEvent) => {
    setEditingEventId(evt.id);
    setTitle(evt.title);
    setEventDate(evt.date);
    setTime(evt.time || '');
    setCategory(evt.category);
    setRepeat(evt.repeat);
    setReminder(evt.reminder);
    setColor(evt.color);
    setNotes(evt.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !eventDate) return;

    if (editingEventId) {
      updateCalendarEvent(editingEventId, {
        title: title.trim(),
        date: eventDate,
        time: time || undefined,
        category,
        repeat,
        reminder,
        color,
        notes: notes.trim() || undefined,
      });
    } else {
      addCalendarEvent({
        title: title.trim(),
        date: eventDate,
        time: time || undefined,
        category,
        repeat,
        reminder,
        color,
        notes: notes.trim() || undefined,
      });
    }
    setIsModalOpen(false);
  };

  // Group events by date string
  const eventsByDate: Record<string, CalendarEvent[]> = {};
  calendarEvents.forEach((evt) => {
    if (!eventsByDate[evt.date]) eventsByDate[evt.date] = [];
    eventsByDate[evt.date].push(evt);
  });

  const getCountdown = (dStr: string) => {
    const today = new Date(todayStr);
    const target = new Date(dStr);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today!';
    if (diff === 1) return 'Tomorrow';
    if (diff > 1) return `in ${diff} days`;
    return `${Math.abs(diff)}d ago`;
  };

  // Sorted upcoming events
  const sortedEvents = [...calendarEvents].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-6 pb-24 max-w-md md:max-w-4xl mx-auto px-4 pt-4">
      {/* Header & View Mode Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-sans flex items-center gap-2">
            Important Dates 🗓️
          </h2>
          <p className="text-xs text-slate-500 dark:text-purple-300/70 mt-0.5">
            Exams, presentations, lab vivas & assignment submission deadlines.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/70 dark:bg-[#1C162E]/70 border border-purple-200/60 dark:border-purple-500/20">
          <button
            onClick={() => setViewMode('month')}
            aria-label="Month View"
            className={`p-2 rounded-xl transition-all ${
              viewMode === 'month'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('agenda')}
            aria-label="Agenda View"
            className={`p-2 rounded-xl transition-all ${
              viewMode === 'agenda'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* MONTH VIEW */}
      {viewMode === 'month' && (
        <ZenZCard variant="glass" className="p-4 sm:p-6 space-y-4 border-purple-200/70 shadow-md">
          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white font-sans">
              {monthNames[month]} {year}
            </h3>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-2.5 py-1 text-xs font-bold rounded-lg text-pink-600 dark:text-pink-300 hover:bg-pink-50 dark:hover:bg-purple-950/40"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Month Grid Cells */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty prefix cells */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty_${i}`} className="h-10 sm:h-12" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
                dayNum
              ).padStart(2, '0')}`;
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDateStr;
              const dayEvents = eventsByDate[dateStr] || [];

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-11 sm:h-14 rounded-2xl flex flex-col items-center justify-between p-1 transition-all border ${
                    isSelected
                      ? 'border-pink-400 bg-pink-500/15 dark:bg-pink-500/25 shadow-sm'
                      : isToday
                      ? 'border-purple-300 bg-purple-50 dark:bg-purple-950/40'
                      : 'border-transparent hover:bg-purple-50/50 dark:hover:bg-purple-950/20'
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${
                      isToday
                        ? 'text-pink-600 dark:text-pink-400 font-black'
                        : 'text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {dayNum}
                  </span>

                  {/* Colored dots for events */}
                  <div className="flex gap-1 flex-wrap justify-center max-w-[28px] overflow-hidden">
                    {dayEvents.slice(0, 3).map((evt) => (
                      <span
                        key={evt.id}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: evt.color }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Add Event Button for selected date */}
          <div className="pt-2 flex items-center justify-between border-t border-purple-100 dark:border-purple-500/20">
            <span className="text-xs font-semibold text-slate-500 dark:text-purple-300">
              Selected: <strong className="text-slate-900 dark:text-white">{selectedDateStr}</strong>
            </span>
            <ZenZPillButton
              size="sm"
              onClick={() => handleOpenAddModal(selectedDateStr)}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              Add Event
            </ZenZPillButton>
          </div>
        </ZenZCard>
      )}

      {/* AGENDA / UPCOMING LIST VIEW */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {viewMode === 'month'
              ? `Events for ${selectedDateStr}`
              : 'All Upcoming Agenda Events'}
          </h4>
          {viewMode === 'agenda' && (
            <ZenZPillButton
              size="sm"
              onClick={() => handleOpenAddModal()}
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              New Event
            </ZenZPillButton>
          )}
        </div>

        {/* List items */}
        {(() => {
          const list =
            viewMode === 'month'
              ? eventsByDate[selectedDateStr] || []
              : sortedEvents;

          if (list.length === 0) {
            return (
              <ZenZCard variant="glass" className="p-6 text-center">
                <CalendarIcon className="w-8 h-8 text-pink-400 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  No events on this day.
                </p>
                <button
                  onClick={() => handleOpenAddModal(selectedDateStr)}
                  className="mt-2 text-xs font-bold text-pink-500 hover:underline"
                >
                  + Add an event for {selectedDateStr}
                </button>
              </ZenZCard>
            );
          }

          return (
            <div className="space-y-2.5">
              {list.map((evt) => {
                const countdown = getCountdown(evt.date);
                const isToday = evt.date === todayStr;

                return (
                  <ZenZCard
                    key={evt.id}
                    variant="glass"
                    className={`p-4 flex items-center justify-between gap-3 border transition-all ${
                      isToday
                        ? 'border-pink-400/80 bg-pink-500/10 dark:bg-pink-500/15'
                        : 'border-purple-200/60 hover:border-pink-300'
                    }`}
                  >
                    <div
                      onClick={() => handleOpenEditModal(evt)}
                      className="flex items-start gap-3 cursor-pointer flex-1"
                    >
                      <div
                        className="w-3 h-3 rounded-full mt-1 shrink-0"
                        style={{ backgroundColor: evt.color }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[10px] font-bold px-2 py-0.2 rounded-full"
                            style={{ backgroundColor: `${evt.color}25`, color: evt.color }}
                          >
                            {evt.category}
                          </span>
                          {evt.repeat === 'yearly' && (
                            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-0.5">
                              <RotateCw className="w-3 h-3 text-purple-400" /> Yearly
                            </span>
                          )}
                        </div>

                        <h5 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                          {evt.title}
                        </h5>

                        <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{evt.date}</span>
                          {evt.time && (
                            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                              <Clock className="w-3 h-3" /> {evt.time}
                            </span>
                          )}
                          {evt.notes && <span>• {evt.notes}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          isToday
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                        }`}
                      >
                        {countdown}
                      </span>

                      <button
                        onClick={() => deleteCalendarEvent(evt.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </ZenZCard>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* ADD / EDIT EVENT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              className="w-full max-w-md"
            >
              <ZenZCard variant="glass" className="p-6 relative border-purple-300/40">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  {editingEventId ? 'Edit Event' : 'Add Important Date'}
                </h3>

                <form onSubmit={handleSaveEvent} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-purple-300 uppercase tracking-wider block mb-1">
                      Event Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Automata Mid-Sem Test"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-500/30 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-pink-400/30"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-purple-300 uppercase tracking-wider block mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        required
                        className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-500/30 text-slate-800 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-purple-300 uppercase tracking-wider block mb-1">
                        Time (Optional)
                      </label>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-500/30 text-slate-800 dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-purple-300 uppercase tracking-wider block mb-1">
                        Category
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as EventCategory)}
                        className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-500/30 text-slate-800 dark:text-white outline-none"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-purple-300 uppercase tracking-wider block mb-1">
                        Repeat
                      </label>
                      <select
                        value={repeat}
                        onChange={(e) => setRepeat(e.target.value as any)}
                        className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-500/30 text-slate-800 dark:text-white outline-none"
                      >
                        <option value="none">Does not repeat</option>
                        <option value="yearly">Every year (Birthdays)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-purple-300 uppercase tracking-wider block mb-1">
                      Reminder Notice
                    </label>
                    <select
                      value={reminder}
                      onChange={(e) => setReminder(e.target.value as any)}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-500/30 text-slate-800 dark:text-white outline-none"
                    >
                      <option value="on_day">On the day of event</option>
                      <option value="day_before">1 day before</option>
                      <option value="hour_before">1 hour before</option>
                      <option value="none">No reminder</option>
                    </select>
                  </div>

                  {/* Color tag picker */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-purple-300 uppercase tracking-wider block mb-1.5">
                      Color Tag
                    </label>
                    <div className="flex gap-2">
                      {PRESET_COLORS.map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setColor(col)}
                          className={`w-7 h-7 rounded-full transition-transform ${
                            color === col ? 'scale-125 ring-2 ring-purple-400 ring-offset-2' : ''
                          }`}
                          style={{ backgroundColor: col }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-purple-300 uppercase tracking-wider block mb-1">
                      Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Bring lab file and calculator"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-500/30 text-slate-800 dark:text-white outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <ZenZPillButton type="submit" size="md" className="w-full shadow-lg">
                      {editingEventId ? 'Update Event' : 'Save Event'}
                    </ZenZPillButton>
                  </div>
                </form>
              </ZenZCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
