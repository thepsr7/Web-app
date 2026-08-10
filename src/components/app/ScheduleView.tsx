import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Plus, Clock, CheckCircle2, Circle, Trash2, BookOpen } from 'lucide-react';

export const ScheduleView: React.FC = () => {
  const { schedule, addScheduleItem, toggleScheduleItem, deleteScheduleItem } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [time, setTime] = useState('04:00 PM');
  const [subject, setSubject] = useState('Physics');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;
    addScheduleItem({
      time,
      subject,
      description: description || 'Study block',
    });
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-400" />
            Today's Schedule Planner
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Map out structured study blocks throughout your day to balance all subjects.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Schedule Block
        </button>
      </div>

      {/* Schedule Items List */}
      <div className="space-y-3">
        {schedule.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/60 text-slate-400">
            <Clock className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="font-semibold text-sm">No schedule blocks added yet</p>
          </div>
        ) : (
          schedule.map(item => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                item.completed
                  ? 'bg-slate-950/40 border-slate-800/50 opacity-60'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-purple-500/50 shadow-md'
              }`}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleScheduleItem(item.id)}
                  className="text-purple-400 shrink-0"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-500 hover:text-purple-400" />
                  )}
                </button>

                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-xs text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                    {item.time}
                  </span>
                  <div>
                    <h3 className={`text-sm font-semibold ${item.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                      {item.subject}
                    </h3>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  item.completed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-300'
                }`}>
                  {item.completed ? 'Completed' : 'Upcoming'}
                </span>

                <button
                  onClick={() => deleteScheduleItem(item.id)}
                  className="p-2 rounded-xl bg-slate-800/60 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              Add Study Block
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Time Slot</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 04:00 PM"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quantum Physics"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Goal</label>
                <input
                  type="text"
                  placeholder="e.g. Solve Chapter 4 numerical problems"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30"
                >
                  Add Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
