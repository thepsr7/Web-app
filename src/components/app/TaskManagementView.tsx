import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plus,
  CheckCircle2,
  Trash2,
  ClipboardList,
  Sparkles,
  Calendar,
  Clock,
  Menu
} from 'lucide-react';

export const TaskManagementView: React.FC = () => {
  const { tasks, openAddTaskModal, toggleTaskComplete, deleteTask } = useApp();

  const [filterTab, setFilterTab] = useState<'Today' | 'Upcoming' | 'Completed'>('Today');

  // Filter tasks based on selected tab
  const filteredTasks = tasks.filter(t => {
    if (filterTab === 'Completed') {
      return t.status === 'Completed';
    } else if (filterTab === 'Today') {
      return t.status === 'Pending';
    } else {
      // Upcoming
      return t.status === 'Pending' && t.dueDate;
    }
  });

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          <Menu className="w-6 h-6 text-[#9CA3AF] md:hidden" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Tasks</h1>
        </div>

        <button
          onClick={openAddTaskModal}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:opacity-95 text-white text-xs font-extrabold shadow-lg shadow-[#8B5CF6]/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filter Tabs: Today, Upcoming, Completed */}
      <div className="p-1.5 rounded-2xl bg-[#141726] border border-[#2A2A40] grid grid-cols-3 gap-1.5 shadow-md">
        {(['Today', 'Upcoming', 'Completed'] as const).map(tab => {
          const isSel = filterTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all text-center ${
                isSel
                  ? 'bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white shadow-md shadow-[#8B5CF6]/30'
                  : 'text-[#9CA3AF] hover:text-white hover:bg-[#2A2A40]/50'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Task List or Empty State */}
      {filteredTasks.length === 0 ? (
        <div className="p-10 sm:p-14 rounded-[22px] bg-[#141726] border border-[#2A2A40] flex flex-col items-center justify-center text-center space-y-4 my-6 shadow-xl">
          
          {/* Clipboard Empty Illustration */}
          <div className="relative w-24 h-24 rounded-2xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 flex items-center justify-center">
            <ClipboardList className="w-12 h-12 text-[#8B5CF6]" />
            <Sparkles className="w-5 h-5 text-[#A855F7] absolute -top-2 -right-2 animate-pulse" />
            <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-white">No tasks yet</h3>
            <p className="text-xs text-[#9CA3AF] max-w-xs leading-relaxed">
              {filterTab === 'Completed'
                ? 'You have not completed any tasks yet.'
                : 'You haven\'t added any tasks. Add a task to get started!'}
            </p>
          </div>

          <button
            onClick={openAddTaskModal}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-[#8B5CF6]/30 transition-all flex items-center gap-2 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Your First Task</span>
          </button>
        </div>
      ) : (
        /* Render Tasks */
        <div className="space-y-3">
          {filteredTasks.map(t => (
            <div
              key={t.id}
              className="p-4 sm:p-5 rounded-[22px] bg-[#141726] border border-[#2A2A40] hover:border-[#8B5CF6]/50 transition-all flex items-center justify-between gap-3 group shadow-md"
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <button
                  onClick={() => toggleTaskComplete(t.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                    t.status === 'Completed'
                      ? 'bg-[#22C55E] border-[#22C55E] text-white'
                      : 'border-[#2A2A40] hover:border-[#8B5CF6] text-transparent'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <div className="min-w-0 flex-1">
                  <h4 className={`text-sm font-bold text-white truncate ${
                    t.status === 'Completed' ? 'line-through text-[#9CA3AF]' : ''
                  }`}>
                    {t.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-[#9CA3AF]">
                    <span>{t.subject}</span>
                    {t.dueDate && (
                      <span className="flex items-center gap-1 text-[#8B5CF6] font-medium">
                        <Calendar className="w-3 h-3" />
                        {t.dueDate}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {t.estimatedMinutes}m
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${
                  t.priority === 'High'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    : t.priority === 'Medium'
                    ? 'bg-[#F59E0B]/10 border-[#F59E0B]/30 text-[#F59E0B]'
                    : 'bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E]'
                }`}>
                  {t.priority}
                </span>

                <button
                  onClick={() => deleteTask(t.id)}
                  className="p-2 text-[#9CA3AF] hover:text-rose-400 rounded-xl hover:bg-[#2A2A40]/50 transition-colors"
                  title="Delete Task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
