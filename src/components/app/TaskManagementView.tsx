import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, CheckCircle2, Circle, Trash2, Edit3, Filter, Tag, Check, X, AlertCircle } from 'lucide-react';
import { Task, Priority } from '../../types';

export const TaskManagementView: React.FC = () => {
  const { tasks, addTask, editTask, deleteTask, toggleTaskComplete } = useApp();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State for New Task / Edit Task
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formSubject, setFormSubject] = useState('Physics');
  const [formPriority, setFormPriority] = useState<Priority>('Medium');
  const [formMinutes, setFormMinutes] = useState(30);

  const openAddModal = () => {
    setEditingTaskId(null);
    setFormTitle('');
    setFormSubject('Physics');
    setFormPriority('Medium');
    setFormMinutes(30);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTaskId(task.id);
    setFormTitle(task.title);
    setFormSubject(task.subject);
    setFormPriority(task.priority);
    setFormMinutes(task.estimatedMinutes);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingTaskId) {
      editTask(editingTaskId, {
        title: formTitle,
        subject: formSubject,
        priority: formPriority,
        estimatedMinutes: formMinutes,
      });
    } else {
      addTask({
        title: formTitle,
        subject: formSubject,
        priority: formPriority,
        status: 'Pending',
        estimatedMinutes: formMinutes,
      });
    }

    setIsModalOpen(false);
  };

  // Get list of unique subjects
  const subjects = ['All', ...Array.from(new Set(tasks.map(t => t.subject)))];

  // Filter tasks based on tab, subject, search query
  const filteredTasks = tasks.filter(t => {
    const matchesFilter =
      activeFilter === 'All' ? true : activeFilter === 'Pending' ? t.status === 'Pending' : t.status === 'Completed';
    const matchesSubject = selectedSubject === 'All' ? true : t.subject === selectedSubject;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-xl">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-purple-400" />
            Task Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize homework, assignments, revision goals and exam preparation.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Create New Task
        </button>
      </div>

      {/* Search & Filters Control Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Status Filters */}
        <div className="flex items-center gap-2">
          {(['All', 'Pending', 'Completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === f
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              {f} ({tasks.filter(t => f === 'All' ? true : f === 'Pending' ? t.status === 'Pending' : t.status === 'Completed').length})
            </button>
          ))}
        </div>

        {/* Search & Subject Select */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Subject Dropdown */}
          <div className="flex items-center gap-2 bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-purple-400" />
            <span>Subject:</span>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              {subjects.map(s => (
                <option key={s} value={s} className="bg-slate-900 text-white">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-white text-xs focus:outline-none focus:border-purple-500 placeholder-slate-500"
            />
          </div>
        </div>

      </div>

      {/* Task Cards List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/60 text-slate-400">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="font-semibold text-sm">No tasks found</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing your search query or creating a new task.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                task.status === 'Completed'
                  ? 'bg-slate-950/40 border-slate-800/50 opacity-70'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-purple-500/50 shadow-md'
              }`}
            >
              {/* Checkbox + Details */}
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  onClick={() => toggleTaskComplete(task.id)}
                  className="text-purple-400 shrink-0 hover:scale-110 transition-transform"
                >
                  {task.status === 'Completed' ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-400/20" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-500 hover:text-purple-400" />
                  )}
                </button>

                <div className="truncate">
                  <div className={`text-sm font-semibold ${task.status === 'Completed' ? 'line-through text-slate-400' : 'text-white'}`}>
                    {task.title}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700/60 text-purple-300">
                      <Tag className="w-3 h-3" />
                      {task.subject}
                    </span>
                    <span>•</span>
                    <span className={`font-semibold px-2 py-0.5 rounded-md text-[11px] ${
                      task.priority === 'High'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : task.priority === 'Medium'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {task.priority} Priority
                    </span>
                    <span>•</span>
                    <span>~{task.estimatedMinutes} mins</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEditModal(task)}
                  title="Edit Task"
                  className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteTask(task.id)}
                  title="Delete Task"
                  className="p-2 rounded-xl bg-slate-800/60 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700/60 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white">
                {editingTaskId ? 'Edit Task' : 'Create New Task'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics Quantum Mechanics Assignment"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Subject / Category</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Physics"
                    value={formSubject}
                    onChange={e => setFormSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority Level</label>
                  <select
                    value={formPriority}
                    onChange={e => setFormPriority(e.target.value as Priority)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Time (Minutes)</label>
                <input
                  type="number"
                  min={5}
                  max={300}
                  value={formMinutes}
                  onChange={e => setFormMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  {editingTaskId ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
