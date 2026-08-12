import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Flag, FileText, CheckCircle2, Edit3 } from 'lucide-react';
import { Priority } from '../../types';

export const AddTaskModal: React.FC = () => {
  const { isAddTaskModalOpen, closeAddTaskModal, addTask } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');

  if (!isAddTaskModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      subject: description.trim() || 'General Task',
      priority,
      status: 'Pending',
      estimatedMinutes: 30,
      dueDate: dueDate || undefined,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('Medium');
    closeAddTaskModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 rounded-[22px] bg-[#141726] border border-[#2A2A40] text-white shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2A2A40]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6]">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight">Add Task</h3>
              <p className="text-[11px] text-[#9CA3AF]">Create a new study item for your queue</p>
            </div>
          </div>
          <button
            onClick={closeAddTaskModal}
            className="p-1.5 rounded-xl text-[#9CA3AF] hover:text-white hover:bg-[#2A2A40]/60 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Task Title */}
          <div>
            <label className="block text-xs font-semibold text-[#9CA3AF] mb-1.5 flex items-center gap-1.5">
              <span>Task Title</span>
              <span className="text-[#8B5CF6]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Enter task title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#09090F] border border-[#2A2A40] text-white placeholder-[#9CA3AF]/60 text-xs focus:outline-none focus:border-[#8B5CF6] transition-all"
            />
          </div>

          {/* Description / Subject */}
          <div>
            <label className="block text-xs font-semibold text-[#9CA3AF] mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Enter description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#09090F] border border-[#2A2A40] text-white placeholder-[#9CA3AF]/60 text-xs focus:outline-none focus:border-[#8B5CF6] transition-all resize-none"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-semibold text-[#9CA3AF] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Due Date</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#09090F] border border-[#2A2A40] text-white text-xs focus:outline-none focus:border-[#8B5CF6] transition-all"
            />
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#9CA3AF] mb-1.5 flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-[#8B5CF6]" />
              <span>Priority</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Low', 'Medium', 'High'] as Priority[]).map(p => {
                const isSel = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isSel
                        ? p === 'High'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                          : p === 'Medium'
                          ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B]'
                          : 'bg-[#22C55E]/20 border-[#22C55E] text-[#22C55E]'
                        : 'bg-[#09090F] border-[#2A2A40] text-[#9CA3AF] hover:border-slate-700'
                    }`}
                  >
                    <span>{p}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-[#8B5CF6]/25 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </form>
      </div>
    </div>
  );
};
